import { defineStore } from 'pinia';
import { Phase, Status, Feature, FeatureGroup } from 'src/models/phase';
import { Game, Genre } from 'src/models/game';
import { getGames, createGameRequest, createPhaseRequest, createFeatureGroupRequest, createFeatureRequest } from 'src/api/games';

// Type for API response that can handle both uppercase and lowercase property names
interface ApiGameResponse {
  id?: string;
  ID?: string;
  name?: string;
  Name?: string;
  genre?: string;
  Genre?: string;
  phases?: ApiPhaseResponse[];
  Phases?: ApiPhaseResponse[];
}

// Type for raw phase data from API
interface ApiPhaseResponse {
  id?: string;
  ID?: string;
  name?: string;
  Name?: string;
  description?: string;
  Description?: string;
  progress?: number;
  Progress?: number;
  status?: string;
  Status?: string;
  featureGroups?: ApiFeatureGroupResponse[];
  FeatureGroups?: ApiFeatureGroupResponse[];
}

// Type for raw feature group data from API
interface ApiFeatureGroupResponse {
  id?: string;
  ID?: string;
  name?: string;
  Name?: string;
  description?: string;
  Description?: string;
  progress?: number;
  Progress?: number;
  status?: string;
  Status?: string;
  features?: ApiFeatureResponse[];
  Features?: ApiFeatureResponse[];
}

// Type for raw feature data from API
interface ApiFeatureResponse {
  id?: string;
  ID?: string;
  name?: string;
  Name?: string;
  description?: string;
  Description?: string;
  progress?: number;
  Progress?: number;
  status?: string;
  Status?: string;
}

