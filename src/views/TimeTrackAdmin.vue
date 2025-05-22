<template>
  <div class="p-6 space-y-10 bg-gray-50 min-h-screen">
    <CButton @click="showForm = true" class="my-4 max-w-[192px] mx-auto cursor-pointer flex items-center justify-center"
             text="Yangi vaqt qo‘shish" variant="primary"/>

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
      <p class="text-lg font-semibold mb-4">Ushbu vaqtni o'chirmoqchimisiz?</p>
      <div class="flex justify-center gap-4">
        <button
            @click="handleDeleteConfirmedSettings"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium">
          Ha, o‘chirish
        </button>
        <button
            @click="showDeleteConfirmSetting = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-medium"
        >
          Bekor qilish
        </button>
      </div>
    </CDialog>
    <CDialog
        :show="showDeleteConfirm"
        @close="showDeleteConfirm = false"
        bodyClass="rounded-lg !bg-bg-primary text-center px-4 py-6"
    >
      <p class="text-lg font-semibold mb-4">Ushbu foydalanuvchini o'chirmoqchimisiz?</p>
      <div class="flex justify-center gap-4">
        <button
            @click="handleDeleteConfirmedTrack"
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
      <h2 class="text-2xl font-bold text-green-700 border-b pb-2">Vaqt hisoboti</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-600 font-medium mb-1">Kechikish sababi</label>
          <input
              v-model="createTimeTrack.delayReason"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"/>
        </div>
        <div>
          <label class="block text-gray-600 font-medium mb-1">Tugash sababi</label>
          <input
              v-model="createTimeTrack.endReason"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"/>
        </div>
        <div>
          <label
              class="block text-gray-600 font-medium mb-1">Foydalanuvchi</label>

          <select
              v-model="createTimeTrack.userId"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400">
            <option disabled value="">Foydalanuvchini tanlang</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.firstName }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1"> Sana</label>
          <input
              v-model="createTimeTrack.date"
              type="date"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              required
          >
        </div>
      </div>

      <div class="flex gap-3">
        <button
            @click="submitTimeTrack"
            class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold cursor-pointer">
          {{ isEditing ? "Yangilash" : "Saqlash" }}
        </button>
        <button
            type="button"
            @click="resetTimeTrack"
            class="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg font-semibold cursor-pointer">
          Bekor qilish
        </button>
      </div>

      <div v-if="timeTracks.length" class="mt-6 overflow-x-auto">
        <h3 class="text-xl font-semibold text-gray-800 mb-3">Ishni boshlaganlar ro'yxati</h3>
        <table class="w-full text-sm bg-white border border-gray-200 rounded-xl overflow-hidden">
          <thead class="bg-gray-100 text-gray-700 font-medium text-xs uppercase">
          <tr>
            <th class="px-4 py-3 text-left">#</th>
            <th class="px-4 py-3 text-left">Kechikish sababi</th>
            <th class="px-4 py-3 text-left">Tugatish sababi</th>
            <th class="px-4 py-3 text-left">F.I.O</th>
            <th class="px-4 py-3 text-left">Boshlagan vaqt</th>
            <th class="px-4 py-3 text-left">Kechikgan vaqt</th>
            <th class="px-4 py-3 text-left">Tugatgan vaqt</th>
            <th class="px-4 py-3 text-left">Qachon</th>
            <th class="px-4 py-3 text-left">Amallar</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(track, index) in sortTimeTrack" :key="track?.id" class="hover:bg-gray-50 border-t">
            <td class="px-4 py-3">{{ index + 1 }}</td>
            <td class="px-4 py-3">{{ track.delayReason }}</td>
            <td class="px-4 py-3">{{ track.endReason }}</td>
            <td class="px-4 py-3">{{ getFullName(track.userId) }}</td>
            <td class="px-4 py-3">{{ formatTimeOnly(track.startTime) }}</td>
            <td class="px-4 py-3">{{ getTimeDiff(track) }}</td>
            <td class="px-4 py-3">{{ track.endTime }}</td>
            <td class="px-4 py-3">{{ track.date }}</td>
            <td class="px-4 py-3 flex gap-2">
              <button @click="editTimeTrack(track)"
                      class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md">Edit
              </button>
              <button @click="confirmDelete(track.id)"
                      class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md">Delete
              </button>
            </td>
          </tr>
          </tbody>
        </table>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import type {
  createTimeTrack,
  createTrackSettings,
  TimeTrack,
  TrackSettings,
  updateTimeTrack,
  updateTrackSettings,
  User
} from "@/models/ProjectModels";
import {ApiService} from "@/service/ApiService";
import {useCustomToast} from "@/composables/useCustomToast";
import CDialog from "@/components/CDialog.vue";
import axios from "axios";
import CButton from "@/components/CButton.vue";
import AddTimeSettings from "@/components/AddTimeSettings.vue";

