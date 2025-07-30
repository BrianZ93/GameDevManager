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
      <q-card class="q-pa-md">
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

    <!-- Main Carousel Container -->
         <q-card-section
       v-if="!isLoading"
       class="bg-background full-width"
       style="overflow: hidden; max-height: 94.5vh; min-height: 94.5vh; position: relative;"
     >
             <q-carousel
         v-model="currentIndex"
         transition-prev="slide-right"
         transition-next="slide-left"
         transition-duration="250"
         animated
         arrows
         control-color="white"
         navigation
         class="carousel-container"
         style="height: 91vh; width: 100vw; overflow: hidden;"
       >
        <!-- Create Game Slide (index 0) -->
        <q-carousel-slide :name="0" class="carousel-slide">
          <div class="carousel-content">
            <!-- Left: Empty (no preview when on first slide) -->
            <div class="card-side card-left preview-hidden"></div>
            
            <!-- Center: Create Game Card -->
            <div class="card-center">
              <CreateGameCard @click.stop="showCreateDialog = true" />
            </div>
            
                         <!-- Right: First Game Preview (if available) -->
             <div
               v-if="validGames.length > 0"
               class="card-side card-right preview-card"
               @click="handlePreviewClick($event, 1)"
             >
               <game-card
                 v-if="validGames[0]"
                 :title="validGames[0].name"
                 :genre="validGames[0].genre"
                 :gameID="validGames[0].id"
                 :phases="validGames[0].phases ?? []"
                 :disabled="true"
               />
             </div>
            <!-- Right: Empty if no games -->
            <div v-else class="card-side card-right preview-hidden"></div>
          </div>
        </q-carousel-slide>

                 <!-- Game Slides (index 1+) -->
         <q-carousel-slide
           v-for="(game, index) in validGames"
           :key="game.id"
           :name="index + 1"
           class="carousel-slide"
         >
          <div class="carousel-content">
                         <!-- Left: Previous Game or Create Game -->
             <div
               class="card-side card-left"
               @click="handlePreviewClick($event, index)"
             >
              <CreateGameCard 
                v-if="index === 0" 
                @click.stop="showCreateDialog = true" 
              />
                             <game-card
                 v-else-if="validGames[index - 1]"
                 :title="validGames[index - 1]!.name"
                 :genre="validGames[index - 1]!.genre"
                 :gameID="validGames[index - 1]!.id"
                 :phases="validGames[index - 1]!.phases ?? []"
                 :disabled="true"
               />
            </div>
            
            <!-- Center: Current Game -->
            <div class="card-center">
              <game-card
                v-if="game"
                :title="game.name"
                :genre="game.genre"
                :gameID="game.id"
                :phases="game.phases ?? []"
                :disabled="false"
              />
            </div>
            
                         <!-- Right: Next Game or Create Game -->
             <div
               class="card-side card-right"
               @click="handlePreviewClick($event, index + 2)"
             >
                             <game-card
                 v-if="index < validGames.length - 1"
                 :title="validGames[index + 1]!.name"
                 :genre="validGames[index + 1]!.genre"
                 :gameID="validGames[index + 1]!.id"
                 :phases="validGames[index + 1]!.phases ?? []"
                 :disabled="true"
               />
              <CreateGameCard 
                v-else
                @click.stop="showCreateDialog = true" 
              />
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-card-section>

  </q-card>
</template>

<script setup lang="ts">
import GameCard from 'src/components/inner_components/GameCard.vue';
import CreateGameCard from 'src/components/inner_components/CreateGameCard.vue';
import { useGameStore } from 'src/stores/gameStore';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Game, Genre } from 'src/models/game';
import { createGame } from 'src/api/get_phases';
import { Notify } from 'quasar';

const gameStore = useGameStore();
const games = computed(() => gameStore.getGames);
const validGames = computed(() => {
  return games.value.filter((game): game is Game => {
    return game !== null && 
           game !== undefined && 
           typeof game.id === 'string' && 
           game.id.length > 0 && 
           typeof game.name === 'string' && 
           game.name.length > 0;
  });
});
const currentIndex = ref(0);
const isLoading = ref(false);
const isCreating = ref(false);
const showCreateDialog = ref(false);
const gameName = ref('');
const gameGenre = ref<Genre | null>(null);
const genreOptions = Object.values(Genre);

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') {
    if (currentIndex.value < games.value.length) {
      currentIndex.value++;
    }
  } else if (event.key === 'ArrowLeft') {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  }
}

function handlePreviewClick(event: Event, targetIndex: number) {
  // Check if the click target is a button or interactive element
  const target = event.target as HTMLElement;
  if (target.tagName === 'BUTTON' || target.closest('button') || target.closest('.q-btn')) {
    // Don't navigate if clicking on a button
    return;
  }
  
  // Navigate to the target slide
  currentIndex.value = targetIndex;
}

