<template>
  <q-card class="q-pa-md bg-transparent elevated-card">
    <q-card-section class="text-center q-pa-xs"><h4 class="header-text">{{ title }}</h4></q-card-section>
    <q-card-section class="full-width flex flex-center q-pa-xs">
      <q-btn label="Phase Detail" color="primary" push glossy></q-btn>
    </q-card-section>
    <q-card-section class="flex flex-center column">
      <div class="scroll-area-wrapper">
        <q-scroll-area
          style="height: 50vh; width: 30vw;"
          class="feature-scroll"
        >
          <q-list
            separator
            class="feature-list"
          >
            <q-expansion-item
              v-for="featureGroup in features"
              :key="featureGroup.id"
              expand-icon-toggle
              header-class="bg-secondary"
              :hide-expand-icon="!featureGroup.features?.length"
            >
              <!-- Main Feature Header with Progress and View Button -->
              <template v-slot:header>
                <q-item-section>
                  <q-linear-progress
                    size="25px"
                    :value="featureGroup.progress"
                    color="green"
                    class="q-my-sm"
                  >
                    <div class="absolute-full flex flex-center">
                      <q-badge
                        outline
                        color="white"
                        text-color="black"
                        :label="`${featureGroup.name} ${(featureGroup.progress * 100).toFixed(2)}%`"
                      />
                    </div>
                  </q-linear-progress>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    dense
                    label="View"
                    color="primary"
                    text-color="white"
                    glossy
                    @click="viewFeature(featureGroup.name)"
                    :disable="disabled"
                    :class="{ 'btn-disabled': disabled }"
                  />
                </q-item-section>
              </template>
              <!-- Sub Features -->
              <q-list
                v-if="featureGroup.features?.length"
                dense
                bordered
                separator
                class="sub-feature-list q-ma-sm bg-secondary"
              >
                <q-item
                  v-for="feature in featureGroup.features"
                  :key="feature.id"
                >
                  <q-item-section>
                    <q-linear-progress
                      size="20px"
                      :value="feature.progress"
                      color="green"
                      class="q-my-sm"
                    >
                      <div class="absolute-full flex flex-center">
                        <q-badge
                          outline
                          color="white"
                          text-color="black"
                          :label="`${feature.name} ${(feature.progress * 100).toFixed(2)}%`"
                        />
                      </div>
                    </q-linear-progress>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      dense
                      label="View"
                      color="primary"
                      text-color="white"
                      glossy
                      @click="viewSubfeature(feature.name)"
                      :disable="disabled"
                      :class="{ 'btn-disabled': disabled }"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-list>
        </q-scroll-area>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { FeatureGroup } from 'src/models/phase';

const props = defineProps<{
  title: string;
  phaseID: string;
  features: FeatureGroup[];
  disabled?: boolean;
}>();

const router = useRouter();

const viewFeature = (featureID: string) => {
  router.push(`/phases/${encodeURIComponent(props.phaseID)}/${encodeURIComponent(featureID)}`);
};

const viewSubfeature = (featureID: string) => {
  router.push(`/phases/${encodeURIComponent(props.phaseID)}/${encodeURIComponent(featureID)}`);
};
</script>

<style lang="scss">
.feature-scroll {
  border: 1px solid $text-color;
  border-radius: 8px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.03),
    rgba(255, 255, 255, 0)
  );
}

.feature-list {
  width: 100%;
}

.sub-feature-list {
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

.scroll-area-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(4px);
}

.btn-disabled {
  opacity: 0.4 !important;
  pointer-events: none !important;
  cursor: default !important;
  filter: grayscale(80%);
}
</style>