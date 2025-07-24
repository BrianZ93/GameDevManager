<template>
  <q-card
    class="fit row wrap justify-start items-start content-start bg-background"
    style="min-height: 94.5vh;"
  >
    <!-- Phase Profile Display -->
    <q-card-section
      class="row items-start content-start bg-background"
      style="flex: 0 0 25%; max-width: 25%;"
    >
      <phase-profile-card />
    </q-card-section>

    <!-- Task Detail Display -->
    <q-card-section
      class="row items-start content-start"
      style="flex: 0 0 75%; max-width: 75%;"
    >
      <feature-profile-card />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import PhaseProfileCard from 'src/components/inner_components/PhaseProfileCard.vue';
import FeatureProfileCard from 'src/components/inner_components/FeatureProfileCard.vue';

defineProps<{
  phaseID?: string;
  featureID?: string;
}>();

</script>

<style lang="scss">
.pipeline-section {
  overflow: auto;
  min-height: 55vh;
  max-height: 55vh;
  min-width: 32%;
  max-width: 32%;
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