async function submitGame() {
  isCreating.value = true;
  console.log('🎮 Creating new game:', { name: gameName.value, genre: gameGenre.value });
  try {
    if (!gameName.value || !gameGenre.value) return;
    const newGame = new Game(gameName.value, gameGenre.value, []);
    console.log('📝 New game object created:', newGame);
    await createGame(newGame);
    console.log('✅ Game created successfully, fetching updated games...');
    await gameStore.fetchGames();
    console.log('📋 Games after creation:', gameStore.getGames);
    Notify.create({ type: 'positive', message: 'New game project created successfully!' });
    showCreateDialog.value = false;
    gameName.value = '';
    gameGenre.value = null;
    currentIndex.value = 1;
  } catch (error) {
    console.error('❌ Error creating game:', error);
    Notify.create({ type: 'negative', message: 'Failed to create game project. Please try again.' });
  } finally {
    isCreating.value = false;
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown);
  console.log('🚀 DashboardPage mounted - games already loaded in MainLayout');
  console.log('📋 Games in store:', gameStore.getGames);
  
  // Set default carousel index based on available games
  if (validGames.value.length > 0) {
    currentIndex.value = 1; // Show first game instead of create game slide
    console.log('🎯 Setting carousel to first game (index 1)');
  } else {
    currentIndex.value = 0; // Show create game slide if no games
    console.log('🎯 Setting carousel to create game slide (index 0)');
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
  width: 100vw;
  height: 100%;
  perspective: 1000px;
}

.carousel-slide {
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
  width: 90vw;
  transform-style: preserve-3d;
  overflow: hidden !important;
}

.carousel-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90vw;
  height: 90vh;
  position: relative;
  transform-style: preserve-3d;
  overflow: hidden !important;
}

.card-center {
  width: 25vw;
  z-index: 20;
  transform: translateZ(0px) scale(1);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  filter: none;
  opacity: 1;
  overflow: hidden !important;
}

.card-side {
  width: 25vw;
  z-index: 10;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden !important;
}

.card-left {
  position: absolute;
  left: 8vw;
  transform: translateX(-10vw) translateZ(-100px) scale(0.85) rotateY(15deg);
  filter: blur(2px) brightness(0.7);
  opacity: 0.8;
  overflow: hidden !important;
}

.card-right {
  position: absolute;
  right: 8vw;
  transform: translateX(10vw) translateZ(-100px) scale(0.85) rotateY(-15deg);
  filter: blur(2px) brightness(0.7);
  opacity: 0.8;
  overflow: hidden !important;
}

/* Preview card styling */
.preview-card {
  transform: translateX(0) translateZ(-50px) scale(0.9) rotateY(0deg);
  filter: blur(1px) brightness(0.8);
  opacity: 0.9;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden !important;
}

.preview-card:hover {
  transform: translateZ(-25px) scale(0.95);
  filter: blur(0.5px) brightness(0.9);
  opacity: 1;
}

/* Hidden preview styling */
.preview-hidden {
  visibility: hidden;
  opacity: 0;
  transform: scale(0);
}

.card-side:hover {
  transform: translateZ(-50px) scale(0.9);
  filter: blur(1px) brightness(0.8);
  opacity: 0.9;
}

.q-carousel__arrow--left {
  left: 10px;
  z-index: 30;
}

.q-carousel__arrow--right {
  right: 10px;
  z-index: 30;
}

/* Enhanced 3D transitions */
.q-carousel__slide {
  transform-style: preserve-3d;
}

/* Smooth transitions for all cards */
* {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Prevent scrollbars during carousel transitions */
.q-carousel {
  overflow: hidden !important;
}

.q-carousel__slide {
  overflow: hidden !important;
}

/* Ensure body doesn't show scrollbars during transitions */
body {
  overflow-x: hidden;
}

/* Additional overflow prevention for carousel container */
.carousel-container {
  overflow: hidden !important;
}

.carousel-slide {
  overflow: hidden !important;
}

.carousel-content {
  overflow: hidden !important;
}

/* Global scrollbar prevention */
html, body {
  overflow-x: hidden !important;
  overflow-y: hidden !important;
}

/* Prevent scrollbars on all elements during carousel transitions */
* {
  overflow-x: hidden !important;
}

/* Prevent any scrollbars on the entire page during carousel */
:deep(.q-page) {
  overflow: hidden !important;
}

:deep(.q-layout) {
  overflow: hidden !important;
}

/* Ensure the main card doesn't cause overflow */
.q-card.fit {
  overflow: hidden !important;
}

/* Additional carousel slide overflow prevention */
:deep(.q-carousel__slide) {
  overflow: hidden !important;
}

:deep(.q-carousel__slide-container) {
  overflow: hidden !important;
}
</style>