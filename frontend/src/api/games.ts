import { api } from 'src/boot/axios';
import { Game } from 'src/models/game';

export const getGames = () => api.get<Game[]>('/games');
export const getGameById = (id: string) => api.get<Game>(`/games/${id}`);
export const createGame = (game: Game) => api.post<Game>('/games', game);
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
