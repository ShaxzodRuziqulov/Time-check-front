<!-- src/components/AddUserForm.vue -->
<template>

  <div class="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 max-w-2xl mx-auto">
    <form @submit.prevent="submitForm" class="space-y-4">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Yangi hodim qo‘shish</h2>

      <div class="flex gap-4">
        <div class="w-1/2">
          <label class="block text-gray-700 mb-1">Ismi</label>
          <input v-model="form.firstName" type="text" class="input" placeholder="Ism kiriting" required />
        </div>
        <div class="w-1/2">
          <label class="block text-gray-700 mb-1">Familiyasi</label>
          <input v-model="form.lastName" type="text" class="input" placeholder="Familiya kiriting" required />
        </div>
      </div>

      <label class="block text-gray-700 mb-1">Otasining ismi</label>
      <input v-model="form.middleName" type="text" class="input" placeholder="Ota ism kiriting" required />

      <label class="block text-gray-700 mb-1">Foydalanuvchi nomi</label>
      <input v-model="form.username" type="text" class="input" placeholder="Username" required />

      <label class="block text-gray-700 mb-1">Parol</label>
      <input
          v-model="form.password"
          type="text"
          class="input"
          :placeholder="isEditing ? 'Yangi parol ' : 'Parol kiriting'"
      />

      <label class="block text-gray-700 mb-1">Holat</label>
      <select v-model="form.userStatus" class="input" required>
        <option disabled value="">Holatni tanlang</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="INACTIVE">INACTIVE</option>
      </select>

      <label class="block text-gray-700 mb-1">Tug'ilgan kun</label>
      <input v-model="form.birthDate" type="date" class="input" required />

      <label class="block text-gray-700 mb-1">Ish</label>
      <select v-model="form.jobId" class="input" required>
        <option disabled value="">Tanlang</option>
        <option v-for="(job,index) in jobs" :key="job.id" :value="job.id">
          {{ index + 1 }} {{ job.positionStatus }}
        </option>
      </select>

      <label class="block text-gray-700 mb-1">Role tayinlash</label>
      <select v-model="selectedRoleIds" @change="updateSelectedRoles" class="input" multiple required>
        <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name.replace('ROLE_', '') }}</option>
      </select>
      <div class="flex gap-4 mt-4">
        <button type="submit" class="btn-green"> {{isEditing ? 'Yangilash' : 'Saqlash' }} </button>
        <button type="button" @click="$emit('reset')" class="btn-gray">Tozalash</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import {ref, defineProps, defineEmits, watch} from 'vue'
import type {createUser, Role, Job, Department} from '@/models/ProjectModels'

const props = defineProps<{
  modelValue: createUser
  isEditing?: Boolean
  jobs: Job[],
  roles: Role[],
  departments: Department[],
}>()

const emit = defineEmits(['update:modelValue','submit', 'reset'])
const form = ref<createUser>({...props.modelValue})
const selectedRoleIds = ref<number[]>([])

watch(() => props.modelValue.roles, (newVal, oldVal) => {
  if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
    selectedRoleIds.value = newVal?.map(role => role.id) || []
  }
}, { immediate: true })

const updateSelectedRoles = () => {
  form.value.roles = props.roles.filter(role => selectedRoleIds.value.includes(role.id))
}

watch(() => props.modelValue, (newVal, oldVal) => {
  if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
    form.value = {...newVal}
  }
}, { immediate: true, deep: true })

const submitForm = () => {
  emit('submit', form.value)
}

watch(form, (newVal, oldVal) => {
  if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
    emit('update:modelValue', newVal);
  }
}, { deep: true });
</script>

<style scoped>
@reference "tailwindcss";

.input {
  @apply border border-gray-300 rounded-lg p-3 w-full transition-all duration-200;
}
.btn-green {
  @apply bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg;
}
.btn-gray {
  @apply bg-gray-400 hover:bg-gray-500 text-white px-5 py-2.5 rounded-lg;
}
</style>
