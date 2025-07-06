<template>
    <!-- Main Flexbox Container -->
    <q-card
        class="fit row wrap justify-between items-center content-start bg-background"
        style="min-height: 96vh;"
    >
        <!-- Pipeline Sections -->
        <q-card-section
            class="bg-primary pipeline-section"
            style="margin-left: 1vw; border-radius: 8px;"
        >
            <phase-card />
        </q-card-section>

        <q-card-section
            class="bg-primary pipeline-section"
            style="border-radius: 8px;"
        >
        </q-card-section>

        <q-card-section
            class="bg-primary pipeline-section"
            style="margin-right: 1vw; border-radius: 8px;"
        >
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import PhaseCard from './inner_components/PhaseCard.vue';


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
</style>