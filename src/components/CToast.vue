<template>
  <div
      :class="typeStatus"
      class="relative p-4 rounded-md flex items-center justify-between max-w-[343px]"
  >
    <div class="flex items-center justify-between">
      <img class="w-6 h-6" :src="images[type]" alt="icon" />
      <div class="ml-2">
        <p class="text-black font-bold">
          {{ title }}
        </p>
      </div>
    </div>
    <img @click="closeToast" class="cursor-pointer" src="/images/svg/close.svg" alt="Close-icon">
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import {useToast} from "vue-toastification";

interface Props {
  type: "success" | "error" | "warning" | "info";
  title: string;
  toastId?: string | number;
}

const props = defineProps<Props>();
const images = computed(() => {
  return {
    success: "/images/svg/success.svg",
    error: "/images/svg/rejected.svg",
    warning: "/images/svg/warning.svg",
    info: "/images/svg/info.svg",
  };
});

const toast = useToast();

function closeToast() {
  if (props.toastId !== undefined) {
    toast.dismiss(props.toastId);
  }
}

const typeStatus = computed(() => {
  switch (props.type) {
    case "success":
      return "bg-[#E6F6EE]";
    case "error":
      return "bg-[#FFE0E0]";
    case "warning":
      return "bg-[#FCF0CF]";
    case "info":
      return "bg-[#F0F2F5]";
    default:
      return "bg-[#F0F2F5]";
  }
});
</script>
<style>
.toast {
  box-shadow: 0 8px 20px rgba(18, 28, 37, 0.16);
}
</style>
