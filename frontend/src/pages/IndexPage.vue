<template>
  <q-page class="full-width full-height row wrap justify-start items-start content-start">
    <dashboard-page v-show="activePage === SidebarPage.Dashboard" />
    <phases-page v-show="activePage === SidebarPage.Phases" />
    <tasks-page v-show="activePage === SidebarPage.Tasks" />
  </q-page>
</template>

<script setup lang="ts">
import DashboardPage from 'src/components/DashboardPage.vue';
import PhasesPage from 'src/components/PhasesPage.vue';
import TasksPage from 'src/components/TasksPage.vue';
import { computed } from 'vue';
import { usePageManagerStore, SidebarPage } from 'src/stores/PageManagerStore';

const pageStore = usePageManagerStore();

const activePage = computed(() => pageStore.getActivePage)

</script>
