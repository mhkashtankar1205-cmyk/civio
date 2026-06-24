import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '../services/mockApi';
import { Notification } from '../types';

export function useNotifications() {
  const queryClient = useQueryClient();

  // Query: Get notifications (empty-state for demo-safety)
  const useGetNotifications = () => {
    return useQuery<Notification[]>({
      queryKey: ['notifications'],
      queryFn: async () => []
    });
  };

  // Mutation: Mark all notifications as read (no-op)
  const useMarkReadMutation = () => {
    return useMutation({
      mutationFn: async () => {},
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    });
  };

  return {
    useGetNotifications,
    useMarkReadMutation
  };
}
