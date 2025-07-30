<template>
  <q-card class="full-width full-height q-pa-xs bg-transparent elevated-card">
    <!-- Phase Header -->
    <q-card-section class="text-center q-pa-xs">
      <h3 class="text-h5 q-mb-xs">{{ phase?.name || 'Loading...' }}</h3>
      <q-chip :label="phase?.status || 'Unknown'" color="primary" />
    </q-card-section>

    <!-- Phase Metrics -->
    <q-card-section class="q-pa-xs">
      <div class="metrics-grid">
        <div class="metric-item">
          <div class="metric-label">Phase ID</div>
          <div class="metric-value">{{ phaseID }}</div>
        </div>
        
        <div class="metric-item">
          <div class="metric-label">Feature Groups</div>
          <div class="metric-value">{{ phase?.featureGroups?.length || 0 }}</div>
        </div>
        
        <div class="metric-item">
          <div class="metric-label">Total Features</div>
          <div class="metric-value">{{ totalFeatures }}</div>
        </div>
        
        <div class="metric-item">
          <div class="metric-label">Overall Progress</div>
          <div class="metric-value">{{ overallProgress }}%</div>
        </div>
      </div>
    </q-card-section>

    <!-- Feature Groups List -->
    <q-card-section class="q-pa-xs flex-grow">
      <div class="row items-center q-mb-xs">
        <div class="col">
          <h5 class="text-h6 q-mt-none q-mb-none">Feature Groups</h5>
        </div>
        <div class="col-auto">
          <q-btn
            icon="add"
            label="Add Feature Group"
            color="primary"
            size="sm"
            @click="showCreateFeatureGroupDialog = true"
          />
        </div>
      </div>
      <div class="feature-groups-container">
        <q-list class="feature-groups-list">
          <q-expansion-item
            v-for="featureGroup in phase?.featureGroups"
            :key="featureGroup.id"
            :class="['feature-group-expansion', { 'feature-group-selected': isFeatureGroupSelected(featureGroup.id) }]"
            expand-separator
            :icon="featureGroup.features?.length ? 'folder' : 'folder_open'"
            :default-opened="isFeatureGroupSelected(featureGroup.id)"
            clickable
            @click="selectFeatureGroup(featureGroup.id)"
          >
            <template #header>
              <div class="row items-center full-width">
                <div class="col">
                  <div class="text-subtitle2">{{ featureGroup.name }}</div>
                  <div class="text-caption">{{ getProgressText(featureGroup.progress) }}% Complete • {{ featureGroup.features?.length || 0 }} features</div>
                </div>
                <div class="col-auto">
                  <q-btn
                    label="Add Feature"
                    dense
                    color="primary"
                    text-color="white"
                    @click.stop="openCreateFeatureDialog(featureGroup.id)"
                    title="Add Feature"
                  />
                </div>
              </div>
            </template>
            
            <q-card class="feature-group-content">
              <q-card-section class="q-pa-xs">
                <div class="text-caption q-mb-xs">{{ featureGroup.description }}</div>
                <q-linear-progress
                  :value="featureGroup.progress || 0"
                  color="green"
                  class="q-mb-xs"
                />
                
                <!-- Features within this feature group -->
                <div v-if="featureGroup.features?.length" class="features-list">
                  <q-item
                    v-for="feature in featureGroup.features"
                    :key="feature.id"
                    :class="['feature-item q-mb-xs', { 'feature-selected': isFeatureSelected(feature.id) }]"
                    clickable
                    @click="selectFeature(feature.id)"
                  >
                    <q-item-section>
                      <q-item-label class="text-body2">{{ feature.name }}</q-item-label>
                      <q-item-label caption class="feature-description">{{ feature.description }}</q-item-label>
                      <q-linear-progress
                        :value="feature.progress || 0"
                        color="blue"
                        class="q-mt-xs"
                      />
                      <div class="text-caption q-mt-xs">
                        {{ getProgressText(feature.progress) }}% Complete
                      </div>
                    </q-item-section>
                    
                    <q-item-section side>
                      <q-btn
                        icon="chevron_right"
                        flat
                        round
                        dense
                        color="primary"
                      />
                    </q-item-section>
                  </q-item>
                </div>
                
                <div v-else class="text-center q-pa-sm">
                  <q-icon name="info" size="1.5rem" color="grey" />
                  <p class="text-caption q-mt-sm">No features created yet</p>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          
          <div v-if="!phase?.featureGroups?.length" class="text-center q-pa-lg">
            <q-icon name="info" size="2rem" color="grey" />
            <p class="text-caption q-mt-sm">No feature groups created yet</p>
          </div>
        </q-list>
      </div>
    </q-card-section>

    <!-- Create Feature Group Dialog -->
    <q-dialog v-model="showCreateFeatureGroupDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Create New Feature Group</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="newFeatureGroup.name"
            label="Feature Group Name"
            dense
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="newFeatureGroup.description"
            label="Description"
            dense
            outlined
            type="textarea"
            rows="3"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Create" color="primary" @click="createFeatureGroup" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Create Feature Dialog -->
    <q-dialog v-model="showCreateFeatureDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Create New Feature</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="newFeature.name"
            label="Feature Name"
            dense
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="newFeature.description"
            label="Description"
            dense
            outlined
            type="textarea"
            rows="3"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Create" color="primary" @click="createFeature" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useGameStore } from 'src/stores/gameStore';


const props = defineProps<{
  phaseID?: string | undefined;
}>();

const router = useRouter();
const route = useRoute();
const gameStore = useGameStore();
const showCreateFeatureGroupDialog = ref(false);
const showCreateFeatureDialog = ref(false);

const newFeatureGroup = ref({
  name: '',
  description: '',
});

