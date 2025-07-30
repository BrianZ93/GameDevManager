import { api } from 'src/boot/axios';
import { Game } from 'src/models/game';
import { Phase } from 'src/models/phase';

export const getGames = () => api.get<Game[]>('/games');
export const getGameById = (id: string) => api.get<Game>(`/games/${id}`);
export const createGameRequest = (game: Record<string, unknown>) => api.post<Game>('/games/create', game);
export const createPhaseRequest = (gameId: string, phase: { name: string; description: string }) => 
  api.post<Phase>(`/games/${gameId}/phases`, phase);
export const createFeatureGroupRequest = (phaseId: string, featureGroup: { name: string; description: string }) =>
  api.post<{ id: string; name: string; description: string; progress: number; status: string; phaseID: string }>(`/phases/${phaseId}/feature-groups`, featureGroup);

export const createFeatureRequest = (featureGroupId: string, feature: { name: string; description: string }) =>
  api.post<{ id: string; name: string; description: string; progress: number; status: string; featureGroupID: string }>(`/feature-groups/${featureGroupId}/features`, feature);
export const updateGame = (id: string, game: Game) => api.put<Game>(`/games/${id}`, game);
export const deleteGame = (id: string) => api.delete(`/games/${id}`);

// Helper function to serialize game data
export function serializeGame(game: Game): Record<string, unknown> {
  return {
    name: game.name,
    genre: game.genre,
    phases: game.phases.map(phase => ({
      id: phase.id,
      name: phase.name,
      description: phase.description,
      progress: phase.progress,
      status: phase.status,
      startDate: phase.startDate?.toISOString(),
      dueDate: phase.dueDate?.toISOString(),
      featureGroups: (phase.featureGroups ?? []).map(fg => ({
        id: fg.id,
        name: fg.name,
        description: fg.description,
        progress: fg.progress,
        status: fg.status,
        startDate: fg.startDate?.toISOString(),
        dueDate: fg.dueDate?.toISOString(),
        features: (fg.features ?? []).map(feature => ({
          id: feature.id,
          name: feature.name,
          description: feature.description,
          progress: feature.progress,
          status: feature.status,
          startDate: feature.startDate?.toISOString(),
          dueDate: feature.dueDate?.toISOString(),
          tasks: []
        }))
      }))
    }))
  };
}
