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
    <DropDown @logout="logout" @profile="profile" :userName="userName"/>


  </div>
</template>
<script setup lang="ts">
import router from "@/router";
import {computed} from "vue";
import DropDown from "@/components/DropDown.vue";
import {useAuthStore} from "@/stores/authStore";

const authStore = useAuthStore()
const roles = computed(() => authStore.state.roles || []);
const userName = computed(() => {
  try {
    const user = authStore.state.user;
    return user ? `${user.firstName} ${user.lastName}`.trim() : "Foydalanuvchi";
  } catch (error) {
    console.error("Foydalanuvchini o'qishda xatolik:", error);
    return "Foydalanuvchi";
  }
});

const isAdmin = computed(() => roles.value.includes('ROLE_ADMIN'));
const isAdminAndUser = computed(() =>
    roles.value.includes('ROLE_ADMIN') && roles.value.includes('ROLE_USER')
);


const logout = () => {
  authStore.clearUser();
  router.push("/login");
};
const profile = () => {
  router.push('/time-track/user/profile')
}
</script>