export const useGameStore = defineStore('game', {
  state: () => ({
    phases: [] as Phase[],
    games: [] as Game[],
    selectedGameId: null as string | null,
  }),
  getters: {
    getPhases: (state) => state.phases,
    getGames: (state) => state.games,
    getGameById: (state) => (id: string) => state.games.find((game) => game.id === id),
    getSelectedGame: (state) => state.selectedGameId ? state.games.find((game) => game.id === state.selectedGameId) : null,
  },
  actions: {
    async fetchGames() {
      try {
        console.log('🔄 Fetching games from API...');
        const response = await getGames();
        
        // Convert API response to proper Game instances
        this.games = (response.data as ApiGameResponse[]).map((gameData: ApiGameResponse) => {
          const id = gameData.id || gameData.ID || '';
          const name = gameData.name || gameData.Name || '';
          const genre = (gameData.genre || gameData.Genre || 'RTS') as Genre;
          const rawPhases = gameData.phases || gameData.Phases || [];
          
          // Convert phase data to proper Phase instances
          const phases = rawPhases.map((phaseData: ApiPhaseResponse) => {
            const phaseId = phaseData.id || phaseData.ID || '';
            const phaseName = phaseData.name || phaseData.Name || '';
            const phaseDescription = phaseData.description || phaseData.Description || '';
            const phaseProgress = phaseData.progress || phaseData.Progress || 0;
            const phaseStatusString = phaseData.status || phaseData.Status;
            
            // Convert status string to Status enum
            let phaseStatus: Status | undefined;
            if (phaseStatusString) {
              switch (phaseStatusString) {
                case 'Not Started':
                  phaseStatus = Status.NotStarted;
                  break;
                case 'In Progress':
                  phaseStatus = Status.InProgress;
                  break;
                case 'Completed':
                  phaseStatus = Status.Completed;
                  break;
                default:
                  phaseStatus = Status.NotStarted;
              }
            } else {
              phaseStatus = Status.NotStarted;
            }
            
            const rawFeatureGroups = phaseData.featureGroups || phaseData.FeatureGroups || [];
            
            // Convert feature group data to proper FeatureGroup instances
            const featureGroups = rawFeatureGroups.map((featureGroupData: ApiFeatureGroupResponse) => {
              const featureGroupId = featureGroupData.id || featureGroupData.ID || '';
              const featureGroupName = featureGroupData.name || featureGroupData.Name || '';
              const featureGroupDescription = featureGroupData.description || featureGroupData.Description || '';
              const featureGroupProgress = featureGroupData.progress || featureGroupData.Progress || 0;
              const featureGroupStatusString = featureGroupData.status || featureGroupData.Status;
              
              // Convert status string to Status enum
              let featureGroupStatus: Status | undefined;
              if (featureGroupStatusString) {
                switch (featureGroupStatusString) {
                  case 'Not Started':
                    featureGroupStatus = Status.NotStarted;
                    break;
                  case 'In Progress':
                    featureGroupStatus = Status.InProgress;
                    break;
                  case 'Completed':
                    featureGroupStatus = Status.Completed;
                    break;
                  default:
                    featureGroupStatus = Status.NotStarted;
                }
              } else {
                featureGroupStatus = Status.NotStarted;
              }
              
              const rawFeatures = featureGroupData.features || featureGroupData.Features || [];
              
              // Convert feature data to proper Feature instances
              const features = rawFeatures.map((featureData: ApiFeatureResponse) => {
                const featureId = featureData.id || featureData.ID || '';
                const featureName = featureData.name || featureData.Name || '';
                const featureDescription = featureData.description || featureData.Description || '';
                const featureProgress = featureData.progress || featureData.Progress || 0;
                const featureStatusString = featureData.status || featureData.Status;
                
                // Convert status string to Status enum
                let featureStatus: Status | undefined;
                if (featureStatusString) {
                  switch (featureStatusString) {
                    case 'Not Started':
                      featureStatus = Status.NotStarted;
                      break;
                    case 'In Progress':
                      featureStatus = Status.InProgress;
                      break;
                    case 'Completed':
                      featureStatus = Status.Completed;
                      break;
                    default:
                      featureStatus = Status.NotStarted;
                  }
                } else {
                  featureStatus = Status.NotStarted;
                }
                
                return new Feature(
                  featureName,
                  featureDescription,
                  featureId,
                  featureProgress,
                  undefined, // tasks
                  undefined, // startDate
                  undefined, // dueDate
                  featureStatus
                );
              });
              
              return new FeatureGroup(
                featureGroupName,
                featureGroupDescription,
                featureGroupId,
                featureGroupProgress,
                features,
                undefined, // startDate
                undefined, // dueDate
                featureGroupStatus
              );
            });
            
            return new Phase(
              phaseName,
              phaseDescription,
              phaseId,
              phaseProgress,
              featureGroups,
              undefined, // startDate
              undefined, // dueDate
              phaseStatus
            );
          });
          
          return new Game(name, genre, phases, id);
        });
        
        // Auto-select first game if no game is currently selected
        if (!this.selectedGameId && this.games.length > 0) {
          this.selectedGameId = this.games[0]?.id || null;
        }
        
        console.log('✅ Games stored in state:', this.games.length);
      } catch (error) {
        console.error('❌ Error fetching games:', error);
        throw error;
      }
    },
    
    async createGame(gameData: { name: string; genre: Genre }) {
      try {
        console.log('🎮 Creating new game:', gameData);
        const response = await createGameRequest(gameData);
        console.log('✅ Game created successfully:', response.data);
        
        // Refresh the games list
        await this.fetchGames();
        
        return response.data;
      } catch (error) {
        console.error('❌ Failed to create game:', error);
        throw error;
      }
    },

    async createPhase(gameId: string, phaseData: { name: string; description: string }) {
      try {
        console.log('📋 Creating new phase for game:', gameId, phaseData);
        const response = await createPhaseRequest(gameId, phaseData);
        console.log('✅ Phase created successfully:', response.data);
        
        // Refresh the games list to get the updated game with new phase
        await this.fetchGames();
        
        return response.data;
      } catch (error) {
        console.error('❌ Failed to create phase:', error);
        throw error;
      }
    },

    async createFeatureGroup(phaseId: string, featureGroupData: { name: string; description: string }) {
      try {
        console.log('📦 Creating new feature group for phase:', phaseId, featureGroupData);
        const response = await createFeatureGroupRequest(phaseId, featureGroupData);
        console.log('✅ Feature group created successfully:', response.data);
        
        // Refresh the games list to get the updated data
        await this.fetchGames();
        
        return response.data;
      } catch (error) {
        console.error('❌ Failed to create feature group:', error);
        throw error;
      }
    },

    async createFeature(featureGroupId: string, featureData: { name: string; description: string }) {
      try {
        const response = await createFeatureRequest(featureGroupId, featureData);
        console.log('✅ Feature created successfully:', response.data);
        await this.fetchGames(); // Refresh the games data
      } catch (error) {
        console.error('❌ Error creating feature:', error);
        throw error;
      }
    },

    setSelectedGame(gameId: string) {
      this.selectedGameId = gameId;
    },

    clearSelectedGame() {
      this.selectedGameId = null;
    },
  },
});