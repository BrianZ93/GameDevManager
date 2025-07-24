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
import { computed } from 'vue';
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
  return pageStore.isActive(label);
};

// Handle navigation and update active page
router.afterEach((to) => {
  const label = sidebarItems.value.find(item => item.route === to.path)?.label;
  if (label) {
    pageStore.setActivePage(label);
  }
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