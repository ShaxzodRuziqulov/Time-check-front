<template>
  <div class="p-6 space-y-10 bg-gray-50 min-h-screen">
    <CButton
        @click="showForm = true"
        v-if="!trackSettings.length"
        class="max-w-[192px] mx-auto cursor-pointer flex items-center justify-center"
        text="Ish rejimini boshqarish"
        variant="primary"
    />
    <CDialog
        has-close-icon
        no-header
        :show="showForm"
        @close="closeDialog"
        bodyClass="rounded-lg !bg-bg-primary"
    >
      <AddTimeSettings
          v-model="create"
          :is-editing="isEditing"
          @submit="submitTrackSettings"
          @reset="isResetMessage"
      />
    </CDialog>

    <CDialog
        :show="showDeleteConfirmSetting"
        @close="showDeleteConfirmSetting = false"
        bodyClass="rounded-lg !bg-bg-primary text-center px-4 py-6"
    >
      <DeleteConfirm
          v-model:show="showDeleteConfirmSetting"
          title="Ushbu vaqtni o'chirmoqchimisiz?"
          @confirm="handleDeleteConfirmedSettings"
      />
    </CDialog>
    <CDialog
        :show="showDeleteConfirm"
        @close="showDeleteConfirm = false"
        bodyClass="rounded-lg !bg-bg-primary text-center px-4 py-6"
    >
      <DeleteConfirm
          v-model:show="showDeleteConfirm"
          title="Ushbu foydalanuvchini o'chirmoqchimisiz?"
          @confirm="handleDeleteConfirmedTrack"
      />
    </CDialog>
    <!-- Track Settings Card -->

    <div v-if="trackSettings.length" class="mt-6 overflow-x-auto">
      <h3 class="text-xl font-semibold text-gray-800 mb-3">Boshqaruv vaqt ro'yxati</h3>
      <table class="w-full text-sm bg-white border border-gray-200 rounded-xl overflow-hidden">
        <thead class="bg-gray-100 text-gray-700 font-medium text-xs uppercase">
        <tr>
          <th class="px-4 py-3 text-left">#</th>
          <th class="px-4 py-3 text-left">Vaqtdan boshlab</th>
          <th class="px-4 py-3 text-left">Vaqtgacha</th>
          <th class="px-4 py-3 text-left">Holat</th>
          <th class="px-4 py-3 text-left">Amallar</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(track,index) in trackSettings" :key="track.id" class="hover:bg-gray-50 border-t">
          <td class="px-4 py-3">{{ index + 1 }}</td>
          <td class="px-4 py-3">{{ track.fromTime }}</td>
          <td class="px-4 py-3">{{ track.toTime }}</td>
          <td class="px-4 py-3">{{ track.trackSettingsStatus }}</td>
          <td class="px-4 py-3 flex gap-2">
            <button @click="editMessageTSettings(track)"
                    class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md cursor-pointer">Edit
            </button>
            <button @click="confirmDeleteSettings(track.id)"
                    class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md cursor-pointer">Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <!-- Time Track Card -->
    <div class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <CButton
          @click="showFormTime = true"
          class="max-w-max mx-auto cursor-pointer flex items-center justify-center"
          text="Xodimlarning kechikish sabablarini boshqarish"
          variant="primary"
      />
      <CDialog
          has-close-icon
          no-header
          :show="showFormTime"
          @close="closeDialogTime"
          bodyClass="rounded-lg !bg-bg-primary"
      >
        <AddTimeTrack
            v-model="timeTrackForm"
            :is-editing="isEditing"
            :users="users"
            @submit="submitTimeTrack"
            @reset="isResetMessageTime"
        />
      </CDialog>

      <div class="mt-6 overflow-x-auto">
        <!-- Filters -->
        <div class="bg-white p-4 rounded-xl shadow mb-6">
          <h2 class="text-xl font-semibold mb-4">Filterlar</h2>
          <div
              class="flex items-center justify-between gap-3 max-w-[860px]">

            <select class="p-2 border rounded w-full cursor-pointer" v-model.number="selectedDepartmentId">
              <option disabled :value="null">Bo'limni tanlang</option>
              <option :value="null">Hamma bo'lim</option>
              <option v-for="department in departments" :key="department.id" :value="department.id">
                {{ department.name }}
              </option>
            </select>

            <input type="date"
                   v-model="dateFrom"
                   class="p-2 border rounded w-full"
                   placeholder="Boshlanish sanasi">

            <input type="date"
                   v-model="dateTo"
                   class="p-2 border rounded w-full"
                   placeholder="Tugash sanasi">
            <button
                @click="clearFilters"
                class="bg-red-400 hover:bg-red-500 text-white px-5 py-2 rounded-lg font-semibold cursor-pointer mt-1">
              Tozalash
            </button>
          </div>
        </div>

        <template v-if="timeTracks?.length && timeTracks?.length > 0">
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Ishni boshlaganlar ro'yxati</h3>


          <table class="w-full table-fixed text-sm bg-white border border-gray-200 rounded-xl overflow-hidden">
            <thead class="bg-gray-100 text-gray-700 font-medium text-xs uppercase">
            <tr>
              <th class="px-4 py-3 text-left w-5">#</th>
              <th class="px-4 py-3 text-left">F.I.O</th>
              <th class="px-4 py-3 text-left">Bo'lim</th>
              <th class="px-4 py-3 text-left">Boshlagan vaqt</th>
              <th class="px-4 py-3 text-left">Kechikgan vaqt</th>
              <th class="px-4 py-3 text-left">Tugatgan vaqt</th>
              <th class="px-4 py-3 text-left">Qachon</th>
              <th class="px-4 py-3 text-left w-[300px] max-w-[300px]">Kechikish sababi</th>
              <th class="px-4 py-3 text-left">Tugatish sababi</th>
              <th class="px-4 py-3 text-left">Amallar</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(track, index) in sortTimeTrack" :key="track?.id" class="hover:bg-gray-50 border-t">
              <td class="px-4 py-3 w-5">{{ index + 1 }}</td>
              <td class="px-4 py-3">{{ getFullName(track) }}</td>
              <td class="px-4 py-3">{{ track?.user?.job?.department?.name }}</td>
              <td class="px-4 py-3">{{ formatTimeOnly(track.startTime) }}</td>
              <td class="px-4 py-3">{{ getTimeDiff(track) }}</td>
              <td class="px-4 py-3">{{ formatTimeOnly(track.endTime) }}</td>
              <td class="px-4 py-3">{{ track.date }}</td>
              <td class="px-4 py-3 w-[300px] max-w-[30px]">{{ track.delayReason }}</td>
              <td class="px-4 py-3">{{ track.endReason }}</td>
              <td class="px-4 py-3 flex gap-2">
                <button @click="editTimeTrack(track)"
                        class="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white px-3 py-1 rounded-md">Edit
                </button>
                <button @click="confirmDelete(track.id)"
                        class="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-3 py-1 rounded-md">Delete
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </template>
        <div v-if="isEmptyState" class="text-center">
          {{ emptyMessage }}
        </div>

        <div v-if="totalCount && totalCount >= 10" class="flex justify-end items-center mt-6 space-x-4">
          <button
              @click="prevPage"
              :disabled="currentPage === 0"
              class="flex items-center gap-1 px-4 py-2 rounded-lg transition duration-200 text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⬅ Oldingi
          </button>
          <span class="text-gray-600 text-sm">Sahifa: {{ currentPage + 1 }} / {{ totalPages }}</span>
          <button
              @click="nextPage"
              :disabled="currentPage >= totalPages - 1"
              class="flex items-center gap-1 px-4 py-2 rounded-lg transition duration-200 text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Keyingi ➡
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import type {
  createTrackSettings, Department,
  TimeTrack,
  TrackSettings,
  updateTimeTrack,
  updateTrackSettings,
  User
} from "@/models/ProjectModels";
import {ApiService} from "@/service/ApiService";
import {useCustomToast} from "@/composables/useCustomToast";
import CDialog from "@/components/CDialog.vue";
import CButton from "@/components/CButton.vue";
import AddTimeSettings from "@/components/AddTimeSettings.vue";
import AddTimeTrack from "@/components/AddTimeTrack.vue";
import DeleteConfirm from "@/components/DeleteConfirm.vue";

