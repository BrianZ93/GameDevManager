<template>
  <q-card class="q-pa-md bg-transparent elevated-card">
    <q-card-section class="text-center q-pa-xs">
             <h4 class="header-text">{{ title }}</h4>
       <p class="text-caption">{{ genre }}</p>
    </q-card-section>
         <q-card-section class="full-width flex flex-center q-pa-xs">
       <q-btn 
         label="Game Detail" 
         color="primary" 
         push 
         glossy
         @click="viewGameDetail"
         :disable="disabled"
       ></q-btn>
     </q-card-section>
    <q-card-section class="flex flex-center column">
      <div class="metrics-wrapper">
        <div class="metrics-grid">
          <!-- Game ID -->
          <div class="metric-item">
            <div class="metric-label">Game ID</div>
                         <div class="metric-value">{{ gameID }}</div>
          </div>
          
          <!-- Genre -->
          <div class="metric-item">
            <div class="metric-label">Genre</div>
                         <div class="metric-value">{{ genre }}</div>
          </div>
          
          <!-- Total Phases -->
          <div class="metric-item">
            <div class="metric-label">Total Phases</div>
            <div class="metric-value">{{ phases.length }}</div>
          </div>
          
          <!-- Overall Progress -->
          <div class="metric-item">
            <div class="metric-label">Overall Progress</div>
            <div class="metric-value">{{ overallProgress }}%</div>
          </div>
          
          <!-- Created Date (if available) -->
          <div class="metric-item">
            <div class="metric-label">Status</div>
            <div class="metric-value">{{ gameStatus }}</div>
          </div>
          
          <!-- Last Updated -->
          <div class="metric-item">
            <div class="metric-label">Last Updated</div>
            <div class="metric-value">{{ lastUpdated }}</div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { Phase } from 'src/models/phase';
import { useRouter } from 'vue-router';

const props = defineProps<{
  title: string;
  genre: string;
  gameID: string;
  phases: Phase[];
  disabled?: boolean;
}>();

const router = useRouter();

import { computed } from 'vue';

const viewGameDetail = () => {
  router.push(`/games/${encodeURIComponent(props.gameID)}`);
};



// Computed properties for metrics
const overallProgress = computed(() => {
  if (props.phases.length === 0) return 0;
  const totalProgress = props.phases.reduce((sum, phase) => sum + phase.progress, 0);
  return Math.round((totalProgress / props.phases.length) * 100);
});

const gameStatus = computed(() => {
  if (props.phases.length === 0) return 'Not Started';
  if (overallProgress.value === 100) return 'Completed';
  if (overallProgress.value > 0) return 'In Progress';
  return 'Planning';
});

const lastUpdated = computed(() => {
  // For now, return a placeholder since we don't have timestamps in the model
  return 'Today';
});
</script>

<style lang="scss">
.phase-scroll {
  border: 1px solid $text-color;
  border-radius: 8px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.03),
    rgba(255, 255, 255, 0)
  );
}

.phase-list {
  width: 100%;
}

.sub-phase-list {
  border: 1px solid $text-color;
  border-radius: 4px;
  background-color: $grey-1;
}

.q-expansion-item {
  border-bottom: 1px solid $text-color;
}

.q-expansion-item:last-child {
  border-bottom: none;
}

.q-item {
  padding: 8px;
}

.q-expansion-item .q-item {
  display: flex;
  align-items: center;
}

.toggle-btn:hover {
  background-color: white;
}

.elevated-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  transform-origin: center center;
  overflow: hidden !important;
}

.elevated-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 12px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
  pointer-events: none;
}

.elevated-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  transform: scale(1.03); // Slight zoom-in effect
}

.metrics-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 16px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(4px);
  overflow: hidden !important;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
  overflow: hidden !important;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  overflow: hidden !important;
}

.metric-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.metric-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
  text-align: center;
  font-weight: 500;
}

.metric-value {
  font-size: 1.2rem;
  color: white;
  font-weight: bold;
  text-align: center;
}

.btn-disabled {
  opacity: 0.4 !important;
  pointer-events: none !important;
  cursor: default !important;
  filter: grayscale(80%);
}
</style> 