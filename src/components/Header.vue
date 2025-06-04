<template>
  <div v-if="isAdmin"
      class="fixed top-0 left-0 w-full h-16 px-6 bg-gray-800 text-white flex items-center justify-between z-50 shadow-md">
    <a href="/" class="text-2xl font-semibold whitespace-nowrap">EPG</a>
    <div class="flex items-center space-x-4">
      <router-link
          active-class="bg-gray-700"
          to="/dashboard"
          class="py-2 px-3 rounded-sm hover:bg-gray-700 transition duration-200"
      >Home
      </router-link>
      <router-link
          active-class="bg-gray-700"
          to="/department"
          class="py-2 px-3 rounded-sm hover:bg-gray-700 transition duration-200"
      >Bo'lim
      </router-link>
      <router-link
          active-class="bg-gray-700"
          to="/job"
          class="py-2 px-3 rounded-sm hover:bg-gray-700 transition duration-200"
      >Ish o'rni
      </router-link>
      <router-link
          active-class="bg-gray-700"
          to="/user"
          class="py-2 px-3 rounded-sm hover:bg-gray-700 transition duration-200"
      >Foydalanuvchilar
      </router-link>

      <router-link
          active-class="bg-gray-700"
          to="/admin/time-track"
          class="py-2 px-3 rounded-sm hover:bg-gray-700 transition duration-200"
      >Ish vaqti statistikasi
      </router-link>
      <router-link
          v-if="isAdminAndUser"
          active-class="bg-gray-700"
          to="/time-track"
          class="py-2 px-3 rounded-sm hover:bg-gray-700 transition duration-200"
      >
        Ishni boshlash
      </router-link>
    </div>
    <div class="flex items-center space-x-4 bg-gray-800 px-6 py-3 rounded-xl shadow-md">
      <div class="flex items-center space-x-2 text-white text-lg font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-300" fill="none"
             viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5.121 17.804A10.97 10.97 0 0112 15c2.21 0 4.263.637 5.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span><router-link to="/time-track/user/profile">{{ userName }} </router-link> </span>
      </div>
      <button
          @click="logout"
          class="flex items-center space-x-2 border border-gray-500 cursor-pointer hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
             viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"/>
        </svg>
      </button>
    </div>


  </div>
</template>
<script setup lang="ts">
import router from "@/router";
import {onMounted, ref, computed} from "vue";

const userName = ref("Foydalanuvchi");
const roles = computed(() => {
  const rolesStr = localStorage.getItem("roles") || '';
  return rolesStr.split(',').filter(Boolean);
});

const isAdmin = computed(() => roles.value.includes('ROLE_ADMIN'));
const isAdminAndUser = computed(() => 
  roles.value.includes('ROLE_ADMIN') && roles.value.includes('ROLE_USER')
);

onMounted(() => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userName.value = `${user.firstName} ${user.lastName}`;
    } catch (e) {
      console.error("Foydalanuvchini o'qishda xatolik:", e);
    }
  }
});


const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
  router.push("/login");
};
</script>
