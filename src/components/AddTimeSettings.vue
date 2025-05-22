<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
    <form @submit.prevent="submitForm" class="space-y-4">
      <h2 class="text-2xl font-bold text-blue-700 border-b pb-2">Vaqtni nazorat qolish sozlamalari</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-600 font-medium mb-1">Vaqtdan</label>
          <input
              v-model="form.fromTime"
              type="time"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"/>
        </div>
        <div>
          <label class="block text-gray-600 font-medium mb-1">Vaqtgacha</label>
          <input
              v-model="form.toTime"
              type="time"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"/>
        </div>

        <div>
          <label class="block text-gray-600 font-medium mb-1">Holat</label>
          <select
              v-model="form.trackSettingsStatus"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400">
            <option disabled value="">Tanlang</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
        <div class="flex gap-4 mt-4">
          <button type="submit" class=" cursor-pointer btn-green"> {{ isEditing ? 'Yangilash' : 'Saqlash' }}</button>
          <button type="button" @click="$emit('reset')" class="btn-gray cursor-pointer">Tozalash</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, ref, watch} from "vue";
import type {createTrackSettings} from "@/models/ProjectModels";

const props = defineProps<{
  modelValue: createTrackSettings
  isEditing?: Boolean
}>()
const form = ref<createTrackSettings>({...props.modelValue})
const emit = defineEmits(['update:modelValue', 'submit', 'reset'])

watch(() => props.modelValue, (val) => {
  form.value = {...val}
}, {immediate: true, deep: true})

const submitForm = () => {
  emit('update:modelValue', form.value) // optional
  emit('submit', form.value)
}

</script>

<style scoped>
@reference "tailwindcss";

.btn-green {
  @apply bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg;
}

.btn-gray {
  @apply bg-gray-400 hover:bg-gray-500 text-white px-5 py-2.5 rounded-lg;
}
</style>