const isEditing = ref(false);
const trackSettings = ref<TrackSettings[]>([])
const {showToast} = useCustomToast();
const showDeleteConfirm = ref(false);
const showDeleteConfirmSetting = ref(false);
const selectedUserId = ref<number | null>(null)
const page = ref(0)
const size = ref(10)
const totalPages = ref(0)
const showForm = ref(false)

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

const editMessageTSettings = (track: updateTrackSettings) => {
  showForm.value = true
  isEditing.value = true
  create.value = {
    ...track
  }
}

const timeTracks = ref<TimeTrack[]>([])

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

const createTimeTrack = ref<createTimeTrack>({
  date: '',
  userId: "",
  startTime: '',
  endTime: '',
  delayReason: '',
  endReason: ''

})

const updateTimeTrack = ref<updateTimeTrack>({
  delayReason: "",
  date: '',
  endReason: "",
  endTime: "",
  startTime: "",
  userId: "",
  id: 0
})

const users = ref<User[]>([])

const loadTimeTrack = async () => {
  try {
    const rest = await ApiService.findAllTimeTracks()
    timeTracks.value = rest.data
  } catch (err) {
    console.log(err)
  }
}

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
    if (isEditing.value && updateTimeTrack.value.id) {
      await ApiService.updateTimeTrack(updateTimeTrack.value.id, updateTimeTrack.value)
      showToast("Muvaffaqiyatli o'zgartirildi", "success")
    } else {
      await ApiService.createReasons(createTimeTrack.value)
      showToast("Muvaffaqiyatli yaratildi", "success")
    }
    await loadTimeTrack()
    resetTimeTrack()
  } catch (err) {
    console.log(err)
  }
}

const editTimeTrack = (timeTrack: updateTimeTrack) => {
  createTimeTrack.value = {...timeTrack}
  isEditing.value = true
}

const deleteTimeTrack = async (id: number) => {
  await ApiService.deleteTimeTrack(id)
  await loadTimeTrack()
}

const resetTimeTrack = () => {
  createTimeTrack.value = {
    userId: 0,
    delayReason: '',
    date: '',
    endReason: ''
  }
  updateTimeTrack.value = {
    userId: 0,
    delayReason: '',
    date: '',
    endReason: '',
    id: 0
  }
  isEditing.value = false
}

const getFullName = (id: number) => {
  const user = users.value?.find(user => user.id === id)
  return user ? `${user.firstName} ${user.lastName} ${user.middleName}` : "Nomalum"
}

const sortTimeTrack = computed(() => {
  return timeTracks.value.sort((a, b) => b.id - a.id)
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

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return "Invalid time";

  let diffMs = start.getTime() - end.getTime();

  if (start > lunchEnd) {
    diffMs -= 1000 * 60 * 60
  }

  if (diffMs < 0) return "";

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  const pad = (n: number) => String(n).padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)} soat ${pad(minutes)} minut`;
  } else {
    return `${pad(minutes)} minut`;
  }
}

const loadTimeTracks = async () => {
  const res = await axios.get('/api/user/time-track', {
    params: {
      page: page.value,
      size: size.value
    }
  })
  timeTracks.value = res.data.content
  totalPages.value = res.data.totalPages
}

const nextPage = () => {
  if (page.value + 1 < totalPages.value) {
    page.value++;
    loadTimeTracks();
  }
}

const prevPage = () => {
  if (page.value > 0) {
    page.value--;
    loadTimeTracks();
  }
}

onMounted(() => {
  loadTrackSettings()
  loadUsers()
  loadTimeTrack()
  // loadTimeTracks()
})
</script>

<style scoped>
</style>
