import apiClient from './apiClient';
import { postService } from './postService';
import { Post } from '../types';

export const supportService = {
  supportIssue: async (postId: string): Promise<Post> => {
    await apiClient.post(`/issues/${postId}/support`);
    const posts = await postService.getPosts();
    const updatedPost = posts.find(p => p.id === postId);
    if (!updatedPost) {
      throw new Error('Post not found after support action');
    }
    return updatedPost;
  },

  upvoteIssue: async (postId: string): Promise<Post> => {
    // Treat upvote as support since backend has no separate upvote
    await apiClient.post(`/issues/${postId}/support`);
    const posts = await postService.getPosts();
    const updatedPost = posts.find(p => p.id === postId);
    if (!updatedPost) {
      throw new Error('Post not found after upvote action');
    }
    return updatedPost;
  }
};
