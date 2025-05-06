<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Bosh sahifa</h1>

    <!-- Info Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-4 rounded-xl shadow hover:shadow-md">
        <div class="text-gray-500">Foydalanuvchilar</div>
        <div class="text-2xl font-semibold text-blue-600">{{ userCount }}</div>
      </div>
      <div class="bg-white p-4 rounded-xl shadow hover:shadow-md">
        <div class="text-gray-500">Departmentlar</div>
        <div class="text-2xl font-semibold text-green-600">{{ departmentCount }}</div>
      </div>
      <div class="bg-white p-4 rounded-xl shadow hover:shadow-md">
        <div class="text-gray-500">Job lavozimlari</div>
        <div class="text-2xl font-semibold text-purple-600">{{ jobCount }}</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-xl shadow mb-6">
      <h2 class="text-xl font-semibold mb-4">Filterlar</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select class="p-2 border rounded w-full" v-model="selectedDepartmentId">
          <option disabled value="">Bo'limni tanlang</option>
          <option v-for="department in departments" :key="department.id" :value="department.id">
            {{ department.name }}
          </option>
        </select>

        <select class="p-2 border rounded w-full" v-model="selectedJobId">
          <option disabled value="">Lavozimni tanlang</option>
          <option v-for="job in jobs" :key="job.id" :value="job.id">
            {{ job.positionStatus }} ({{ getDepartmentName(job.departmentId) }})
          </option>
        </select>

      </div>
    </div>

    <!-- User Table -->
    <div class="bg-white p-4 rounded-xl shadow">
      <h2 class="text-xl font-semibold mb-4">Foydalanuvchilar ro'yxati</h2>
      <table class="min-w-full table-auto border">
        <thead>
        <tr class="bg-gray-200">
          <th class="px-4 py-2 text-left">#</th>
          <th class="px-6 py-4 text-left">Ismi</th>
          <th class="px-6 py-4 text-left">Familiyasi</th>
          <th class="px-6 py-4 text-left">Ota ismi</th>
          <th class="px-6 py-4 text-left">Username</th>
          <th class="px-6 py-4 text-left">Holat</th>
          <th class="px-6 py-4 text-left">Tug'ilgan kun</th>
          <th class="px-6 py-4 text-left">Ish</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, index) in filteredUsers" :key="user.id" class="border-t">
          <td class="px-4 py-2">{{ index + 1 }}</td>
          <td class="px-6 py-4">{{ user.firstName }}</td>
          <td class="px-6 py-4">{{ user.lastName }}</td>
          <td class="px-6 py-4">{{ user.middleName }}</td>
          <td class="px-6 py-4">{{ user.username }}</td>
          <td class="px-6 py-4">{{ user.userStatus }}</td>
          <td class="px-6 py-4">{{ user.birthDate }}</td>
          <td class="px-6 py-4">{{ getJobName(user.jobId) }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {ApiService} from "../service/ApiService.ts";
import type {Department, Job, User} from "../models/ProjectModels.ts";

const jobCount = ref(0)
const userCount = ref(0)
const departmentCount = ref(0)
const departments = ref<Department[]>([])
const jobs = ref<Job[]>([])
const users = ref<User[]>([])
const selectedDepartmentId = ref<number | null>(null);
const selectedJobId = ref<number | null>(null);

const positionStatuses = ref<{
  name: string;
  label: string;
}[]>([]);

const loadStats = async () => {
  try {
    {
      const [user, job, department] = await Promise.all([
        ApiService.countUser(),
        ApiService.countJob(),
        ApiService.countDepartment()
      ]);

      userCount.value = user.data
      jobCount.value = job.data
      departmentCount.value = department.data

    }
  } catch (err) {
    console.log(err)
  }
}

const loadDepartments = async () => {
  try {
    const rest = await ApiService.getAllDepartments()
    departments.value = rest.data
  } catch (error) {
    console.log(error)
  }
}

const loadJobs = async () => {
  try {
    const rest = await ApiService.getAllJobs()
    jobs.value = rest.data
  } catch (err) {
    console.log(err)
  }
}

const loadUsers = async () => {
  try {
    const rest = await ApiService.getAllUsers()
    users.value = rest.data
  } catch (error) {
    console.log(error)
  }
}

const getJobName = (id: number) => {
  const job = jobs.value.find(j => j.id === id);
  return job ? job.positionStatus : "Nomalum";
};

const loadPositionStatues = async () => {
  try {
    const positionStatus = await ApiService.getPositions();
    positionStatuses.value = positionStatus.data;
  } catch (error) {
    console.error(error);
  }
}

const getDepartmentName = (id: number) => {
  const dep = departments.value.find(d => d.id === id);
  return dep ? dep.name : "Nomalum";
};

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const job = jobs.value.find(j => j.id === user.jobId);

    const matchDepartment = selectedDepartmentId.value
        ? job?.departmentId === selectedDepartmentId.value
        : true;

    const matchJob = selectedJobId.value
        ? user.jobId === selectedJobId.value
        : true;

    return matchDepartment && matchJob;
  });
});

onMounted(() => {
  loadStats()
  loadJobs()
  loadUsers()
  loadDepartments()
  loadPositionStatues()
})

</script>

<style scoped>

</style>