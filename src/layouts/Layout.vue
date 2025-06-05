<template>
  <div class="w-full h-full flex flex-col bg-white">
    <div class="w-full h-full bg-[#322d2d] text-white">
      <Header />
    </div>
    <div class="flex w-full pt-16">
      <div class="w-full h-full">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import {onMounted} from "vue";
import {useUsersStore} from "@/stores/usersStore";
onMounted(async ()=>{
  await useUsersStore().getUsersWithDetails();
})
</script>
