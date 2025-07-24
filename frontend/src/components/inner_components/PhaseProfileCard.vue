<template>
  <q-card class="q-pa-md bg-primary" style="width: 100%; min-height: 90vh;">
    <q-list bordered padding>
      <q-item>
        <q-item-section>
          <q-item-label overline style="color:white">PHASE: {{ phase?.name || 'MISSING PHASE DATA' }}</q-item-label>
          <q-item-label>Overview</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption overline style="color:white">In Progress</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced />
      <q-item-label header style="color:white">Features</q-item-label>

      <q-scroll-area style="height: 72vh; width: 100%">
        <q-item 
          v-for="feature in features" 
          :key="feature.id"
          :active="activeFeatureId === feature.id"
          clickable
          @click="setActiveFeature(feature.id)"
          :class="{ 'active-feature': activeFeatureId === feature.id }"
        >
          <q-item-section top avatar>
            <q-icon
              :name="getProgressIcon(feature.progress)"
              size="sm"
              :color="getProgressColor(feature.progress)"
              style="margin-top: 1.5vh;"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ feature.name }}</q-item-label>
            <q-item-label caption style="color:white" class="truncate-description">{{ feature.description }}</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption style="color:white">{{ Math.round(feature.progress * 100) }}% Complete</q-item-label>
          </q-item-section>
        </q-item>            
      </q-scroll-area>
    </q-list>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from 'src/stores/gameStore';
import { Feature, FeatureGroup, Phase } from 'src/models/phase';

const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();

const phaseID = ref<string | undefined>(route.params.phaseID as string);
const activeFeatureId = ref<string | undefined>(route.params.featureID as string);

const phase = computed<Phase | undefined>(() =>
  gameStore.getPhases.find(p => p.id === phaseID.value)
);

const features = computed<Feature[]>(() => {
  return (
    phase.value?.featureGroups?.flatMap((group: FeatureGroup) => group.features ?? []) ?? []
  );
});

const setActiveFeature = (id: string) => {
  activeFeatureId.value = id;
  if (phaseID.value) {
    router.push(`/phases/${encodeURIComponent(phaseID.value)}/${encodeURIComponent(id)}`);
  }
};

// Map feature progress to icons
const getProgressIcon = (progress: number): string => {
  if (progress === 0) return 'radio_button_unchecked';
  if (progress === 1) return 'check_circle';
  return 'autorenew';
};

// Map feature progress to colors
const getProgressColor = (progress: number): string => {
  if (progress === 0) return 'grey';
  if (progress === 1) return 'green';
  return 'blue';
};

onMounted(async () => {

  if (gameStore.getPhases.length === 0) {
    await gameStore.initializePhases();

  }
  console.log(features.value)
  console.log(phase.value)



  // If no phaseID is in the route, fallback to the first phase
  if (!phaseID.value && gameStore.getPhases.length > 0) {
    phaseID.value = gameStore.getPhases[0]?.id;
  }

  // If no featureID is in the route, fallback to the first feature in the phase
  if (!activeFeatureId.value && features.value.length > 0) {
    activeFeatureId.value = features.value[0]?.id;

    // Push to route if we had to fallback
    if (phaseID.value && activeFeatureId.value) {
      router.replace(`/phases/${encodeURIComponent(phaseID.value)}/${encodeURIComponent(activeFeatureId.value)}`);
    }
  }
});
</script>

<style lang="scss" scoped>
.truncate-description {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.active-feature {
  background-color: rgba(255, 255, 255, 0.1);
  border-left: 4px solid #fff;
}
</style>