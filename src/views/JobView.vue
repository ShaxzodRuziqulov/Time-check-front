<template>
  <div class="p-6  ">

    <div class="bg-white shadow-xl rounded-2xl p-6 transition-all duration-300 border border-gray-100 max-w-xl mx-auto">
      <form @submit.prevent="handleSubmit">
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

        <div class="flex gap-2">
          <button
              class="bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white px-5 py-2.5 rounded-lg font-semibold shadow cursor-pointer">
            {{ isEditing ? "Yangilash" : "Saqlash" }}
          </button>
          <button
              type="button"
              @click="resetForm"
              class="bg-gray-400 hover:bg-gray-500 transition-colors duration-200 text-white px-5 py-2.5 rounded-lg font-semibold shadow cursor-pointer">
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
          <th class="px-6 py-4 text-left">#</th>
          <th class="px-6 py-4 text-left">Lavozim</th>
          <th class="px-6 py-4 text-left">Ish holati</th>
          <th class="px-6 py-4 text-left">Bo‘lim</th>
          <th class="px-6 py-4 text-left">Amallar</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(job,index) in sortJobs" :key="job.id" class="hover:bg-gray-50 border-t border-gray-200">
          <td class="px-6 py-4">{{ index + 1 }}</td>
          <td class="px-6 py-4">{{ job.positionStatus }}</td>
          <td class="px-6 py-4">{{ job.jobStatus }}</td>
          <td class="px-6 py-4">{{ getDepartmentName(job.departmentId) }}</td>
          <td class="px-6 py-4 flex gap-2">
            <button
                @click="editMessage(job)"
                class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md font-medium shadow-sm cursor-pointer">
              Edit
            </button>
            <button
                @click="confirmDelete(job.id)"
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-medium shadow-sm cursor-pointer">
              Delete
            </button>
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
      <p class="text-lg font-semibold mb-4">Ushbu ish o'nini o'chirmoqchimisiz?</p>
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
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import type {createJob, Department, Job, updateJob} from "@/models/ProjectModels";
import {ApiService} from "@/service/ApiService";
import {useCustomToast} from "@/composables/useCustomToast";
import CDialog from "@/components/CDialog.vue";

const departments = ref<Department[]>([]);
const jobs = ref<Job[]>([]);
const isEditing = ref(false);
const {showToast} = useCustomToast();

const sortJobs = computed(() => {
  return jobs.value.sort((a, b) => a.id - b.id)
})
const positionStatuses = ref<{
  name: string;
  label: string;
}[]>([]);

const form = ref<createJob>({
  departmentId: "",
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
      showToast("Muvaffaqiyatli o'zgartirildi", "success")
    } else {
      await ApiService.createJob(form.value);
      showToast("Muvaffaqiyatli yaratildi", "success")
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
  form.value = {...job};
  isEditing.value = true;
};


const deleteJob = async (id: number) => {
  await ApiService.deleteJob(id);
  await loadJobs();
};

const showDeleteConfirm = ref(false);
const selectedUserId = ref<number | null>(null)

const confirmDelete = (userId: number) => {
  selectedUserId.value = userId;
  showDeleteConfirm.value = true;
}

const handleDeleteConfirmed = async () => {
  if (selectedUserId.value !== null) {
    await deleteJob(selectedUserId.value);
    showDeleteConfirm.value = false;
  }
}
onMounted(() => {
  loadJobs();
  loadDepartments();
  loadPositionStatues()
});
</script>
