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
</script>
