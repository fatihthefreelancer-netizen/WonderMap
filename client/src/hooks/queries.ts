import { useQuery, useMutation } from '@tanstack/react-query';
import type { CompleteLessonInput } from '@wondermap/shared';
import { worldService, metaService } from '../lib/services';
import { useAuthStore } from '../store/authStore';

export function useWorlds() {
  return useQuery({ queryKey: ['worlds'], queryFn: worldService.list });
}

export function useWorld(worldId: string | null) {
  return useQuery({
    queryKey: ['world', worldId],
    queryFn: () => worldService.get(worldId as string),
    enabled: !!worldId,
  });
}

export function useAchievements() {
  return useQuery({ queryKey: ['achievements'], queryFn: metaService.achievements });
}

export function useCompleteLesson() {
  const applyProgress = useAuthStore((s) => s.applyProgress);
  return useMutation({
    mutationFn: (input: CompleteLessonInput) => worldService.complete(input),
    onSuccess: (result) => {
      applyProgress(result.progress);
    },
  });
}
