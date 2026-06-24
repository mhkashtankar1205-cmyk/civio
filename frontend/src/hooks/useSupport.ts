import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supportService } from '../services/supportService';

export function useSupport() {
  const queryClient = useQueryClient();

  // Mutation: Support issue
  const useSupportMutation = () => {
    return useMutation({
      mutationFn: (postId: string) => supportService.supportIssue(postId),
      onSuccess: () => {
        // Invalidate posts list
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    });
  };

  // Mutation: Upvote issue
  const useUpvoteMutation = () => {
    return useMutation({
      mutationFn: (postId: string) => supportService.upvoteIssue(postId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    });
  };

  return {
    useSupportMutation,
    useUpvoteMutation
  };
}
