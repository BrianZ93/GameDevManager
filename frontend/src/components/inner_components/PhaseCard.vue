<template>
    <q-card-section>
        <div class="text-h6 text-center header-text">Algorithmic Base</div>

        <q-scroll-area
            style="height: 45vh;
            width:25vw"
            bordered
            :visible=scrollBarVisible
        >
            <q-list>
                <q-item v-for="(feature, index) in featureGroupConfig" :key="index">
                    <q-item-section>
                        <q-btn color="secondary" full-width push glossy>
                            <q-item-label overline class="text-center subheader-text">{{ feature.label }}</q-item-label>
                            <q-linear-progress 
                                size="25px" 
                                :value="feature.progress" 
                                color="green"
                            >
                                <div class="absolute-full flex flex-center">
                                    <q-badge 
                                        outline 
                                        color="white" 
                                        text-color="accent" 
                                        :label="`${(feature.progress * 100).toFixed(2)}%`" 
                                    />
                                </div>
                            </q-linear-progress>
                        </q-btn>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-scroll-area>
    </q-card-section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const scrollBarVisible = ref<boolean>(true);

class FeatureGroup {
  constructor(
    public label: string,
    public progress: number
  ) {}
}

const featureGroupConfig: FeatureGroup[] = [
  new FeatureGroup("Unit Pathfinding", 0.5),
  new FeatureGroup("Resource Mechanics", 0.35),
  new FeatureGroup("Attack Logic", 0),
  new FeatureGroup("Multiplayer Replication", 0.25),
  new FeatureGroup("Basic UI", 0.2),
  new FeatureGroup("Unit Abilities", 0),
  new FeatureGroup("Game Modes & Start", 0.2),
  new FeatureGroup("Races Mapped Out", 0.75),
  new FeatureGroup("Optimizations", 0.25),
];

</script>

<style lang="scss">
.q-list--bordered {
  border-color: $text-color !important; /* Replace with desired color, e.g., #ff0000 for red */
}
</style>