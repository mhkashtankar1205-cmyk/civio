export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  area: string;
  avatar: string;
  verified: boolean;
  issuesReported: number;
  issuesSupported: number;
  impactScore: number;
  role?: 'citizen' | 'admin';
}

export interface Post {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  description: string;
  imageUrl: string;
  beforeImage?: string;
  afterImage?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  geoLocation: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude] for MongoDB
  };
  area: string;
  distance: string;
  category: string;
  status: 'Reported' | 'Under Review' | 'In Progress' | 'Resolved';
  upvotes: number;
  commentsCount: number;
  supportGoalPercent?: number; // Optional community support goal
  supportedBy: string[]; // List of user IDs who supported this issue
  upvotedBy: string[]; // List of user IDs who upvoted this issue
  createdAt: string;
  adminNotes?: string;
  statusHistory?: Array<{ status: string; timestamp: string }>;
  reporter?: {
    name: string;
    email: string;
    area: string;
  };
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  createdAt: string;
}

export interface Support {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'support' | 'comment' | 'trending' | 'resolve' | 'milestone';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
