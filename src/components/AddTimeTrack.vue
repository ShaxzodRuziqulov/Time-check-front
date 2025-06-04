<template>
  <div class="bg-white shadow-xl rounded-2xl p-6 transition-all duration-300 border border-gray-100 max-w-xl mx-auto">
    <form @submit.prevent="submitForm" class="space-y-4">
        <h2 class="text-2xl font-bold text-green-700 border-b pb-2">Vaqt hisoboti</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-600 font-medium mb-1">Kechikish sababi</label>
            <input
                v-model="form.delayReason"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"/>
          </div>
          <div>
            <label class="block text-gray-600 font-medium mb-1">Tugash sababi</label>
            <input
                v-model="form.endReason"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"/>
          </div>
          <div>
            <label
                class="block text-gray-600 font-medium mb-1">Foydalanuvchi</label>
            <select
                v-model="form.userId"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400">
              <option disabled value="">Foydalanuvchini tanlang</option>
              <option :disabled="user?.username === 'admin'" v-for="user in users" :key="user.id" :value="user.id">
                {{ user.firstName }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-gray-700 font-medium mb-1"> Sana</label>
            <input
                v-model="form.date"
                type="date"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                required
            >
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

import {ref, watch} from "vue";
import type { updateTimeTrack, User} from "@/models/ProjectModels";

const form = ref<Partial<updateTimeTrack>>({})

const props = defineProps<{
  modelValue: updateTimeTrack
  isEditing: boolean
  users : User[]
}>()
const emit = defineEmits(['update:modelValue', 'submit', 'reset'])

watch(() => props.modelValue, (val) => {
  form.value = {...val}
}, {immediate: true, deep: true})

const submitForm = () => {
  emit('update:modelValue', form.value);
  emit("submit", form.value)
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