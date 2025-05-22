<template>
  <div
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
      >Ish
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
    </div>
    <router-link
        @click="logout"
        to="/login"
        class="py-2 px-3 rounded-sm hover:bg-gray-700 transition duration-200"
    >Tizimdan chiqish
    </router-link>
  </div>
</template>
<script setup lang="ts">
import router from "@/router";

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  router.push("/login");
};
</script>
