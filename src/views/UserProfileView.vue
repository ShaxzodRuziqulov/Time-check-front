<template>
  <div class="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
    <h2 class="text-2xl font-semibold mb-6">Foydalanuvchi profili</h2>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium">Ism</label>
        <input
            v-model="form.firstName"
            type="text"
            class="w-full border rounded px-3 py-2"
            placeholder="Ismingizni kiriting"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Familiya</label>
        <input
            v-model="form.lastName"
            type="text"
            class="w-full border rounded px-3 py-2"
            placeholder="Familiyangizni kiriting"
        />
      </div>
      <div>
        <label class="block text-sm font-medium">Sharif</label>
        <input
            v-model="form.middleName"
            type="text"
            class="w-full border rounded px-3 py-2"
            placeholder="Sharifingizni kiriting"
        />
      </div>
      <div>
        <label class="block text-sm font-medium">Tug'ilgan sana</label>
        <input
            v-model="form.birthDate"
            type="date"
            class="w-full border rounded px-3 py-2"
            placeholder="Tug'ilgan sana kiriting"
        />
      </div>
    </div>

    <div  class="flex justify-end gap-3 mt-6">
      <button
          @click="cancelEdit"
          class="bg-gray-300 cursor-pointer hover:bg-gray-400 text-black font-medium py-2 px-4 rounded"
      >
        Bekor qilish
      </button>
      <button
          @click="saveChanges"
          class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          :disabled="!hasChanges"
          :class="{ 'opacity-50 cursor-not-allowed pointer-events-none': !hasChanges }"
      >
        Yangilash
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, Ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { IUser } from "@/types/interfaces/IUser";
import { useCustomToast } from "@/composables/useCustomToast";
import axiosInstance from "@/axios";
const router = useRouter();

interface IFormData {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
}

const originalData = ref({}) as Ref<IFormData>;
const isLoading: Ref<boolean> = ref(false);
const { showToast } = useCustomToast()


const form = reactive<IFormData>({
  id: 0,
  firstName: "",
  lastName: "",
  middleName: "",
  birthDate: "",
});

const userId: number = Number(localStorage.getItem("userId"));

const getUsers = computed(() => {
    return JSON.parse(localStorage.getItem("users") || "[]");
});

const user = computed<IUser | null>(() => {
  return getUsers.value.find((user: IUser) => user?.userId === userId) || null;
});
console.log(user.value)


onMounted(() => {
  if (!user.value) {
    showToast('Foydalanuvchi topilmadi', 'error')
    return;
  }
  form.id = user.value.id || 0;
  form.firstName = user.value.firstName || "";
  form.lastName = user.value.lastName || "";
  form.middleName = user.value.middleName || "";
  form.birthDate = user.value.birthDate || "";
  originalData.value = { ...form };
  isLoading.value = false;
});

const hasChanges = computed(() => {
  return (
      form.firstName !== originalData.value.firstName ||
      form.lastName !== originalData.value.lastName ||
      form.middleName !== originalData.value.middleName ||
      form.birthDate !== originalData.value.birthDate
  );
});

async function saveChanges() {
  if (!user.value) return;

  try {
    console.log("Отправляемые данные:", form, user.value.id);

    await axiosInstance.put(`/api/user/update-profile/${user.value.id}`, form);
    showToast("Ma'lumotlar yangilandi ✅", "success");
    const updatedUsers = getUsers.value.map((user: IUser) =>
        user.id === userId ? { ...user, ...form } : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    originalData.value = { ...form };
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
    showToast("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.", "error");
  }
}


function cancelEdit() {
  router.go(-1);
}
</script>
