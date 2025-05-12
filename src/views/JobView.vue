<template>
  <div class="p-6  ">
    <div class="bg-white shadow-xl rounded-2xl p-6 transition-all duration-300 border border-gray-100 max-w-xl mx-auto">
      <form @submit.prevent="handleSubmit">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">
          {{ isEditing ? "Edit Job" : "Create Job" }}
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

        <label class="block text-gray-700 font-medium mb-1">Status</label>
        <select v-model="form.jobStatus"
                required
                class="border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none rounded-lg p-3 w-full mb-4">
          <option value="" disabled>Status tanlang</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <label class="block text-gray-700 font-medium mb-1">Department</label>
        <select
            v-model="form.departmentId"
            class="border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none rounded-lg p-3 w-full mb-4"
            required>
          <option value="" disabled>Department tanlang</option>
          <option v-for="dep in departments" :key="dep.id" :value="dep.id">
            {{ dep.name }}
          </option>
        </select>

        <div class="flex gap-2">
          <button
              class="bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white px-5 py-2.5 rounded-lg font-semibold shadow">
            {{ isEditing ? "Yangilash" : "Saqlash" }}
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

    <div v-if="jobs.length" class="relative overflow-x-auto mt-8">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">Ishlar ro'yxati</h2>

      <table class="w-full text-sm text-gray-800 bg-white shadow-xl rounded-2xl border border-gray-200">
        <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-semibold tracking-wider">
        <tr>
          <th class="px-6 py-4 text-left">ID</th>
          <th class="px-6 py-4 text-left">Position Status</th>
          <th class="px-6 py-4 text-left">Job Status</th>
          <th class="px-6 py-4 text-left">Department</th>
          <th class="px-6 py-4 text-left">Amallar</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="job in jobs" :key="job.id" class="hover:bg-gray-50 border-t border-gray-200">
          <td class="px-6 py-4">{{ job.id }}</td>
          <td class="px-6 py-4">{{ job.positionStatus }}</td>
          <td class="px-6 py-4">{{ job.jobStatus }}</td>
          <td class="px-6 py-4">{{ getDepartmentName(job.departmentId) }}</td>
          <td class="px-6 py-4 flex gap-2">
            <button
                @click="editMessage(job)"
                class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md font-medium shadow-sm">
              Edit
            </button>
            <button
                @click="deleteJob(job.id)"
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-medium shadow-sm">
              Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {createJob, Department, Job, updateJob} from "../models/ProjectModels.ts";
import {ApiService} from "../service/ApiService.ts";

const departments = ref<Department[]>([]);
const jobs = ref<Job[]>([]);
const isEditing = ref(false);

const positionStatuses = ref<{
  name: string;
  label: string;
}[]>([]);

const form = ref<createJob>({
  departmentId: 0,
  jobStatus: "",
  positionStatus: ""

});
const update = ref<updateJob>({
  id: 0,
  departmentId: 0,
  jobStatus: "",
  positionStatus: ""
});

const resetForm = () => {
  form.value = {
    departmentId: 0,
    jobStatus: "",
    positionStatus: ""
  };
  update.value = {
    id: 0,
    departmentId: 0,
    jobStatus: "",
    positionStatus: ""
  };
  isEditing.value = false;
};

const getDepartmentName = (id: number) => {
  const dep = departments.value.find(d => d.id === id);
  return dep ? dep.name : "Nomalum";
};

const handleSubmit = async () => {
  try {
    if (isEditing.value && update.value.id) {
      await ApiService.updateJob(update.value.id, form.value);
    } else {
      await ApiService.createJob(form.value);
    }
    await loadJobs();
    resetForm();
  } catch (err) {
    console.error(err);
  }
};

const loadPositionStatues = async () => {
  try {
    const positionStatus = await ApiService.getPositions();
    positionStatuses.value = positionStatus.data;
  } catch (error) {
    console.error(error);
  }
}
const loadJobs = async () => {
  try {
    const response = await ApiService.getAllJobs();
    jobs.value = response.data;
  } catch (e) {
    console.error(e);
  }
};

const loadDepartments = async () => {
  try {
    const response = await ApiService.getAllDepartments();
    departments.value = response.data;
  } catch (e) {
    console.error(e);
  }
};

const editMessage = (job: updateJob) => {
  form.value = { ...job };
  isEditing.value = true;
};


const deleteJob = async (id: number) => {
  if (confirm("Rostdan ham o'chirmoqchimisiz?")) {
    await ApiService.deleteJob(id);
    await loadJobs();
  }
};

onMounted(() => {
  loadJobs();
  loadDepartments();
  loadPositionStatues()
});
</script>
