import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { Post } from '../types';

export function usePosts() {
  const queryClient = useQueryClient();

  // Query: Get all feed posts
  const useGetPosts = () => {
    return useQuery<Post[]>({
      queryKey: ['posts'],
      queryFn: postService.getPosts
    });
  };

  // Query: Get single post by ID
  const useGetPost = (postId: string) => {
    return useQuery<Post | undefined>({
      queryKey: ['posts', postId],
      queryFn: async () => {
        const posts = await postService.getPosts();
        return posts.find(p => p.id === postId);
      },
      enabled: !!postId
    });
  };

  // Query: Get nearby posts
  const useGetNearbyPosts = (latitude: number, longitude: number, maxDistanceKm: number = 5) => {
    return useQuery<Post[]>({
      queryKey: ['posts', 'nearby', latitude, longitude, maxDistanceKm],
      queryFn: () => postService.getNearbyPosts(latitude, longitude, maxDistanceKm),
      enabled: !!latitude && !!longitude
    });
  };

  // Mutation: Create a new post
  const useCreatePostMutation = () => {
    return useMutation({
      mutationFn: postService.createPost,
      onSuccess: () => {
        // Invalidate posts list
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    });
  };

  // Mutation: Update status of a post
  const useUpdatePostStatusMutation = () => {
    return useMutation({
      mutationFn: ({ postId, status }: { postId: string; status: Post['status'] }) =>
        postService.updatePostStatus(postId, status),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    });
  };

  // Query: Get comments for a post
  const useGetComments = (postId: string) => {
    return useQuery({
      queryKey: ['comments', postId],
      queryFn: () => commentService.getComments(postId),
      enabled: !!postId
    });
  };

  // Mutation: Add comment
  const useAddCommentMutation = (postId: string) => {
    return useMutation({
      mutationFn: (content: string) => commentService.addComment(postId, content),
      onSuccess: () => {
        // Invalidate comments for this post
        queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        // Invalidate posts to update comment count
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      }
    });
  };

  return {
    useGetPosts,
    useGetPost,
    useGetNearbyPosts,
    useCreatePostMutation,
    useUpdatePostStatusMutation,
    useGetComments,
    useAddCommentMutation
  };
}
