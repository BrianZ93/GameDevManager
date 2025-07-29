import { defineStore } from 'pinia';
import { Phase } from 'src/models/phase';
import { Game } from 'src/models/game';
import { getGames } from 'src/api/games';

export const useGameStore = defineStore('game', {
  state: () => ({
    phases: [] as Phase[],
    games: [] as Game[],
  }),
  getters: {
    getPhases: (state) => state.phases,
    getGames: (state) => state.games,
    getGameById: (state) => (id: string) => state.games.find((game) => game.id === id),
  },
  actions: {
    async fetchGames() {
      try {
        const response = await getGames();
        this.games = response.data;
      } catch (error) {
        console.error('Failed to fetch games:', error);
        this.games = [];
      }
    },
  },
  persist: {
    storage: localStorage,
  },
});