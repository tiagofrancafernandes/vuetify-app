<template>
  <base-dialog
    fullscreen
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :disabled-submit="isLoading || !submitable"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>Profile Photo</template>

    <v-btn variant="tonal" color="info" @click="open">Choose image</v-btn>

    <v-divider class="my-3"></v-divider>

    <div class="d-flex justify-center align-center cropper-wrapper">
      <div
        :style="{ backgroundImage: 'url(' + imageCropperSrc + ')' }"
        class="image-background"
      ></div>
      <cropper
        ref="cropperRef"
        class="cropper elevation-1"
        background-class="cropper-background"
        :stencil-component="RectangleStencil"
        :src="imageCropperSrc"
        :stencil-props="{
          aspectRatio: 16 / 9,
          width: IMAGE_FILE.COVER_DIMENSIONS.WIDTH,
          height: IMAGE_FILE.COVER_DIMENSIONS.HEIGHT,
        }"
        @ready="submitable = true"
        @error="submitable = false"
      />
    </div>

    <template #action>Change</template>
  </base-dialog>
</template>

<script lang="ts" setup>
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.compact.css';

import { useFileDialog } from '@vueuse/core';
import { ref, watch } from 'vue';
import { Cropper, RectangleStencil } from 'vue-advanced-cropper';

import { useAuth } from '@/composables/useAuth';
import { useAxios } from '@/composables/useAxios';
import { FileHelper, IMAGE_FILE } from '@/helpers/file';
import { services } from '@/services';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', data: any): void;
}>();

const { fetchAccessToken, updateImage } = useAuth();

const submitable = ref(false);

const imageCropperSrc = ref<string | null>(null);

const {
  files: selectFiles,
  open,
  reset,
} = useFileDialog({
  multiple: false,
  accept: '.jpg,.png',
});

watch(selectFiles, (files) => {
  const file = files?.item(0);
  if (!file) {
    return;
  }

  imageCropperSrc.value = URL.createObjectURL(file);
});

const cropperRef = ref<InstanceType<typeof Cropper>>();

const { isLoading, excute: updateCover } = useAxios(
  services.auth,
  'updateCover',
);

async function onSubmit() {
  const result = cropperRef.value!.getResult();

  const image = await FileHelper.convertCanvasToFile(result.canvas!, {
    mimeType: IMAGE_FILE.MIME_TYPE,
    dimensions: {
      width: IMAGE_FILE.COVER_DIMENSIONS.WIDTH,
      height: IMAGE_FILE.COVER_DIMENSIONS.HEIGHT,
    },
  });

  (async () => {
    await updateCover({ image });
    await fetchAccessToken();
    updateImage('cover');
  })();

  emit('update:modelValue', false);
}

function onOpen() {
  reset();
  imageCropperSrc.value = null;
  submitable.value = false;
}
</script>

<style lang="scss" scoped>
.cropper-wrapper {
  width: 100%;
  height: calc(100vh - 220px);
}
</style>
