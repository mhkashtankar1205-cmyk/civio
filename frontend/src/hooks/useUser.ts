import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { User } from '../types';

export function useUser() {
  const queryClient = useQueryClient();

  // Query: Get current authenticated user
  const useGetCurrentUser = () => {
    return useQuery<User>({
      queryKey: ['user'],
      queryFn: authService.getCurrentUser
    });
  };

  // Mutation: Sign up
  const useSignUpMutation = () => {
    return useMutation({
      mutationFn: authService.signUp,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user'] });
      }
    });
  };

  // Mutation: Login
  const useLoginMutation = () => {
    return useMutation({
      mutationFn: authService.login,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user'] });
      }
    });
  };

  // Mutation: Update profile
  const useUpdateProfileMutation = () => {
    return useMutation({
      mutationFn: authService.updateProfile,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    });
  };

  return {
    useGetCurrentUser,
    useSignUpMutation,
    useLoginMutation,
    useUpdateProfileMutation
  };
}
