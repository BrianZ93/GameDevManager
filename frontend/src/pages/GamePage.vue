<template>
  <q-card
    class="fit row wrap justify-start items-start content-start bg-background"
    style="min-height: 94.5vh;"
  >
    <!-- Detail View (always show this layout) -->
    <template v-if="currentGameID">
      <!-- Game Profile Display -->
      <q-card-section
        class="row items-start content-start bg-background"
        style="flex: 0 0 25%; max-width: 25%;"
      >
        <game-profile-card :gameID="currentGameID" />
      </q-card-section>

      <!-- Phase Detail Display -->
      <q-card-section
        class="row items-start content-start"
        style="flex: 0 0 75%; max-width: 75%;"
      >
        <phase-profile-card v-if="phaseID" :phaseID="phaseID" />
        <div v-else class="full-width full-height flex flex-center">
          <q-card class="q-pa-lg text-center">
            <h4>Select a Phase</h4>
            <p class="text-caption">Choose a phase from the game profile to view details</p>
          </q-card>
        </div>
      </q-card-section>
    </template>

    <!-- Create Game View (when no games exist) -->
    <template v-else>
      <q-card-section
        class="row items-start content-start bg-background"
        style="flex: 0 0 100%; max-width: 100%;"
      >
        <div class="full-width">
          <div class="row q-mb-md">
            <div class="col">
              <h3 class="text-h4 q-mb-sm">Games</h3>
              <p class="text-caption">Manage your game development projects</p>
            </div>
            <div class="col-auto">
              <q-btn
                color="primary"
                icon="add"
                label="Create Game"
                @click="showCreateDialog = true"
              />
            </div>
          </div>

          <!-- Show create game card if no games available -->
          <div class="row justify-center">
            <div class="col-12 col-md-8 col-lg-6">
              <div class="text-center q-pa-xl">
                <q-card class="q-pa-lg bg-transparent elevated-card">
                  <q-card-section class="text-center">
                    <q-icon name="sports_esports" size="4rem" color="grey" />
                    <h4 class="q-mt-md">No Games Yet</h4>
                    <p class="text-caption q-mb-lg">Create your first game to get started</p>
                    <q-btn
                      color="primary"
                      icon="add"
                      label="Create Your First Game"
                      @click="showCreateDialog = true"
                    />
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </template>

    <!-- Create Game Dialog -->
    <q-dialog v-model="showCreateDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Create New Game</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="newGame.name"
            label="Game Name"
            dense
            outlined
            class="q-mb-md"
          />
          <q-select
            v-model="newGame.genre"
            :options="genreOptions"
            label="Genre"
            dense
            outlined
            emit-value
            map-options
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Create" color="primary" @click="createGame" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useGameStore } from 'src/stores/gameStore';
import GameProfileCard from 'src/components/inner_components/GameProfileCard.vue';
import PhaseProfileCard from 'src/components/inner_components/PhaseProfileCard.vue';
import { Genre } from 'src/models/game';
import { useRoute, useRouter } from 'vue-router';

const gameStore = useGameStore();
const route = useRoute();
const router = useRouter();
const showCreateDialog = ref(false);

// Get route parameters
const routeGameID = computed(() => route.params.gameID as string);
const phaseID = computed(() => route.params.phaseID as string);

// Define games computed property first
const games = computed(() => gameStore.getGames);

// Determine which game to show
const currentGameID = computed(() => {
  // If a specific game ID is provided in the route, use it
  if (routeGameID.value) {
    return routeGameID.value;
  }
  
  // If no game ID in route but games exist, use the first game
  if (games.value && games.value.length > 0) {
    const firstGame = games.value[0];
    if (firstGame) {
      return firstGame.id;
    }
  }
  
  // No games available
  return null;
});

// Watch for changes to currentGameID and set it as selected
watch(currentGameID, (newGameID) => {
  if (newGameID) {
    gameStore.setSelectedGame(newGameID);
  }
}, { immediate: true });

const newGame = ref({
  name: '',
  genre: Genre.Action,
});

const genreOptions = [
  { label: 'Action', value: Genre.Action },
  { label: 'Adventure', value: Genre.Adventure },
  { label: 'RPG', value: Genre.RPG },
  { label: 'Strategy', value: Genre.Strategy },
  { label: 'Simulation', value: Genre.Simulation },
  { label: 'Sports', value: Genre.Sports },
  { label: 'Puzzle', value: Genre.Puzzle },
  { label: 'Racing', value: Genre.Racing },
  { label: 'Fighting', value: Genre.Fighting },
  { label: 'Shooter', value: Genre.Shooter },
];

// Watch for route changes and redirect if needed
watch([route, games], ([newRoute, newGames]) => {
  // If we're on /games (no game ID) and games exist, redirect to first game
  if (!newRoute.params.gameID && newGames && newGames.length > 0) {
    const firstGame = newGames[0];
    if (firstGame) {
      router.replace(`/games/${encodeURIComponent(firstGame.id)}`);
    }
  }
}, { immediate: true });

const createGame = async () => {
  if (newGame.value.name.trim()) {
    try {
      await gameStore.createGame({
        name: newGame.value.name,
        genre: newGame.value.genre,
      });
      newGame.value.name = '';
      newGame.value.genre = Genre.Action;
      showCreateDialog.value = false;
      
      // Redirect to the newly created game
      const newGames = gameStore.getGames;
      if (newGames.length > 0) {
        const lastGame = newGames[newGames.length - 1];
        if (lastGame) {
          router.push(`/games/${encodeURIComponent(lastGame.id)}`);
        }
      }
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  }
};
</script>

<style lang="scss">
/* Ensure no unwanted scrollbars on card sections */
.q-card-section {
  overflow: hidden;
}

/* Ensure the outer card handles layout without overflow */
.q-card.fit {
  overflow: hidden;
}

.elevated-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
</style> 