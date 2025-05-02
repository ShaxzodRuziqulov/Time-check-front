<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div class="bg-white shadow-xl rounded-2xl p-6 transition-all duration-300 border border-gray-100">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">
          Yangi hodim qo‘shish
        </h2>
        <div class="flex gap-4">
          <div class="w-1/2">
            <label class="block text-gray-700 font-medium mb-1">Ismi</label>
            <input
                v-model="form.firstName"
                type="text"
                class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ism kiriting"
                required
            />
          </div>
          <div class="w-1/2">
            <label class="block text-gray-700 font-medium mb-1">Familiyasi</label>
            <input
                v-model="form.lastName"
                type="text"
                class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Familiya kiriting"
                required
            />
          </div>
        </div>
        <label class="block text-gray-700 font-medium mb-1"> Otasining ismi</label>
        <input
            v-model="form.middleName"
            type="text"
            class="border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none rounded-lg p-3 w-full mb-4 placeholder-gray-400 transition-all duration-200"
            placeholder="Ota ism kiriting"
            required
        >
        <label class="block text-gray-700 font-medium mb-1"> Username</label>
        <input
            v-model="form.username"
            type="text"
            class="border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none rounded-lg p-3 w-full mb-4 placeholder-gray-400 transition-all duration-200"
            placeholder="Username"
            required
        >
        <label class="block text-gray-700 font-medium mb-1"> Parol</label>
        <input
            v-model="form.password"
            type="password"
            class="border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none rounded-lg p-3 w-full mb-4 placeholder-gray-400 transition-all duration-200"
            placeholder="Password"
            required
        >
        <label class="block text-gray-700 font-medium mb-1">Status</label>
        <select
            required
            v-model="form.userStatus"
            class="border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none rounded-lg p-3 w-full mb-4">
          <option disabled value="">Status tanlang</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
        <label class="block text-gray-700 font-medium mb-1"> Tug'ilgan kun</label>
        <input
            v-model="form.birthDate"
            type="date"
            class="border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none rounded-lg p-3 w-full mb-4 placeholder-gray-400 transition-all duration-200"
            required
        >
        <label class="block text-gray-700 font-medium mb-1"> Ish </label>
        <select v-model="form.jobId"
                required
                class="border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none rounded-lg p-3 w-full mb-4 placeholder-gray-400 transition-all duration-200">
          <option disabled>
            Tanlang
          </option>
          <option v-for="job in jobs" :key="job.id" :value="job.id">
            {{ job.positionStatus }}
          </option>
        </select>
        <div class="flex gap-4 mb-4">
          <button
              type="submit"
              class="required bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white px-5 py-2.5 rounded-lg font-semibold shadow">
            Saqlash
          </button>
          <button
              type="button"
              @click="resetForm"
              class="bg-gray-400 hover:bg-gray-500 transition-colors duration-200 text-white px-5 py-2.5 rounded-lg font-semibold shadow">
            Bekor qilish
          </button>
        </div>
      </form>
    </div>
    <div v-if="users.length" class="relative overflow-x-auto mt-8">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Xodimlar ro'yxati</h2>

      <table
          class="w-full text-sm overflow-x-auto text-gray-800 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-semibold tracking-wider">
        <tr>
          <th class="px-6 py-4 text-left">ID</th>
          <th class="px-6 py-4 text-left">Ismi</th>
          <th class="px-6 py-4 text-left">Familiyasi</th>
          <th class="px-6 py-4 text-left">Ota ismi</th>
          <th class="px-6 py-4 text-left">Username</th>
          <th class="px-6 py-4 text-left">Holat</th>
          <th class="px-6 py-4 text-left">Tug'ilgan kun</th>
          <th class="px-6 py-4 text-left">Ish</th>
          <th class="px-6 py-4 text-left">Role</th>
          <th class="px-6 py-4 text-left">Amallar</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="user in users"
            :key="user.id"
            class="hover:bg-gray-50 transition-all duration-200 border-t border-gray-200"
        >
          <td class="px-6 py-4 font-medium">{{ user.id }}</td>
          <td class="px-6 py-4">{{ user.firstName }}</td>
          <td class="px-6 py-4">{{ user.lastName }}</td>
          <td class="px-6 py-4">{{ user.middleName }}</td>
          <td class="px-6 py-4">{{ user.username }}</td>
          <td class="px-6 py-4">{{ user.userStatus }}</td>
          <td class="px-6 py-4">{{ user.birthDate }}</td>
          <td class="px-6 py-4">{{ getJobName(user.jobId) }}</td>
          <td class="px-6 py-4">{{ getRoleName(user.rolesId) }}</td>
          <td class="px-6 py-4">
            <div class="flex gap-2">
              <button
                  @click="editMessage(user)"
                  class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md font-medium shadow-sm transition-colors duration-200"
              >
                Edit
              </button>
              <button
                  @click="deleteUser(user.id)"
                  class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-medium shadow-sm transition-colors duration-200"
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
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import type {createUser, Job, Role, updateUsers, User} from "../models/ProjectModels.ts";
import {ApiService} from "../service/ApiService.ts";

const jobs = ref<Job[]>([])
const isEditing = ref(false)
const users = ref<User[]>([])
const roles = ref<Role[]>([])

const form = ref<createUser>({
  birthDate: "",
  jobId: 0,
  middleName: "",
  password: "",
  userStatus: "",
  username: "",
  firstName: "",
  lastName: ""
})
const update = ref<updateUsers>({
  id: 0,
  birthDate: "",
  jobId: 0,
  middleName: "",
  password: "",
  userStatus: "",
  username: "",
  firstName: "",
  lastName: ""
})
const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await ApiService.updateUser(update.value.id, {
        ...form.value, id: update.value.id,
      })
    } else {
      await ApiService.createUser(form.value)
    }
    resetForm()
    await loadUsers()
  } catch (error) {
    console.log(error);
  }
}


const loadUsers = async () => {
  try {
    const res = await ApiService.getAllUsers()
    console.log(res)
    users.value = res.data
  } catch (error) {
    console.log(error)
  }
}
const resetForm = () => {
  form.value = {
    birthDate: "",
    jobId: 0,
    middleName: "",
    password: "",
    userStatus: "",
    username: "",
    firstName: "",
    lastName: ""
  }
  update.value = {
    id: 0,
    birthDate: "",
    jobId: 0,
    middleName: "",
    password: "",
    userStatus: "",
    username: "",
    firstName: "",
    lastName: ""
  }

  isEditing.value = false
}
const editMessage = (user: updateUsers) => {
  update.value = {
    id: user.id,
    birthDate: user.birthDate,
    jobId: user.jobId,
    middleName: user.middleName,
    password: user.password,
    userStatus: user.userStatus,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName
  }
  form.value = {
    birthDate: user.birthDate,
    jobId: user.jobId,
    middleName: user.middleName,
    password: user.password,
    userStatus: user.userStatus,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName
  }
  isEditing.value = true
}
const deleteUser = async (id: number) => {
  if (confirm("Are you sure?")) {
    await ApiService.deleteUser(id)
    await loadUsers()
  }
}

const loadJob = async () => {
  try{
    const res = await ApiService.getAllJobs()
    jobs.value = res.data
  }catch(error){
    console.log(error)
  }
}
const getJobName = (id: number) => {
  const job = jobs.value.find(j => j.id === id)
  return job ? job.positionStatus : 'Noma’lum'
}
const getRoleName = (id: number) => {
  const role = roles.value.find(r => r.id === id)
  return role ? role.name : 'Noma’lum'
}

onMounted(() => {
  loadUsers()
  loadJob()
})

</script>


<style scoped>

</style>