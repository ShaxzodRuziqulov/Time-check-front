<template>
  <div>
    <CButton @click="showForm = true" class="my-4 max-w-[192px] mx-auto cursor-pointer flex items-center justify-center"
             text="Yangi hodim qo‘shish" variant="primary"/>
    <CDialog
        has-close-icon
        no-header
        :show="showForm"
        @close="closeDialog"
        bodyClass="rounded-lg !bg-bg-primary"
    >
      <AddUserForm
          v-model="form"
          :jobs="jobs"
          :is-editing="isEditing"
          :roles="roles"
          :departments="departments"
          @submit="handleSubmit"
          @reset="isResetForm"
      />
    </CDialog>

    <CDialog
        :show="showDeleteConfirm"
        @close="showDeleteConfirm = false"
        bodyClass="rounded-lg !bg-bg-primary text-center px-4 py-6"
    >
      <p class="text-lg font-semibold mb-4">Ushbu foydalanuvchini o'chirmoqchimisiz?</p>
      <div class="flex justify-center gap-4">
        <button
            @click="handleDeleteConfirmed"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium">
          Ha, o‘chirish
        </button>
        <button
            @click="showDeleteConfirm = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-medium"
        >
          Bekor qilish
        </button>
      </div>
    </CDialog>

    <div v-if="users.length" class="mt-10 mb-8 px-4 sm:px-8">
      <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <h2 class="text-xl font-semibold px-6 py-4 bg-gray-100 border-b border-gray-200 text-gray-800">
          Xodimlar ro'yxati
        </h2>

        <div class="overflow-x-auto">
          <table class="w-full text-sm text-gray-800">
            <thead class="bg-gray-50 text-gray-700 uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th class="px-6 py-4 text-left whitespace-nowrap">#</th>
              <th class="px-6 py-4 text-left whitespace-nowrap">Ismi</th>
              <th class="px-6 py-4 text-left whitespace-nowrap">Familiyasi</th>
              <th class="px-6 py-4 text-left whitespace-nowrap">Ota ismi</th>
              <th class="px-6 py-4 text-left whitespace-nowrap">Foydalanuvchi nomi</th>
              <th class="px-6 py-4 text-left whitespace-nowrap">Holat</th>
              <th class="px-6 py-4 text-left whitespace-nowrap">Tug'ilgan kun</th>
              <th class="px-6 py-4 text-left whitespace-nowrap">Ish</th>
              <th class="px-6 py-4 text-left whitespace-nowrap">Role</th>
              <th class="px-6 py-4 text-left whitespace-nowrap">Amallar</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(user, index) in sortUsers"
                :key="user.id"
                class="hover:bg-gray-50 transition-all duration-200 border-t border-gray-100"
            >
              <td class="px-6 py-4 font-medium whitespace-nowrap">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.firstName }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.lastName }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.middleName }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.username }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.userStatus }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.birthDate }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ getJobName(user.jobId) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
              <span
                  v-for="(role, index) in user.roles"
                  :key="role.id"
              >
                {{ role.name.replace('ROLE_', '') }}<span v-if="index < user.roles.length - 1">, </span>
              </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex gap-2">
                  <button
                      @click="editMessage(user)"
                      class="bg-yellow-500 hover:bg-yellow-600 cursor-pointer text-white px-3 py-1.5 rounded-md font-medium shadow-sm transition"
                  >
                    Edit
                  </button>
                  <button
                      @click="confirmDelete(user.id)"
                      class="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-3 py-1.5 rounded-md font-medium shadow-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">

import {computed, onMounted, ref} from "vue";
import type {createUser, Department, Job, Role, updateUsers, User} from "@/models/ProjectModels";
import {ApiService} from "@/service/ApiService";
import CButton from "@/components/CButton.vue";
import AddUserForm from "@/components/AddUserForm.vue";
import CDialog from "@/components/CDialog.vue";
import axios from "@/axios";
import {useCustomToast} from "@/composables/useCustomToast";

const showForm = ref(false)
const jobs = ref<Job[]>([])
const allJobs = ref<Job[]>([])
const isEditing = ref(false)
const users = ref<User[]>([])
const departments = ref<Department[]>([])
const roles = ref<Role[]>([])
const selectedRoleIds = ref<number[]>([])
const {showToast} = useCustomToast();
const sortUsers = computed(() => users.value.sort((a, b) => a.id - b.id))

const getDefaultForm = (): createUser => ({
  roles: [],
  id: undefined,
  birthDate: "",
  jobId: 0, // assuming jobId is a number
  middleName: "",
  password: "",
  userStatus: "",
  username: "",
  firstName: "",
  lastName: ""
})

const form = ref<createUser>(getDefaultForm())


const handleSubmit = async (userData: createUser) => {
  try {
    if (isEditing.value && userData.id !== null) {
      await axios.put(`/api/admin/user/update/${userData.id}`, userData)
      showToast("Muvaffaqiyatli o'zgartirildi", "success")
    } else {
      await ApiService.createUser(userData)
      showToast("Muvaffaqiyatli yaratildi", "success")
    }
    resetForm()
    showForm.value = false
    await loadUsers()
  } catch (error) {
    console.error(error)
  }
}

const isResetForm = () => {
  form.value = getDefaultForm()
}

const resetForm = () => {
  form.value = getDefaultForm()
  isEditing.value = false
  showForm.value = false
}

const closeDialog = () => {
  resetForm()
}

const editMessage = (user: updateUsers) => {
  showForm.value = true
  isEditing.value = true
  selectedRoleIds.value = user.roles?.map(role => role.id) || []
  form.value = {
    ...user,
    password: '',
    roles: user.roles || []
  }
}

const deleteUser = async (id: number) => {
  await ApiService.deleteUser(id)
  await loadUsers()
}

const loadJob = async () => {
  try {
    const res = await ApiService.getFreeJobs()
    jobs.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const loadJobAll = async () => {
  try {
    const res = await ApiService.getAllJobs()
    allJobs.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const getJobName = (id: number) => {
  const job = allJobs.value.find(j => j.id === id)
  return job ? job.positionStatus : 'Noma’lum'
}

const loadUsers = async () => {
  try {
    const res = await ApiService.getAllUsers()
    users.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const loadDepartments = async () => {
  try {
    const response = await ApiService.getAllDepartments();
    departments.value = response.data;
  } catch (e) {
    console.error(e);
  }
};

const loadRoles = async () => {
  try {
    const res = await ApiService.getAllRoles()
    roles.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const showDeleteConfirm = ref(false);
const selectedUserId = ref<number | null>(null)

const confirmDelete = (userId: number) => {
  selectedUserId.value = userId;
  showDeleteConfirm.value = true;
}

const handleDeleteConfirmed = async () => {
  if (selectedUserId.value !== null) {
    await deleteUser(selectedUserId.value);
    showDeleteConfirm.value = false;
  }
}

onMounted(() => {
  loadUsers()
  loadJob()
  loadJobAll()
  loadDepartments()
  loadRoles()
})
</script>

<style scoped>

</style>
