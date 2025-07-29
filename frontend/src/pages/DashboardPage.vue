<template>
  <!-- Main flexbox -->
  <q-card class="fit row wrap justify-start items-start content-start">
    <!-- Loading state for the entire page -->
    <q-inner-loading :showing="isLoading" class="full-width full-height">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-md">Loading games...</div>
    </q-inner-loading>

    <!-- Create Game Dialog -->
    <q-dialog v-model="showCreateDialog" persistent>
      <q-card class="q-pa-md" style="min-width: 400px;">
        <q-card-section>
          <div class="text-h6">Create New Game</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input filled v-model="gameName" label="Game Name" />
          <q-select
            filled
            v-model="gameGenre"
            :options="genreOptions"
            label="Genre"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" @click="showCreateDialog = false" />
          <q-btn color="primary" label="Create" @click="submitGame" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Left Side (Carousel) -->
    <q-card-section
      v-if="!isLoading"
      class="bg-background"
      style="overflow: hidden; min-width: 75%; max-width: 75%; max-height: 94.5vh; min-height: 94.5vh;"
    >
      <q-carousel
        v-model="currentIndex"
        transition-prev="fade"
        transition-next="fade"
        transition-duration="500"
        animated
        arrows
        control-color="white"
        navigation
        class="carousel-container"
        style="height: 91vh;"
      >
        <!-- Add Game Card Slide -->
        <q-carousel-slide :name="0" class="carousel-slide">
          <div class="carousel-content">
            <div class="card-center">
              <CreateGameCard @click="showCreateDialog = true" />
            </div>
          </div>
        </q-carousel-slide>

        <!-- Game Phase Cards -->
        <q-carousel-slide
          v-for="(phase, index) in phases"
          :key="phase.id"
          :name="index + 1"
          class="carousel-slide"
        >
          <div class="carousel-content">
            <!-- Previous Card (if available) -->
            <div
              v-if="previousPhase"
              class="card-side card-left"
              @click="currentIndex--"
            >
              <phase-card
                :title="previousPhase.name"
                :phaseID="previousPhase.id"
                :features="previousPhase.featureGroups ?? []"
                :disabled="true"
              />
            </div>
            <!-- Active Card -->
            <div class="card-center">
              <phase-card
                :title="currentPhase.name"
                :phaseID="currentPhase.id"
                :features="currentPhase.featureGroups ?? []"
                :disabled="false"
              />
            </div>
            <!-- Next Card (if available) -->
            <div
              v-if="nextPhase"
              class="card-side card-right"
              @click="currentIndex++"
            >
              <phase-card
                :title="nextPhase.name"
                :phaseID="nextPhase.id"
                :features="nextPhase.featureGroups ?? []"
                :disabled="true"
              />
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-card-section>

    <!-- Right Side -->
    <q-card-section class="bg-red" style="overflow: auto; min-width: 25%; max-width: 25%; max-height: 94.5vh; min-height: 94.5vh;"></q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import PhaseCard from 'src/components/inner_components/PhaseCard.vue';
import CreateGameCard from 'src/components/inner_components/CreateGameCard.vue';
import { useGameStore } from 'src/stores/gameStore';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Phase } from 'src/models/phase';
import { createGame } from 'src/api/get_phases';
import { Game, Genre } from 'src/models/game';
import { Notify } from 'quasar';

const gameStore = useGameStore();
const games = computed(() => gameStore.getGames);
const phases = computed<Phase[]>(() => games.value[0]?.phases ?? []);
const currentIndex = ref(0);
const isLoading = ref(false);
const isCreating = ref(false);
const showCreateDialog = ref(false);
const gameName = ref('');
const gameGenre = ref<Genre | null>(null);
const genreOptions = Object.values(Genre);

const currentPhase = computed((): Phase => phases.value[currentIndex.value - 1] as Phase);
const previousPhase = computed((): Phase | null => currentIndex.value > 1 ? phases.value[currentIndex.value - 2] ?? null : null);
const nextPhase = computed((): Phase | null => currentIndex.value < phases.value.length ? phases.value[currentIndex.value] ?? null : null);

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') {
    if (currentIndex.value < phases.value.length + 1) {
      currentIndex.value++;
    }
  } else if (event.key === 'ArrowLeft') {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  }
}

async function submitGame() {
  isCreating.value = true;
  try {
    if (!gameName.value || !gameGenre.value) return;
    const newGame = new Game(gameName.value, gameGenre.value, []);
    await createGame(newGame);
    await gameStore.fetchGames();
    Notify.create({ type: 'positive', message: 'New game project created successfully!' });
    showCreateDialog.value = false;
    gameName.value = '';
    gameGenre.value = null;
    currentIndex.value = 1;
  } catch {
    Notify.create({ type: 'negative', message: 'Failed to create game project. Please try again.' });
  } finally {
    isCreating.value = false;
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown);
  try {
    await gameStore.fetchGames();
  } catch {
    Notify.create({ type: 'negative', message: 'Failed to load games.' });
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>
<style scoped>
.carousel-container {
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 71vw;
  height: 100%;
}

.carousel-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 70vw;
}

.carousel-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.card-center {
  width: 60%;
  max-width: 35vw;
  z-index: 10;
  transition: all 0.5s ease;
}

.card-side {
  width: 100%;
  max-width: 40vw;
  filter: blur(3px) brightness(0.6);
  transform: scale(0.8) translateZ(-50px);
  z-index: 5;
  transition: all 0.5s ease;
}

.card-left {
  position: absolute;
  left: 5%;
}

.card-right {
  position: absolute;
  right: 5%;
}

.q-carousel__arrow--left {
  left: 0;
}

.q-carousel__arrow--right {
  right: 0;
}
</style>