<template>
  <q-layout view="hHh Lpr lff" class="shadow-2 rounded-borders">
    <q-header elevated>
      <q-toolbar class="bg-primary glossy text-white">
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
        </q-avatar>

        <q-toolbar-title>Game Dev Manager</q-toolbar-title>

        <q-btn flat round dense icon="whatshot" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      elevated

      :mini="miniState"
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"

      :width="200"
      :breakpoint="500"
      bordered
      class="bg-primary"
    >
      <SidebarMenu />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SidebarMenu from 'src/components/SidebarMenu.vue';
import { onBeforeMount } from 'vue';
import { useGameStore } from 'src/stores/gameStore';

const drawer = ref(false) // Needed for smooth grow/shrink behavior
const miniState = ref(true)

const gameStore = useGameStore();

onBeforeMount(async () => {
  if (gameStore.getPhases.length === 0) {
    await gameStore.fetchGames();
  }
});

</script>