const isEditing = ref(false);
const trackSettings = ref<TrackSettings[]>([])
const {showToast} = useCustomToast();
const showDeleteConfirm = ref(false);
const showDeleteConfirmSetting = ref(false);
const selectedUserId = ref<number | null>(null);

const totalPages = ref(0)
const totalCount = ref(0)
const showForm = ref(false)
const showFormTime = ref(false)
const selectedDepartmentId = ref<number | null>(null)
const dateFrom = ref<string>('')
const dateTo = ref<string>('');

const departments = ref<Department[]>([])

const create = ref<createTrackSettings>({
  fromTime: '',
  toTime: '',
  trackSettingsStatus: ''
})

const update = ref<updateTrackSettings>({
  fromTime: '',
  toTime: '',
  trackSettingsStatus: '',
  id: 0
})

const closeDialog = () => {
  resetMessage()
}

const isEmptyState = computed(() => {
  return !!emptyMessage.value;
})

const emptyMessage = computed(() => {
  if (!timeTracks.value?.length) {
    return "Foydalanuvchi topilmadi";
  }
})


const submitTrackSettings = async () => {
  try {
    if (isEditing.value && update.value.id) {
      await ApiService.updateTrackSettings(update.value.id, create.value)
      showToast("Muvaffaqiyatli o'zgartirildi", "success")
    } else {
      await ApiService.createTrackSettings(create.value)
      showToast("Muvaffaqiyatli yaratildi", "success")
    }
    resetMessage()
    showForm.value = false
    await loadTrackSettings()
  } catch (error) {
    console.error('Server error:', error)
  }
}

