<template>
  <router-view/>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/authStore";
import {useRouter} from "vue-router";
import {onMounted} from "vue";
import {AuthService} from "@/service/AuthService";

const authStore = useAuthStore();
const router = useRouter(); // Initialize the router

onMounted(async () => {
  try {
    const user = await AuthService.getCurrentUser();
    if (user) {
      authStore.setUser(user);
    } else {
      if (authStore.state.token) {
        authStore.clearUser();
      }
      await router.push('/login');
    }
  } catch (error) {
    console.error('Error in Layout mounted:', error);
    if (authStore.state.token) {
      authStore.clearUser();
    }
    await router.push('/login');
  }
});
</script>