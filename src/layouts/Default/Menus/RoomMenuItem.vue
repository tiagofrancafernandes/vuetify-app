<template>
  <v-list-item
    rounded="xl"
    :value="item.value"
    :prepend-avatar="roomPhotoUrl"
    :active="isActive(item.value)"
  >
    <v-list-item-title class="px-2">{{ displayName }}</v-list-item-title>
  </v-list-item>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import { useRoom } from '@/composables/useRoom';
import { KEYS } from '@/constants';
import { IRoomMenuItem } from '@/interfaces/menus';

const props = defineProps<{
  item: IRoomMenuItem;
}>();

const { displayName, roomPhotoUrl } = useRoom(props.item.room);

const isActive = inject(KEYS.DRAWER.IS_ACTIVE)!;
</script>
