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
        <div class="text-gray-500">Bo'limlar</div>
        <div class="text-2xl font-semibold text-green-600">{{ departmentCount }}</div>
      </div>
      <div class="bg-white p-4 rounded-xl shadow hover:shadow-md">
        <div class="text-gray-500">Lavozimlar </div>
        <div class="text-2xl font-semibold text-purple-600">{{ jobCount }}</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-xl shadow mb-6">
      <h2 class="text-xl font-semibold mb-4">Filterlar</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <select class="p-2 border cursor-pointer rounded outline-none px-2 w-full" v-model.number="selectedDepartmentId">
          <option disabled value="">Bo'limni tanlang</option>
          <option :value="null">Hamma bo'lim</option>
          <option class="hover:bg-gray-100" v-for="department in departments" :key="department.id" :value="department.id">
            {{ department.name }}
          </option>
        </select>

        <select class="p-2 border outline-none rounded w-full cursor-pointer" v-model="selectedPositionStatus">
          <option disabled value="">Lavozimni tanlang</option>
          <option value="">Hamma lavozimlar</option>
          <option
              v-for="job in uniqueJobs"
              :key="job.positionStatus"
              :value="job.positionStatus"
          >
            {{ job.positionStatus }} ({{ getDepartmentName(job.departmentId) }})
          </option>
        </select>
      </div>
    </div>

    <!-- User Table -->
    <div class="bg-white p-4 rounded-xl shadow">
      <h2 class="text-xl font-semibold mb-4">Xodimlar ro'yxati</h2>
      <table class="min-w-full table-auto border">
        <thead>
        <tr class="bg-gray-200">
          <th class="px-4 py-2 text-left">#</th>
          <th class="px-6 py-4 text-left">F.I.O</th>
          <th class="px-6 py-4 text-left">Foydalanuvchi nomi</th>
          <th class="px-6 py-4 text-left">Holat</th>
          <th class="px-6 py-4 text-left">Tug'ilgan kun</th>
          <th class="px-6 py-4 text-left">Ish</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, index) in filteredUsers" :key="user.id" class="border-t">
          <td class="px-4 py-2">{{ index + 1 }}</td>
          <td class="px-6 py-4">{{ fullName(user) }}</td>
          <td class="px-6 py-4">{{ user.username }}</td>
          <td class="px-6 py-4">{{ user.userStatus }}</td>
          <td class="px-6 py-4">{{ user.birthDate }}</td>
          <td class="px-6 py-4">{{ getJobName(user.jobId) }}</td>
        </tr>
        </tbody>
      </table>
      <div class="w-full text-center px-6 py-4" v-if="!filteredUsers?.length">
        Foydalanuvchilar topilmadi
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {ApiService} from "@/service/ApiService";
import type {Department, Job, User} from "@/models/ProjectModels";
import { useUsersStore } from "@/stores/usersStore";

const jobCount = ref(0)
const userCount = ref(0)
const departmentCount = ref(0)
const departments = ref<Department[]>([])
const jobs = ref<Job[]>([])
const users = ref<User[]>([])
const user = ref<User>();
const selectedDepartmentId = ref<number | ''>('');
const usersStore = useUsersStore();

const positionStatuses = ref<{
  name: string;
  label: string;
}[]>([]);

const fullName = (user: User) => `${user.firstName} ${user.lastName} ${user.middleName}`;

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
    const rest = await ApiService.getAllUsers();
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
  const departmentId = selectedDepartmentId.value;
  const positionStatus = selectedPositionStatus.value;
  return users.value.filter(user => {
    const job = jobs.value.find(j => j.id === user.jobId);

    if (!job) return false;

    if (departmentId && job.departmentId !== departmentId) return false;
    return !(positionStatus && job.positionStatus !== positionStatus);
  });
});


const filteredJobs = computed(() => {
  if (!selectedDepartmentId.value) return jobs.value;

  return jobs.value.filter(job => job.departmentId === selectedDepartmentId.value);
});

const selectedPositionStatus = ref("");

const uniqueJobs = computed(() => {
  const seen = new Set();
  return filteredJobs.value.filter(job => {
    if (seen.has(job.positionStatus)) return false;
    seen.add(job.positionStatus);
    return true;
  });
});


  loadStats()
  loadJobs()
  loadUsers()
  loadDepartments()
  loadPositionStatues()

</script>