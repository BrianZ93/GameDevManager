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
        @click="handleItemClick(item.label)"
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
import { usePageManagerStore } from '../stores/PageManagerStore';
import type { SidebarPage } from '../stores/PageManagerStore';

const pageStore = usePageManagerStore();

const sidebarItems = pageStore.sidebarItems

const isActive = pageStore.isActive

function handleItemClick(label: SidebarPage) {
  pageStore.setActivePage(label)
}
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