const loadTrackSettings = async () => {
  try {
    const rest = await ApiService.getActiveTrackSettings()
    trackSettings.value = rest.data
  } catch (err) {
    console.log(err)
  }
}

const loadDepartment = async () => {
  try {
    const rest = await ApiService.getAllDepartments()
    departments.value = rest.data
  } catch (err) {
    console.log(err)
  }
}
const editMessageTSettings = (track: updateTrackSettings) => {
  showForm.value = true
  isEditing.value = true
  create.value = {
    ...track
  }
}

const isResetMessage = () => {
  create.value = {
    fromTime: '',
    toTime: '',
    trackSettingsStatus: ''
  }
}

const resetMessage = () => {
  create.value = {
    fromTime: '',
    toTime: '',
    trackSettingsStatus: ''
  }

  update.value = {
    fromTime: '',
    toTime: '',
    trackSettingsStatus: '',
    id: 0
  }
  isEditing.value = false
  showForm.value = false
}

const deleteTrackSettings = async (id: number) => {
  try {
    await ApiService.deleteActiveTrackSettings(id)
    await loadTrackSettings()
  } catch (err) {
    console.log(err)
  }
}

const confirmDeleteSettings = (userId: number) => {
  selectedUserId.value = userId
  showDeleteConfirmSetting.value = true
}

const confirmDelete = (userId: number) => {
  selectedUserId.value = userId
  showDeleteConfirm.value = true
}

const handleDeleteConfirmedSettings = async () => {
  if (selectedUserId.value !== null) {
    await deleteTrackSettings(selectedUserId.value)
    showDeleteConfirmSetting.value = false
  }
}

const handleDeleteConfirmedTrack = async () => {
  if (selectedUserId.value !== null) {
    await deleteTimeTrack(selectedUserId.value)
    showDeleteConfirm.value = false
  }
}

// timeTrack

const timeTracks = ref<TimeTrack[]>([])

const timeTrackForm = ref<Partial<updateTimeTrack>>({
  date: '',
  userId: '',
  startTime: '',
  endTime: '',
  delayReason: '',
  endReason: '',
})

const users = ref<User[]>([])

const loadUsers = async () => {
  try {
    const rest = await ApiService.getAllUsers()
    users.value = rest.data
  } catch (err) {
    console.log(err)
  }
}

