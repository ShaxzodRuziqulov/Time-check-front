<template>
  <div class="bg-white shadow-xl rounded-2xl p-6 transition-all duration-300 border border-gray-100 max-w-xl mx-auto">
    <form @submit.prevent="submitForm">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">
        {{ isEditing ? "Ishni tahrirlash" : "Yangi ish yaratish" }}
      </h2>

      <label class="block text-gray-700 font-medium mb-1">Lavozim tanlang</label>
      <select
          v-model="form.positionStatus"
          class="border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none rounded-lg p-3 w-full mb-4"
          required>
        <option value="" disabled>Lavozim tanlang</option>
        <option v-for="status in positionStatuses" :key="status.name" :value="status.name">
          {{ status.label }}
        </option>
      </select>

      <label class="block text-gray-700 font-medium mb-1">Holat</label>
      <select v-model="form.jobStatus"
              required
              class="border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none rounded-lg p-3 w-full mb-4">
        <option value="" disabled>Holat tanlang</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>

      <label class="block text-gray-700 font-medium mb-1">Bo‘lim </label>
      <select
          v-model="form.departmentId"
          class="border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none rounded-lg p-3 w-full mb-4"
          required>
        <option disabled value="">Bo‘limni tanlang</option>
        <option v-for="dep in departments" :key="dep.id" :value="dep.id">
          {{ dep.name }}
        </option>
      </select>

      <div class="flex gap-4 mt-4">
        <button type="submit" class=" cursor-pointer btn-green"> {{ isEditing ? 'Yangilash' : 'Saqlash' }}</button>
        <button type="button" @click="$emit('reset')" class="btn-gray cursor-pointer">Tozalash</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">

import {ref, watch} from "vue";
import {createJob, Department} from "@/models/ProjectModels";

const props = defineProps<{
  modelValue: createJob
  isEditing: Boolean
  departments: Department[]
  positionStatuses: {
    name: string;
    label: string;
  }[];
}>()


const form = ref<createJob>({...props.modelValue})
const emit = defineEmits(["update:modelValue", "submit", "reset"]);

watch(() => props.modelValue, (val) => {
  form.value = {...val};
}, {immediate: true, deep: true})

const submitForm = () => {
  emit('update:modelValue', form.value);
  emit('submit', form.value);
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