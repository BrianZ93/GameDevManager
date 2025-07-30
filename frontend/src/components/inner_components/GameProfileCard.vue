<template>
  <q-card class="full-width full-height q-pa-md bg-transparent elevated-card">
    <!-- Game Header -->
    <q-card-section class="text-center q-pa-md">
      <q-btn-dropdown
        :label="game?.name || 'Loading...'"
        color="primary"
        class="text-h5 q-mb-sm"
        no-caps
        icon="games"
        text-color="white"
        rounded
        glossy
      >
        <q-list>
          <q-item
            v-for="gameOption in gameStore.getGames"
            :key="gameOption.id"
            clickable
            v-close-popup
            @click="selectGame(gameOption.id)"
            :active="gameOption.id === props.gameID"
          >
            <q-item-section>
              <q-item-label>{{ gameOption.name }}</q-item-label>
              <q-item-label caption>{{ gameOption.genre || 'Unknown' }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-chip :label="game?.genre || 'Unknown'" color="primary" />
    </q-card-section>

    <!-- Game Metrics -->
    <q-card-section class="q-pa-md">
      <div class="metrics-grid">
        <div class="metric-item">
          <div class="metric-label">Game ID</div>
          <div class="metric-value">{{ gameID }}</div>
        </div>
        
        <div class="metric-item">
          <div class="metric-label">Total Phases</div>
          <div class="metric-value">{{ game?.phases?.length || 0 }}</div>
        </div>
        
        <div class="metric-item">
          <div class="metric-label">Overall Progress</div>
          <div class="metric-value">{{ overallProgress }}%</div>
        </div>
        
        <div class="metric-item">
          <div class="metric-label">Status</div>
          <div class="metric-value">{{ gameStatus }}</div>
        </div>
      </div>
    </q-card-section>

    <!-- Phases List -->
    <q-card-section class="q-pa-md">
      <div class="row items-center q-mb-sm">
        <div class="col">
          <h5 class="text-h6 q-mt-none q-mb-none">Phases</h5>
        </div>
        <div class="col-auto">
          <q-btn
            icon="add"
            label="Add Phase"
            color="primary"
            size="sm"
            @click="showCreatePhaseDialog = true"
          />
        </div>
      </div>
      <div class="phases-container">
        <div class="phases-list">
          <q-card
            v-for="phase in game?.phases"
            :key="phase.id"
            :class="['phase-card q-mb-sm', { 'phase-card-selected': isPhaseSelected(phase.id) }]"
            clickable
            @click="selectPhase(phase.id)"
          >
            <q-card-section class="q-pa-sm">
              <div class="row items-center">
                <div class="col">
                  <div class="text-subtitle2">{{ phase.name }}</div>
                  <q-linear-progress
                    :value="phase.progress || 0"
                    color="green"
                    class="q-mt-xs"
                  />
                  <div class="text-caption q-mt-xs">
                    {{ getProgressText(phase.progress) }}% Complete
                  </div>
                </div>
                <div class="col-auto">
                  <q-btn
                    icon="chevron_right"
                    flat
                    round
                    dense
                    color="primary"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
          
          <div v-if="!game?.phases?.length" class="text-center q-pa-lg">
            <q-icon name="info" size="2rem" color="grey" />
            <p class="text-caption q-mt-sm">No phases created yet</p>
          </div>
        </div>
      </div>
    </q-card-section>

    <!-- Create Phase Dialog -->
    <q-dialog v-model="showCreatePhaseDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Create New Phase</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="newPhase.name"
            label="Phase Name"
            dense
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="newPhase.description"
            label="Description"
            dense
            outlined
            type="textarea"
            rows="3"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Create" color="primary" @click="createPhase" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useGameStore } from 'src/stores/gameStore';

const props = defineProps<{
  gameID?: string;
}>();

const router = useRouter();
const route = useRoute();
const gameStore = useGameStore();
const showCreatePhaseDialog = ref(false);

const newPhase = ref({
  name: '',
  description: '',
});

const game = computed(() => {
  if (!props.gameID) return null;
  const foundGame = gameStore.getGames.find(g => g.id === props.gameID);
  return foundGame;
});

const overallProgress = computed(() => {
  if (!game.value?.phases?.length) return 0;
  const totalProgress = game.value.phases.reduce((sum, phase) => sum + phase.progress, 0);
  return Math.round((totalProgress / game.value.phases.length) * 100);
});

const gameStatus = computed(() => {
  if (!game.value?.phases?.length) return 'Not Started';
  if (overallProgress.value === 100) return 'Completed';
  if (overallProgress.value > 0) return 'In Progress';
  return 'Planning';
});

const selectGame = async (gameID: string) => {
  // Set the selected game in the store for persistence
  gameStore.setSelectedGame(gameID);
  
  // Navigate to the new game
  await router.push(`/games/${encodeURIComponent(gameID)}`);
  
  // Find the new game and auto-select its first phase if available
  const newGame = gameStore.getGames.find(g => g.id === gameID);
  if (newGame?.phases?.length) {
    const firstPhase = newGame.phases[0];
    if (firstPhase) {
      router.push(`/games/${encodeURIComponent(gameID)}/phases/${encodeURIComponent(firstPhase.id)}`);
    }
  }
};

const selectPhase = (phaseID: string) => {
  if (props.gameID) {
    router.push(`/games/${encodeURIComponent(props.gameID)}/phases/${encodeURIComponent(phaseID)}`);
  }
};

const createPhase = async () => {
  if (newPhase.value.name.trim() && props.gameID) {
    try {
      await gameStore.createPhase(props.gameID, {
        name: newPhase.value.name,
        description: newPhase.value.description,
      });
      newPhase.value.name = '';
      newPhase.value.description = '';
      showCreatePhaseDialog.value = false;
    } catch (error) {
      console.error('Failed to create phase:', error);
    }
  }
};

const getProgressText = (progress: number | undefined): string => {
  if (progress === undefined || progress === null || isNaN(progress)) {
    return '0.0';
  }
  return (progress * 100).toFixed(1);
};

const isPhaseSelected = (phaseID: string): boolean => {
  return route.params.phaseID === phaseID;
};

onMounted(async () => {
  if (!gameStore.getGames.length) {
    await gameStore.fetchGames();
  }
  
  // Auto-select first phase if no phase is currently selected
  if (props.gameID && !route.params.phaseID && game.value?.phases?.length) {
    const firstPhase = game.value.phases[0];
    if (firstPhase) {
      router.push(`/games/${encodeURIComponent(props.gameID)}/phases/${encodeURIComponent(firstPhase.id)}`);
    }
  }
});
</script>

<style lang="scss" scoped>
.elevated-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  min-height: 90vh;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.metric-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2px;
  text-align: center;
  font-weight: 500;
}

.metric-value {
  font-size: 1rem;
  color: white;
  font-weight: bold;
  text-align: center;
}

.phases-container {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px;
  max-height: 43.5vh;
  min-height: 43.5vh;
}

.phases-list {
  min-height: 30vh;
  max-height: 30vh;
  overflow-y: auto;
  padding-right: 4px;
}

.phase-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
}

.phase-card-selected {
  background: $accent !important;
  border: 1px solid rgba(25, 118, 210, 0.4) !important;
  box-shadow: 0 0 8px rgba(25, 118, 210, 0.3);
  color: black !important;
}
</style> 