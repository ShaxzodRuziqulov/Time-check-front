<template>
  <div class="p-6 max-w-xl mx-auto">
    <div class="bg-white shadow-xl rounded-2xl p-6 transition-all duration-300 border border-gray-100">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">
          {{ isEditing ? "Hodimni tahrirlash" : "Yangi hodim qo‘shish" }}
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
        <label class="block text-gray-700 font-medium mb-1"> Holat </label>
        <input
            v-model="form.userStatus"
            type="text"
            class="border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none rounded-lg p-3 w-full mb-4 placeholder-gray-400 transition-all duration-200"
            placeholder="Status"
            required
        >
        <label class="block text-gray-700 font-medium mb-1"> Parol</label>
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
            {{ job.id }}
          </option>

        </select>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">

import {ref} from "vue";
import type {createUser, Job} from "../models/ProjectModels.ts";

const jobs = ref<Job[]>([])
const isEditing = ref(false)
const form = ref<createUser>({
  birthDate: new Date,
  jobId: 0,
  middleName: "",
  password: "",
  userStatus: "",
  username: "",
  firstName: "",
  lastName: ""
})

const handleSubmit = async () => {

}
</script>


<style scoped>

</style>