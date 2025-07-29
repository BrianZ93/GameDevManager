import { Game } from 'src/models/game';
import { serializeGame } from 'src/helpers/serializers';
import { createGameRequest } from './games';

/**
 * Sends a Game model to the backend to be created in the database.
 * @param game - The Game instance to be created.
 * @returns The created Game object as returned by the backend.
 */
export async function createGame(game: Game): Promise<Game> {
  try {
    const serialized = serializeGame(game);
    const response = await createGameRequest(serialized); // fixed call
    console.log('Game created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create game:', error);
    throw error;
  }
}