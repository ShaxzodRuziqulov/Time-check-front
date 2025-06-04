<template>
  <div class="relative inline-block text-left" @click.stop="isOpen = false">
    <!-- Кнопка -->
    <button
        class="inline-flex cursor-pointer w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
        @click.stop="toggleDropdown"
    >
      <span class="flex items-center space-x-2   text-base font-semibold truncate">
        <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor"
             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.121 17.804A10.97 10.97 0 0112 15c2.21 0 4.263.637 5.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
          stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
</svg>
        <span class="truncate">{{ userName }}</span>
        <span class="text-xl">&#8595;</span>
        </span>
    </button>

    <!-- Меню -->
    <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
    >
      <div
          v-if="isOpen"
          class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
      >
        <div class="py-1">
          <a
              class="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
              href="#"
              @click.prevent="emitProfile"
          >
            <img src="/images/svg/userIcon.svg" alt="userIcon" class="w-5 h-5">
            <span class="text-lg">Profile</span>
          </a>

          <a
              class="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
              href="#"
              @click.prevent="emitLogout"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </svg>
            <span class="text-lg">Chiqish</span>
          </a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref} from 'vue';

defineProps({
  userName: {
    type: String,
    default: 'user',
  }
});

const emit = defineEmits(['profile', 'logout']);
const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const emitProfile = () => {
  emit('profile');
  isOpen.value = false;
};

const emitLogout = () => {
  emit('logout');
  isOpen.value = false;
};

// Вспомогательная директива: клик вне элемента
function handleClickOutside(event) {
  if (!event.target.closest('.dropdown-wrapper')) {
    isOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener('click', event => handleClickOutside(event));
});

onBeforeUnmount(() => {
  window.removeEventListener('click', event => handleClickOutside(event));
});
</script>
