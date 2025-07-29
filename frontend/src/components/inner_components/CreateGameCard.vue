<template>
  <q-card
    class="q-pa-xl elevated-card create-game-card flex flex-center column"
    @click="emit('create')"
  >
    <q-icon name="add" size="48px" color="primary" />
    <div class="text-h6 q-mt-md text-white">Create New Game</div>
  </q-card>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'create'): void;
}>();
</script>

<style scoped lang="scss">
.create-game-card {
  width: 30vw;
  height: 50vh;
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  text-align: center;

  &:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
    transform: scale(1.03);
  }
}

.elevated-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  position: relative;
}
</style>
