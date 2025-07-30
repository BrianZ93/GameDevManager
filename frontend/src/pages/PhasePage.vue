<template>
  <q-card
    class="fit row wrap justify-start items-start content-start bg-background"
    style="min-height: 94.5vh;"
  >
    <!-- Phase Profile Display -->
    <q-card-section
      class="row items-start content-start bg-background"
      style="flex: 0 0 25vw; max-width: 25vw;"
    >
      <phase-profile-card :phaseID="phaseID" />
    </q-card-section>

    <!-- Task Detail Display -->
    <q-card-section
      class="row items-start content-start"
      style="flex: 0 0 75vw; max-width: 75vw;"
    >
      <feature-profile-card />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useGameStore } from 'src/stores/gameStore';
import PhaseProfileCard from 'src/components/inner_components/PhaseProfileCard.vue';
import FeatureProfileCard from 'src/components/inner_components/FeatureProfileCard.vue';

const router = useRouter();
const route = useRoute();
const gameStore = useGameStore();

const props = defineProps<{
  phaseID?: string;
  featureID?: string;
}>();

// Get the selected game from the store
const selectedGame = computed(() => gameStore.getSelectedGame);

// Get the current phase ID from route or props
const phaseID = computed(() => {
  return props.phaseID || route.params.phaseID as string;
});

onMounted(async () => {
  // Games are already loaded in MainLayout.vue
  
  // If no phase is selected, navigate to the first phase of the selected game
  if (!phaseID.value && selectedGame.value?.phases?.length) {
    const firstPhase = selectedGame.value.phases[0];
    if (firstPhase) {
      router.push(`/phases/${encodeURIComponent(firstPhase.id)}`);
    }
  }
});
</script>

<style lang="scss">
.pipeline-section {
  overflow: auto;
  min-height: 55vh;
  max-height: 55vh;
  min-width: 32vw;
  max-width: 32vw;
  margin-top: 1vh;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.025);
  }
}

.truncate-description {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Ensure no unwanted scrollbars on card sections */
.q-card-section {
  overflow: hidden;
}

/* Ensure the outer card handles layout without overflow */
.q-card.fit {
  overflow: hidden;
}
</style>