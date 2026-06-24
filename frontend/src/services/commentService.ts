import { mockApi } from './mockApi';
import { Comment } from '../types';

export const commentService = {
  getComments: async (postId: string): Promise<Comment[]> => {
    return mockApi.getComments(postId);
  },

  addComment: async (postId: string, content: string): Promise<Comment> => {
    const user = await mockApi.getCurrentUser();
    
    const commentPayload: Omit<Comment, 'id' | 'createdAt'> = {
      postId,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      content
    };

    return mockApi.addComment(postId, commentPayload);
  }
};
