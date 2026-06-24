import apiClient from './apiClient';
import { Post } from '../types';

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const mapCategoryToBackend = (cat: string): string => {
  switch (cat) {
    case 'Pothole': return 'Road';
    case 'Lighting': return 'Electricity';
    case 'Garbage': return 'Garbage';
    case 'Water': return 'Water';
    default: return 'Other';
  }
};

const mapCategoryToFrontend = (cat: string): string => {
  switch (cat) {
    case 'Road': return 'Pothole';
    case 'Electricity': return 'Lighting';
    case 'Garbage': return 'Garbage';
    case 'Water': return 'Water';
    default: return 'Pothole';
  }
};

const mapStatusToBackend = (status: string): string => {
  switch (status) {
    case 'Reported':
      return 'Pending';
    case 'Under Review':
      return 'Under Review';
    case 'In Progress':
      return 'In Progress';
    case 'Resolved':
      return 'Resolved';
    default:
      return 'Pending';
  }
};

const mapStatusToFrontend = (status: string): Post['status'] => {
  switch (status) {
    case 'Pending':
      return 'Reported';
    case 'Under Review':
      return 'Under Review';
    case 'In Progress':
      return 'In Progress';
    case 'Resolved':
      return 'Resolved';
    default:
      return 'Reported';
  }
};

const mapIssueToPost = (issue: any): Post => {
  return {
    id: issue._id,
    userId: issue.reportedBy?._id || issue.reportedBy || '',
    authorName: issue.reportedBy?.name || 'Anonymous',
    authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${issue.reportedBy?.name || 'Anonymous'}`,
    title: issue.title,
    description: issue.description,
    imageUrl: issue.image || '',
    beforeImage: issue.beforeImage || issue.image || '',
    afterImage: issue.afterImage || '',
    location: {
      latitude: issue.locationDetails?.latitude || (issue.geoLocation?.coordinates ? issue.geoLocation.coordinates[1] : 21.1458),
      longitude: issue.locationDetails?.longitude || (issue.geoLocation?.coordinates ? issue.geoLocation.coordinates[0] : 79.0882)
    },
    geoLocation: issue.geoLocation || { type: 'Point', coordinates: [79.0882, 21.1458] },
    area: issue.location || 'Nagpur, Maharashtra',
    distance: 'Nearby',
    category: mapCategoryToFrontend(issue.category),
    status: mapStatusToFrontend(issue.status),
    upvotes: issue.supporters ? issue.supporters.length : 0,
    commentsCount: 0,
    supportedBy: issue.supporters || [],
    upvotedBy: issue.supporters || [],
    createdAt: issue.createdAt || new Date().toISOString(),
    adminNotes: issue.adminNotes || '',
    statusHistory: issue.statusHistory || [],
    reporter: issue.reportedBy && typeof issue.reportedBy === 'object' ? {
      name: issue.reportedBy.name || 'Anonymous',
      email: issue.reportedBy.email || '',
      area: issue.reportedBy.area || ''
    } : undefined
  };
};

export const postService = {
  getPosts: async (userCoords?: { latitude: number; longitude: number }): Promise<Post[]> => {
    const res = await apiClient.get('/issues');
    if (res.data && Array.isArray(res.data.issues)) {
      let posts = res.data.issues.map(mapIssueToPost);
      
      let currentCoords = userCoords;
      if (!currentCoords) {
        try {
          const userStr = localStorage.getItem('civio_current_user');
          if (userStr) {
            const user = JSON.parse(userStr);
            if (user.locationDetails?.latitude) {
              currentCoords = {
                latitude: user.locationDetails.latitude,
                longitude: user.locationDetails.longitude
              };
            }
          }
        } catch {}
      }

      if (!currentCoords && navigator.geolocation) {
        // Fallback or request geolocation coords if available synchronously
      }

      if (currentCoords) {
        posts = posts.map(post => {
          const distanceKm = calculateHaversineDistance(
            currentCoords!.latitude,
            currentCoords!.longitude,
            post.location.latitude,
            post.location.longitude
          );
          post.distance = `${distanceKm.toFixed(1)} km away`;
          (post as any).distanceVal = distanceKm;
          return post;
        });

        posts.sort((a, b) => {
          const distA = (a as any).distanceVal ?? 99999;
          const distB = (b as any).distanceVal ?? 99999;
          
          const rangeA = distA <= 5 ? 0 : distA <= 15 ? 1 : 2;
          const rangeB = distB <= 5 ? 0 : distB <= 15 ? 1 : 2;

          if (rangeA !== rangeB) {
            return rangeA - rangeB;
          }
          return distA - distB;
        });
      } else {
        posts = posts.map(post => {
          post.distance = 'Nearby';
          return post;
        });
      }
      return posts;
    }
    return [];
  },

  createPost: async (postData: {
    title: string;
    description: string;
    imageUrl: string;
    location: { latitude: number; longitude: number };
    area: string;
    distance: string;
    category: string;
  }): Promise<Post> => {
    const res = await apiClient.post('/issues', {
      title: postData.title,
      description: postData.description,
      category: mapCategoryToBackend(postData.category),
      location: postData.area,
      image: postData.imageUrl,
      locationDetails: {
        latitude: postData.location.latitude,
        longitude: postData.location.longitude
      },
      geoLocation: {
        type: 'Point',
        coordinates: [postData.location.longitude, postData.location.latitude]
      }
    });

    return mapIssueToPost(res.data.issue);
  },

  updatePostStatus: async (postId: string, status?: Post['status'], afterImage?: string, adminNotes?: string): Promise<Post> => {
    const res = await apiClient.patch(`/issues/${postId}/status`, {
      status: status ? mapStatusToBackend(status) : undefined,
      afterImage,
      adminNotes
    });
    return mapIssueToPost(res.data.issue);
  },

  getNearbyPosts: async (latitude: number, longitude: number, maxDistanceKm: number = 5): Promise<Post[]> => {
    return postService.getPosts({ latitude, longitude });
  },

  getDashboardStats: async () => {
    const res = await apiClient.get('/dashboard/stats');
    return res.data.stats;
  }
};
