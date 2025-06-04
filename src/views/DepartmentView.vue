<template>
  <div class="p-6 max-w-2xl mx-auto">
    <div class="bg-white shadow-xl rounded-2xl p-6 transition-all duration-300 border border-gray-100">
      <form @submit.prevent="handleSubmit">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">
          {{ isEditing ? "Bo'limni tahrirlash" : "Yangi Bo'lim qo‘shish" }}
        </h2>

        <label class="block text-gray-700 font-medium mb-1"> Bo'lim nomi</label>
        <input
            v-model="form.name"
            required
            type="text"
            placeholder="Bo'lim nomi"
            class="border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none rounded-lg p-3 w-full mb-4 placeholder-gray-400 transition-all duration-200">

        <label class="block text-gray-700 font-medium mb-1">Holat</label>
        <select
            required
            v-model="form.departmentStatus"
            class="border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none rounded-lg p-3 w-full mb-4">
          <option disabled value="">Holatni tanlang</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <p v-if="errorMessage" class="text-red-500 text-sm mb-4">{{ errorMessage }}</p>

        <div
            class="flex gap-2">
          <button
              type="submit"
              class=" required bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white px-5 py-2.5 rounded-lg font-semibold shadow cursor-pointer">
            {{ isEditing ? "Yangilash" : "Saqlash" }}
          </button>
          <button
              type="button"
              @click="cancelEdit"
              class="bg-gray-400 hover:bg-gray-500 transition-colors duration-200 text-white px-5 py-2.5 rounded-lg font-semibold shadow cursor-pointer"
          >
            Bekor qilish
          </button>
        </div>
      </form>
    </div>
    <div v-if="departments.length" class="relative overflow-x-auto mt-8">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Bo'limlar ro‘yxati</h2>

      <table
          class="w-full text-sm overflow-x-auto text-gray-800 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-semibold tracking-wider">

        <tr>
          <th class="px-6 py-4 text-left">#</th>
          <th class="px-6 py-4 text-left">Nomi</th>
          <th class="px-6 py-4 text-left">Holati</th>
          <th class="px-6 py-4 text-left">Amallar</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(department,index) in departments"
            :key="department.id"
            class="hover:bg-gray-50 transition-all duration-200 border-t border-gray-200">
          <td class="px-6 py-4 font-medium">{{ index + 1 }}</td>
          <td class="px-6 py-4 font-medium">{{ department.name }}</td>
          <td class="px-6 py-4 font-medium">
            {{ department.departmentStatus || "Noma'lum" }}
          </td>
          <td class="px-6 py-4 font-medium">
            <div class="flex gap-2">
              <button
                  @click="editDepartment(department)"
                  class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md font-medium shadow-sm transition-colors duration-200 cursor-pointer"
              >
                Edit
              </button>
              <button
                  @click="confirmDelete(department.id)"
                  class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-medium shadow-sm
                transition-colors duration-200 cursor-pointer">
                Delete
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <CDialog
        :show="showDeleteConfirm"
        @close="showDeleteConfirm = false"
        bodyClass="rounded-lg !bg-bg-primary text-center px-4 py-6"
    >
      <DeleteConfirm
          v-model:show="showDeleteConfirm"
          title="Ushbu bo'limni o'chirmoqchimisiz?"
          @confirm="handleDeleteConfirmed"
      />
    </CDialog>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Department, updateDepartment} from "@/models/ProjectModels";
import {ApiService} from "@/service/ApiService";
import {useCustomToast} from "@/composables/useCustomToast";
import CDialog from "@/components/CDialog.vue";
import DeleteConfirm from "@/components/DeleteConfirm.vue";

const form = ref<updateDepartment>({
  name: '',
  id: 0,
  departmentStatus: ''
})
const departments = ref<Department[]>([])
const isEditing = ref(false)
const errorMessage = ref('')
const {showToast} = useCustomToast();

const loadDepartments = async () => {
  const res = await ApiService.getAllDepartments()
  departments.value = res.data
}

const handleSubmit = async () => {
  try {
    if (isEditing.value && form.value.id) {
      await ApiService.updateDepartment(form.value.id, form.value)
      showToast("Muvaffaqiyatli o'zgartirildi", "success")
    } else {
      await ApiService.createDepartment({name: form.value.name, status: form.value.status})
      showToast("Muvaffaqiyatli yaratildi", "success")
    }
    resetForm()
    await loadDepartments()
  } catch (error) {
    console.log(error)
  }
}

const editDepartment = (department: updateDepartment) => {

  form.value = {...department}
  isEditing.value = true
}

const deleteDepartment = async (id: number) => {
  await ApiService.deleteDepartment(id)
  await loadDepartments()
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {
  form.value = {name: "", id: 0, departmentStatus: ''}
  isEditing.value = false
}

const showDeleteConfirm = ref(false);
const selectedUserId = ref<number | null>(null)

const confirmDelete = (userId: number) => {
  selectedUserId.value = userId;
  showDeleteConfirm.value = true;
}

const handleDeleteConfirmed = async () => {
  if (selectedUserId.value !== null) {
    await deleteDepartment(selectedUserId.value);
    showDeleteConfirm.value = false;
  }
}

onMounted(() => {
  loadDepartments()
})

</script>
<style scoped>

</style>
