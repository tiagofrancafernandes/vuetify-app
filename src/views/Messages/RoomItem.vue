<template>
  <v-list-item>
    <template #prepend>
      <v-avatar
        color="primary"
        class="elevation-6"
        :image="roomPhotoUrl"
      ></v-avatar>
    </template>
    <v-list-item-title>
      <v-icon
        :color="room.isGroup ? 'info' : 'warning'"
        size="16"
        :icon="room.isGroup ? 'mdi-account-group' : 'mdi-account-key'"
      ></v-icon>
      {{ displayName }}
    </v-list-item-title>

    <v-list-item-subtitle>
      {{ room.isGroup ? 'Group' : 'Private' }}
    </v-list-item-subtitle>

    <template #append>
      <v-btn
        color="grey-lighten-1"
        icon="mdi-login-variant"
        variant="text"
        :to="{
          name: 'Messages:Room',
          params: { roomId: room.id },
        }"
      ></v-btn>
    </template>
  </v-list-item>
</template>

<script lang="ts" setup>
import { useRoom } from '@/composables/useRoom';
import { IRoomResponse } from '@/interfaces/rooms';

const props = defineProps<{
  room: IRoomResponse;
}>();

const { displayName, roomPhotoUrl } = useRoom(props.room);
</script>