const newFeature = ref({
  name: '',
  description: '',
  featureGroupId: '',
});

const phase = computed(() => {
  if (!props.phaseID) {
    return null;
  }
  
  // Find the phase within the current game's phases
  const currentGame = gameStore.getGames.find(game => 
    game.phases?.some(phase => phase.id === props.phaseID)
  );
  
  if (currentGame) {
    const foundPhase = currentGame.phases?.find(p => p.id === props.phaseID);
    
    // Initialize featureGroups if it doesn't exist
    if (foundPhase && !foundPhase.featureGroups) {
      foundPhase.featureGroups = [];
    }
    
    return foundPhase;
  }
  
  return null;
});

const totalFeatures = computed(() => {
  if (!phase.value?.featureGroups?.length) return 0;
  return phase.value.featureGroups.reduce((sum, group) => sum + (group.features?.length || 0), 0);
});

const overallProgress = computed(() => {
  if (!phase.value?.featureGroups?.length) return 0;
  const totalProgress = phase.value.featureGroups.reduce((sum, group) => sum + (group.progress || 0), 0);
  return Math.round((totalProgress / phase.value.featureGroups.length) * 100);
});

const selectedFeatureGroup = computed(() => {
  if (!phase.value?.featureGroups?.length) return null;
  const selectedGroupId = route.params.featureGroupID as string;
  if (selectedGroupId) {
    return phase.value.featureGroups.find(group => group.id === selectedGroupId);
  }
  // Auto-select first feature group if none selected
  return phase.value.featureGroups[0];
});

const selectFeatureGroup = (featureGroupID: string) => {
  if (props.phaseID) {
    router.push(`/phases/${encodeURIComponent(props.phaseID)}/feature-groups/${encodeURIComponent(featureGroupID)}`);
  }
};

const selectFeature = (featureID: string) => {
  if (props.phaseID && selectedFeatureGroup.value) {
    router.push(`/phases/${encodeURIComponent(props.phaseID)}/feature-groups/${encodeURIComponent(selectedFeatureGroup.value.id)}/features/${encodeURIComponent(featureID)}`);
  }
};

const openCreateFeatureDialog = (featureGroupId: string) => {
  newFeature.value.featureGroupId = featureGroupId;
  showCreateFeatureDialog.value = true;
};

const createFeatureGroup = async () => {
  if (newFeatureGroup.value.name.trim() && props.phaseID) {
    try {
      // Create the feature group in the database
      await gameStore.createFeatureGroup(props.phaseID, {
        name: newFeatureGroup.value.name,
        description: newFeatureGroup.value.description,
      });
      
      newFeatureGroup.value.name = '';
      newFeatureGroup.value.description = '';
      showCreateFeatureGroupDialog.value = false;
      
    } catch (error) {
      console.error('Failed to create feature group:', error);
    }
  }
};

const createFeature = async () => {
  if (newFeature.value.name.trim() && newFeature.value.featureGroupId) {
    try {
      // Create the feature in the database
      await gameStore.createFeature(newFeature.value.featureGroupId, {
        name: newFeature.value.name,
        description: newFeature.value.description,
      });
      
      newFeature.value.name = '';
      newFeature.value.description = '';
      newFeature.value.featureGroupId = '';
      showCreateFeatureDialog.value = false;
      
    } catch (error) {
      console.error('Failed to create feature:', error);
    }
  }
};

const getProgressText = (progress: number | undefined): string => {
  if (progress === undefined || progress === null || isNaN(progress)) {
    return '0.0';
  }
  return (progress * 100).toFixed(1);
};

const isFeatureGroupSelected = (featureGroupID: string): boolean => {
  return route.params.featureGroupID === featureGroupID;
};

const isFeatureSelected = (featureID: string): boolean => {
  return route.params.featureID === featureID;
};

onMounted(async () => {
  // Games are already loaded in MainLayout.vue
  
  // Auto-select first feature group if no feature group is currently selected
  if (props.phaseID && !route.params.featureGroupID && phase.value?.featureGroups?.length) {
    const firstFeatureGroup = phase.value.featureGroups[0];
    if (firstFeatureGroup) {
      router.push(`/phases/${encodeURIComponent(props.phaseID)}/feature-groups/${encodeURIComponent(firstFeatureGroup.id)}`);
    }
  }
});
</script>

<style lang="scss" scoped>
.elevated-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.metric-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 4px;
  text-align: center;
}

.metric-label {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2px;
  text-align: center;
  font-weight: 500;
}

.metric-value {
  font-size: 0.9rem;
  color: white;
  font-weight: bold;
  text-align: center;
}

.feature-groups-container {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.feature-groups-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 2px;
  min-height: 52.5vh;
  max-height: 52.5vh;
}

.features-sub-list {
  padding-left: 16px; /* Reduced indent for sub-list */
}

.features-container {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  max-height: 20vh;
  min-height: 20vh;
}

.feature-sub-item {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 2px;
  padding: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
}

.features-list {
  max-height: 12vh;
  overflow-y: auto;
  padding-right: 2px;
}

.feature-item {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 2px;
  padding: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
}

.feature-group-item {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 2px;
  padding: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
}

.feature-group-selected {
  background: $accent !important;
  border: 1px solid rgba(25, 118, 210, 0.4) !important;
  box-shadow: 0 0 8px rgba(25, 118, 210, 0.3);
  color: black !important;
}

.feature-group-expansion {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 2px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
}

.feature-group-content {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin: 2px;
  padding: 4px;
}

.feature-description {
  color: white !important;
}

.feature-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
}

.feature-card-selected {
  background: $accent !important;
  border: 1px solid rgba(25, 118, 210, 0.4) !important;
  box-shadow: 0 0 8px rgba(25, 118, 210, 0.3);
  color: black !important;
}
</style>