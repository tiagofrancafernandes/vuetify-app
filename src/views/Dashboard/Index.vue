<template>
  <v-main>
    <v-container fluid>
      <v-sheet elevation="2" rounded="lg">
        <div>
          <v-breadcrumbs :items="breadcrumbs">
            <template v-slot:divider>
              <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
          </v-breadcrumbs>
        </div>

        <v-divider></v-divider>
        <div class="pa-2 text-end">
          <v-btn
            variant="tonal"
            size="small"
            append-icon="mdi-table-arrow-left"
          >
            Import CSV
          </v-btn>
        </div>
      </v-sheet>

      <v-row class="my-3">
        <v-col cols="12" sm="6" md="3">
          <info-card v-bind="statisticalData.dropbox">
            <v-progress-linear
              height="24"
              :model-value="statisticalData.dropbox.value"
              :max="statisticalData.dropbox.max as number"
              rounded="pill"
              class="my-auto"
            >
              <template v-slot:default="{ value }">
                <strong class="text-black text-overline">
                  {{ value.toFixed(2) }} %
                </strong>
              </template>
            </v-progress-linear>
            <span class="text-caption text-end"
              >{{
                Format.binaryUnit(statisticalData.dropbox.value, {
                  outputUnit: BinaryUnit.Gibibyte,
                })
              }}
              |
              {{
                Format.binaryUnit(statisticalData.dropbox.max as number, {
                  outputUnit: BinaryUnit.Gibibyte,
                })
              }}</span
            >
          </info-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <info-card v-bind="statisticalData.cache">
            <v-progress-linear
              height="24"
              :model-value="statisticalData.cache.value"
              :max="statisticalData.cache.max as number"
              rounded="pill"
              class="my-auto"
            >
              <template v-slot:default="{ value }">
                <strong class="text-black text-overline">
                  {{ value.toFixed(4) }} %
                </strong>
              </template>
            </v-progress-linear>
            <span class="text-caption text-end"
              >{{
                Format.binaryUnit(statisticalData.cache.value, {
                  outputUnit: BinaryUnit.Gibibyte,
                })
              }}
              |
              {{
                Format.binaryUnit(statisticalData.cache.max as number, {
                  outputUnit: BinaryUnit.Gibibyte,
                })
              }}</span
            >
          </info-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <info-card v-bind="statisticalData.posts"></info-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <info-card v-bind="statisticalData.users"></info-card>
        </v-col>
      </v-row>

      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component ? Component : DefaultComponent" />
        </transition>
      </router-view>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { useIntervalFn } from '@vueuse/core';
import _ from 'lodash';
import { computed, reactive } from 'vue';
import { useRoute } from 'vue-router';

import { initSocketDashboard } from '@/composables/useSocketDashboard';
import { useSocketEventListener } from '@/composables/useSocketEventListener';
import { BinaryUnit, Format } from '@/helpers/format';
import {
  ICountUsersRequest,
  ICountUsersResponse,
  IStorageDropboxRequest,
  IStorageDropboxResponse,
} from '@/interfaces/dashboard';
import InfoCard, { InfoCardProps } from '@/views/Dashboard/InfoCard.vue';

import DefaultComponent from './Default.vue';

const route = useRoute();

const breadcrumbs = computed(() =>
  _(route.matched)
    .map((r) => r.meta.breadcrumb)
    .filter((r) => !_.isUndefined(r))
    .value(),
);

const socket = initSocketDashboard();

const statisticalData = reactive<
  Record<
    'dropbox' | 'cache' | 'posts' | 'users',
    InfoCardProps & Record<string, unknown>
  >
>({
  dropbox: {
    color: 'blue',
    icon: 'mdi-dropbox',
    name: 'Dropbox Storage',
    value: 0,
    max: 0,
  },
  cache: {
    color: 'purple',
    icon: 'mdi-server',
    name: 'Cache Storage',
    value: 0,
    max: 8_589_934_592,
  },
  posts: {
    color: 'yellow',
    icon: 'mdi-post',
    name: 'Posts',
    value: 0,
  },
  users: {
    color: 'green',
    icon: 'mdi-account-group',
    name: 'Users',
    value: 0,
  },
});

const { request: requestStorageDropbox } = useSocketEventListener<
  IStorageDropboxResponse,
  IStorageDropboxRequest
>(socket, 'read:storage:dropbox', {
  response(data) {
    statisticalData.dropbox.value = data.used;
    statisticalData.dropbox.max = data.allocated;
  },
});

const { request: requestCountUsers } = useSocketEventListener<
  ICountUsersResponse,
  ICountUsersRequest
>(socket, 'read:count:users', {
  response(data) {
    statisticalData.users.value = data.count;
  },
});

useIntervalFn(
  () => {
    requestStorageDropbox({ data: null });
    requestCountUsers({ data: null });
  },
  300000,
  { immediateCallback: true },
);
</script>

<style lang="scss" scoped>
.fade-enter-active {
  transition: opacity 0.3s ease;
}
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