const submitTimeTrack = async () => {
  try {
    if (!timeTrackForm.value.userId) {
      showToast("Foydalanuvchini tanlang", "info")
      return
    }
    if (isEditing.value && timeTrackForm?.value?.id !== undefined) {
      await ApiService.updateTimeTrack(timeTrackForm.value.id, timeTrackForm.value)
      showToast("Muvaffaqiyatli o'zgartirildi", "success")
    } else {
      await ApiService.createReasons(timeTrackForm.value)
      showToast("Muvaffaqiyatli yaratildi", "success")
    }
    await loadTimeTrackPagination()
    resetTimeTrack()
    showFormTime.value = false;
  } catch (error) {
    console.log(error)
  }
}
const closeDialogTime = () => {
  resetTimeTrack()
}
const editTimeTrack = (timeTrack: updateTimeTrack) => {
  timeTrackForm.value = {
    date: timeTrack.date,
    userId: timeTrack.user?.id || "",
    startTime: timeTrack.startTime || '',
    endTime: timeTrack.endTime || '',
    delayReason: timeTrack.delayReason || '',
    endReason: timeTrack.endReason || '',
    id: timeTrack.id || undefined,
  }
  isEditing.value = true
  showFormTime.value = true
}

const deleteTimeTrack = async (id: number) => {
  await ApiService.deleteTimeTrack(id)
  await loadTimeTrackPagination()
}

const resetTimeTrack = () => {
  timeTrackForm.value = {
    date: '',
    userId: '',
    startTime: '',
    endTime: '',
    delayReason: '',
    endReason: '',
    id: undefined
  }
  isEditing.value = false
  showFormTime.value = false;

}

const isResetMessageTime = () => {
  timeTrackForm.value = {
    date: '',
    userId: '',
    startTime: '',
    endTime: '',
    delayReason: '',
    endReason: '',
    id: undefined
  }
}

const getFullName = (item: any): string => {
  if (!item) return "Nomalum";
  const parts = [item?.user?.lastName, item?.user?.firstName, item?.user?.middleName].filter(Boolean);
  return parts.join(' ');
};

const sortTimeTrack = computed(() => {
  return (timeTracks.value || [])
      .slice()
      .sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();

        if (isNaN(timeA) || isNaN(timeB)) return 0;

        return timeB - timeA;
      });
});

watch([selectedDepartmentId, dateFrom, dateTo], () => {
  currentPage.value = 0
  loadTimeTrackPagination()
})

function formatTimeOnly(time?: string): string {
  if (!time) return "";
  return time.split(':').slice(0, 2).join(':');
}

function getTimeDiff(item: any) {
  if (item?.delayReason) return "";

  const startTime = `1970-01-01T${item?.startTime}`;
  const endTime = `1970-01-01T${trackSettings.value[0]?.toTime}`;

  const start = new Date(startTime);
  const end = new Date(endTime);

  const lunchEnd = new Date("1970-01-01T14:00");

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return "";

  let diffMs = start.getTime() - end.getTime();

  if (start > lunchEnd) {
    diffMs -= 1000 * 60 * 60;
  }

  if (diffMs < 0) return "";
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0) {
    return `${minutes} daqiqa`;
  }
  return `${hours} soat ${minutes} daqiqa`;
}

const currentPage = ref(0)
const pageSize = (10)

const loadTimeTrackPagination = async () => {
  try {
    const filter = {
      departmentId: selectedDepartmentId.value || undefined,
      fromDate: dateFrom.value || undefined,
      toDate: dateTo.value || undefined
    };

    const response = await ApiService.pagination(
        currentPage.value,
        pageSize,
        filter
    );

    const data = response.data;

    timeTracks.value = data.content;
    totalCount.value = data.totalElements;
    totalPages.value = data.totalPages;

  } catch (err) {
    console.error('❌ Error loading time tracks:', err);
  }
};


const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    loadTimeTrackPagination();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    loadTimeTrackPagination();
  }
};

const clearFilters = () => {
  selectedDepartmentId.value = null;
  dateFrom.value = '';
  dateTo.value = '';
};

onMounted(() => {
  loadTrackSettings()
  loadUsers()
  loadTimeTrackPagination()
  loadDepartment()
})
</script>
