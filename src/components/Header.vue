<template>
  <div
      class="fixed top-0 left-0 w-full h-16 px-6 bg-gray-800 text-white flex items-center justify-between z-50 shadow-md">

    <div class="flex items-center space-x-4">
      <router-link
          to="/"
          class="py-2 px-3 rounded-sm hover:bg-gray-700 transition duration-200"
      >Home
      </router-link>

      <router-link
          @click="logout"
          to="/login"
          class="py-2 px-3 rounded-sm hover:bg-gray-700 transition duration-200"
      >Logout
      </router-link>

    </div>
  </div>
</template>
<script setup lang="ts">
import router from "../router";

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>