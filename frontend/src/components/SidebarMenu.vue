<template>
  <q-scroll-area class="fit">
    <q-list padding>
      <q-item
        v-for="(item, index) in sidebarItems"
        :key="index"
        :active="isActive(item.label)"
        clickable
        v-ripple
        class="inactiveSidebarItem"
        :to="item.route"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" />
        </q-item-section>

        <q-item-section>
          {{ item.label }}
        </q-item-section>
      </q-item>

      <q-separator />
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue';
import { usePageManagerStore } from '../stores/PageManagerStore';
import type { SidebarPage } from '../stores/PageManagerStore';
import { useRouter } from 'vue-router';

const pageStore = usePageManagerStore();
const router = useRouter();

const sidebarItems = computed(() => [
  {
    label: 'Dashboard' as SidebarPage,
    icon: 'dashboard',
    route: '/',
  },
  {
    label: 'Games' as SidebarPage,
    icon: 'sports_esports',
    route: '/games',
  },
  {
    label: 'Phases' as SidebarPage,
    icon: 'star',
    route: '/phases',
  },
  {
    label: 'Tasks' as SidebarPage,
    icon: 'task',
    route: '/tasks',
  },
]);

const isActive = (label: SidebarPage) => {
  const currentRoute = router.currentRoute.value;
  const item = sidebarItems.value.find(item => item.label === label);
  
  if (!item) return false;
  
  // Exact match for root path
  if (item.route === '/' && currentRoute.path === '/') {
    return true;
  }
  // For other routes, check if the path starts with the route
  if (item.route !== '/' && currentRoute.path.startsWith(item.route)) {
    return true;
  }
  
  return false;
};

// Function to update active page based on current route
const updateActivePage = (path: string) => {
  const label = sidebarItems.value.find(item => {
    // Exact match for root path
    if (item.route === '/' && path === '/') {
      return true;
    }
    // For other routes, check if the path starts with the route
    if (item.route !== '/' && path.startsWith(item.route)) {
      return true;
    }
    return false;
  })?.label;
  
  if (label) {
    pageStore.setActivePage(label);
  }
};

// Watch for route changes
watch(() => router.currentRoute.value.path, (newPath) => {
  updateActivePage(newPath);
}, { immediate: true });

// Initialize active page on mount
onMounted(() => {
  updateActivePage(router.currentRoute.value.path);
});
</script>

<style lang="scss">
.inactiveSidebarItem {
  color: $text-color;

  &.q-item--active {
    background-color: $secondary;
    color: $accent;
    box-shadow: 0 0 6px $active-glow;
  }
}
</style>