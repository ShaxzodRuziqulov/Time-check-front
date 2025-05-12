<template>
  <div class="p-6 space-y-10 bg-gray-50 min-h-screen">

    <!-- Track Settings Card -->
    <div class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <h2 class="text-2xl font-bold text-blue-700 border-b pb-2">Track Settings</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-600 font-medium mb-1">Vaqtdan</label>
          <input
              v-model="create.fromTime"
              type="time"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"/>
        </div>

        <div>
          <label class="block text-gray-600 font-medium mb-1">Vaqtgacha</label>
          <input
              v-model="create.toTime"
              type="time"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"/>
        </div>

        <div>
          <label class="block text-gray-600 font-medium mb-1">Status</label>
          <select
              v-model="create.trackSettingsStatus"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400">
            <option disabled value="">Tanlang</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      <div class="flex gap-3">
        <button
            @click="submitTrackSettings"
            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold">
          {{ isEditing ? "Yangilash" : "Saqlash" }}
        </button>
        <button
            type="button"
            @click="resetMessage"
            class="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg font-semibold">
          Bekor qilish
        </button>
      </div>

      <div v-if="trackSettings.length" class="mt-6 overflow-x-auto">
        <h3 class="text-xl font-semibold text-gray-800 mb-3">Ishlar ro'yxati</h3>
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
                      class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md">Edit
              </button>
              <button @click="deleteTrackSettings(track.id)"
                      class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md">Delete
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Time Track Card -->
    <div class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <h2 class="text-2xl font-bold text-green-700 border-b pb-2">Time Track</h2>
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
          <label class="block text-gray-600 font-medium mb-1">Foydalanuvchi</label>
          <input
              v-model="createTimeTrack.userId"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"/>
        </div>
      </div>

      <div class="flex gap-3">
        <button
            @click="submitTimeTrack"
            class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold">
          {{ isEditing ? "Yangilash" : "Saqlash" }}
        </button>
        <button
            type="button"
            @click="resetTimeTrack"
            class="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg font-semibold">
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
            <th class="px-4 py-3 text-left">Ism</th>
            <th class="px-4 py-3 text-left">Familiya</th>
            <th class="px-4 py-3 text-left">Ota ismi</th>
            <th class="px-4 py-3 text-left">Boshlagan vaqt</th>
            <th class="px-4 py-3 text-left">Tugatgan vaqt</th>
            <th class="px-4 py-3 text-left">Amallar</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(track,index) in timeTracks" :key="track.id" class="hover:bg-gray-50 border-t">
            <td class="px-4 py-3">{{ index + 1 }}</td>
            <td class="px-4 py-3">{{ track.delayReason }}</td>
            <td class="px-4 py-3">{{ track.endReason }}</td>
            <td class="px-4 py-3">{{ getUserName(track.userId) }}</td>
            <td class="px-4 py-3">{{ getLastName(track.userId) }}</td>
            <td class="px-4 py-3">{{ getMiddleName(track.userId) }}</td>
            <td class="px-4 py-3">{{ track.startTime }}</td>
            <td class="px-4 py-3">{{ track.endTime }}</td>
            <td class="px-4 py-3 flex gap-2">
              <button @click="editTimeTrack(track)"
                      class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md">Edit
              </button>
              <button @click="deleteTimeTrack(track.id)"
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
import {onMounted, ref} from 'vue'
import type {
  createTimeTrack,
  createTrackSettings,
  TimeTrack,
  TrackSettings,
  updateTimeTrack,
  updateTrackSettings,
  User
} from "../models/ProjectModels.ts";
import {ApiService} from "../service/ApiService.ts";

const isEditing = ref(false);
const trackSettings = ref<TrackSettings[]>([])

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

const submitTrackSettings = async () => {
  try {
    if (isEditing.value && update.value.id) {
      await ApiService.updateTrackSettings(update.value.id, create.value)
    } else {
      await ApiService.createTrackSettings(create.value)
    }
    await loadTrackSettings()
    resetMessage()
  } catch (err) {
    console.log(err)
  }
}

const loadTrackSettings = async () => {
  try {
    const rest = await ApiService.getActiveTrackSettings()
    trackSettings.value = rest.data
    console.log(rest.data)
  } catch (err) {
    console.log(err)
  }
}

const editMessageTSettings = (track: updateTrackSettings) => {
  create.value = {
    ...track
  }
  isEditing.value = true
}

const timeTracks = ref<TimeTrack[]>([])
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
}

const deleteTrackSettings = async (id: number) => {
  try {
    if (confirm(`Are you sure you want to delete?`)) {
      await ApiService.deleteActiveTrackSettings(id)
      await loadTrackSettings()
    }
  } catch (err) {
    console.log(err)
  }
}

const createTimeTrack = ref<createTimeTrack>({
  userId: 0,
  startTime: '',
  endTime: '',
  delayReason: '',
  endReason: ''
})

const updateTimeTrack = ref<updateTimeTrack>({
  delayReason: "",
  endReason: "",
  endTime: "",
  startTime: "",
  userId: 0,
  id: 0
})

const users = ref<User[]>([])

const loadTimeTrack = async () => {
  try {
    const rest = await ApiService.findAllTimeTracks()
    timeTracks.value = rest.data
    console.log(rest.data)
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
  console.log('TimeTrack:', createTimeTrack.value)
  try {
    if (isEditing.value && updateTimeTrack.value.id) {
      await ApiService.updateTimeTrack(updateTimeTrack.value.id, updateTimeTrack.value)
    } else {
      await ApiService.createTimeTrack(createTimeTrack.value)
    }
    await loadTimeTrack()
    resetTimeTrack()
  } catch (err) {
    console.log(err)
  }
}

const editTimeTrack = (timeTrack: updateTimeTrack) => {
  createTimeTrack.value = {...timeTrack}
  updateTimeTrack.value = {...timeTrack}
  isEditing.value = true
}

const deleteTimeTrack = async (id: number) => {
  if (confirm(`Are you sure you want to delete?`)) {
    await ApiService.deleteTimeTrack(id)
    await loadTimeTrack()
  }
}

const resetTimeTrack = () => {
  createTimeTrack.value = {
    userId: 0,
    delayReason: '',
    endReason: ''
  }
  updateTimeTrack.value = {
    userId: 0,
    delayReason: '',
    endReason: '',
    id: 0
  }
  isEditing.value = false
}

const getUserName = (id: number) => {
  const user = users.value.find(user => user.id === id)
  return user ? user.firstName : "Nomalum"
}

const getLastName = (id: number) => {
  const user = users.value.find(user => user.id === id)
  return user ? user.lastName : "Nomalum"
}

const getMiddleName = (id: number) => {
  const user = users.value.find(user => user.id === id)
  return user ? user.middleName : "Nomalum"
}
onMounted(() => {
  loadTrackSettings()
  loadUsers()
  loadTimeTrack()
})
</script>

<style scoped>
</style>
