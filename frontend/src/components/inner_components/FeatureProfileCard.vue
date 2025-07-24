<template>
  <q-card class="q-pa-md bg-primary" style="width: 100%; min-height: 90vh;">
    <q-list bordered padding>
      <q-item>
        <q-item-section>
          <q-item-label overline style="color:white">PHASE: {{ featureID || 'MISSING PHASE DATA' }}</q-item-label>
          <q-item-label>Overview</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption overline style="color:white">25%</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced />
      <q-item-label header style="color:white">Tasks</q-item-label>

      <q-scroll-area style="height: 72vh; width: 100%">
        <q-item v-for="task in tasks" :key="task.id">
          <q-item-section top avatar>
            <q-icon
              :name="getStatusIcon(task.status)"
              size="sm"
              :color="getStatusColor(task.status)"
              style="margin-top: 1.5vh;"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ task.title }}</q-item-label>
            <q-item-label caption style="color:white" class="truncate-description">{{ task.description }}</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption style="color:white">{{ task.status }}</q-item-label>
            <q-btn label="Detail" glossy text-color="white" color="secondary" style="margin-top: 0.5vh" push></q-btn>
          </q-item-section>
        </q-item>            
      </q-scroll-area>
    </q-list>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  phaseID?: string;
  featureID?: string;
}>();

// Enum for task status
enum TaskStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Blocked = 'Blocked'
}

// Task class
class Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;

  constructor(id: string, title: string, description: string, status: TaskStatus) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
  }
}

// Sample task list (to be replaced with database data)
const tasks = ref<Task[]>([
  new Task('1', 'Research Pathfinding Techniques', 'Brief description for this task that is relatively short', TaskStatus.InProgress),
  new Task('2', 'Implement A* Algorithm', 'Develop core pathfinding logic for the application with extended details', TaskStatus.NotStarted),
  new Task('3', 'Optimize Performance', 'Reduce computational complexity and improve efficiency across multiple modules', TaskStatus.Blocked),
  new Task('4', 'Test Edge Cases', 'Verify algorithm robustness under various conditions', TaskStatus.Completed),
]);

// Map task status to icons
const getStatusIcon = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.NotStarted:
      return 'radio_button_unchecked';
    case TaskStatus.InProgress:
      return 'autorenew';
    case TaskStatus.Completed:
      return 'check_circle';
    case TaskStatus.Blocked:
      return 'block';
    default:
      return 'help';
  }
};

// Map task status to colors
const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.NotStarted:
      return 'grey';
    case TaskStatus.InProgress:
      return 'blue';
    case TaskStatus.Completed:
      return 'green';
    case TaskStatus.Blocked:
      return 'red';
    default:
      return 'grey';
  }
};
</script>

<style lang="scss" scoped>
.truncate-description {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>