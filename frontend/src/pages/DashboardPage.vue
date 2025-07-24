<template>
  <!-- Main flexbox -->
  <q-card class="fit row wrap justify-start items-start content-start">
    <!-- Loading state for the entire page -->
    <q-inner-loading :showing="isLoading" class="full-width full-height">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-md">Loading games...</div>
    </q-inner-loading>

    <!-- No games case -->
    <q-card-section
      v-if="!isLoading && games.length === 0"
      class="bg-background full-width full-height flex column justify-center items-center"
    >
      <q-card flat bordered class="q-pa-md text-center">
        <q-card-section>
          <div class="text-h6">No game projects found</div>
          <div class="text-subtitle2 q-mt-sm">Start by creating a new game project.</div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            color="primary"
            label="Create new game project"
            @click="createNewGame"
            :disable="isCreating"
            :loading="isCreating"
          />
        </q-card-actions>
      </q-card>
    </q-card-section>


    <!-- Left Side (Carousel) -->
    <q-card-section
      v-if="!isLoading && games.length > 0"
      class="bg-background"
      style="overflow: hidden; min-width: 75%; max-width: 75%; max-height: 94.5vh; min-height: 94.5vh;"
    >
      <div v-if="phases.length === 0" class="text-center q-pa-md">
        <div>No phases available for this game.</div>
      </div>
      <q-carousel
        v-else-if="phases.length > 0"
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
        <q-carousel-slide
          v-for="(phase, index) in phases"
          :key="phase.id"
          :name="index"
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
      <div v-else class="text-center q-pa-md">
        <div>No phases available.</div>
      </div>
    </q-card-section>

    <!-- Right Side -->
    <q-card-section class="bg-red" style="overflow: auto; min-width: 25%; max-width: 25%; max-height: 94.5vh; min-height: 94.5vh;"></q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import PhaseCard from 'src/components/inner_components/PhaseCard.vue';
import { useGameStore } from 'src/stores/gameStore';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Phase } from 'src/models/phase';
import { createGame } from 'src/api/get_phases';
import { Game, Genre } from 'src/models/game';
import { Notify } from 'quasar';

const gameStore = useGameStore();
const games = computed(() => gameStore.getGames);
const phases = computed(() => (games.value.length > 0 ? games.value[0].phases : []));
const currentIndex = ref(0);
const isLoading = ref(false);
const isCreating = ref(false);

// Computed properties for safe phase access
const currentPhase = computed((): Phase => {
  return phases[currentIndex.value] as Phase;
});

const previousPhase = computed((): Phase | null => {
  return currentIndex.value > 0 ? (phases[currentIndex.value - 1] as Phase) : null;
});

const nextPhase = computed((): Phase | null => {
  return currentIndex.value < phases.length - 1 ? (phases[currentIndex.value + 1] as Phase) : null;
});

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') {
    if (currentIndex.value < phases.length - 1) {
      currentIndex.value++;
    }
  } else if (event.key === 'ArrowLeft') {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  }
}

async function createNewGame() {
  isCreating.value = true;
  try {
    const newGame = new Game(
      'New Game Project',
      Genre.RTS,
      [], // Start with empty phases
      undefined // Let UUID be generated
    );
    await createGame(newGame);
    await gameStore.fetchGames(); // Refresh games list
    Notify.create({
      type: 'positive',
      message: 'New game project created successfully!',
    });
  } catch (error) {
    console.error('Failed to create game:', error);
    Notify.create({
      type: 'negative',
      message: 'Failed to create game project. Please try again.',
    });
  } finally {
    isCreating.value = false;
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown);
  try {
    await gameStore.fetchGames();
  } catch (error) {
    console.error('Failed to load games:', error);
    Notify.create({
      type: 'negative',
      message: 'Failed to load games. Please try again.',
    });
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