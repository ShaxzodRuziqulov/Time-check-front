<template>
  <ul v-if="items?.length > 1" class="pagination flex-y-center gap-2">
    <li
      v-if="paginationButtons"
      :class="`${itemClass} ${hasFirst ? 'pointer-events-none' : ''}`"
      class="group cursor-pointer"
      @click="prev"
    >
      <button :disabled="hasFirst">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14.4685 6.41438C14.7919 6.67313 14.8444 7.1451 14.5856 7.46855L10.9604 12L14.5856 16.5315C14.8444 16.855 14.7919 17.3269 14.4685 17.5857C14.145 17.8444 13.6731 17.792 13.4143 17.4685L9.41432 12.4685C9.19519 12.1946 9.19519 11.8054 9.41432 11.5315L13.4143 6.53151C13.6731 6.20806 14.145 6.15562 14.4685 6.41438Z"
            fill="#190A35"
            :class="{ 'fill-[#A8ABB2]': hasFirst }"
          />
        </svg>
      </button>
    </li>
    <li
      v-for="page in items"
      :key="page.label"
      class="transition-300 transition"
      :class="`${itemClass} ${page.active ? activeClass : ''} ${
        page.disable ? disableClass : ''
      }`"
    >
      <span v-if="page.disable" class="w-full h-full flex-center"> ... </span>
      <button v-else class="w-full h-full" @click="goto(page.label)">
        {{ page.label }}
      </button>
    </li>
    <li
      v-if="paginationButtons"
      :class="`${itemClass} ${hasLast ? disableClass : ''}`"
      class="group cursor-pointer"
      @click="next"
    >
      <button :class="{ 'pointer-events-none': hasLast }" :disabled="hasLast">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.53151 6.41438C9.20806 6.67313 9.15562 7.1451 9.41438 7.46855L13.0396 12L9.41438 16.5315C9.15562 16.855 9.20806 17.3269 9.53151 17.5857C9.85495 17.8444 10.3269 17.792 10.5857 17.4685L14.5857 12.4685C14.8048 12.1946 14.8048 11.8054 14.5857 11.5315L10.5857 6.53151C10.3269 6.20806 9.85495 6.15562 9.53151 6.41438Z"
            fill="#190A35"
            :class="{ 'fill-[#A8ABB2]': hasLast }"
          />
        </svg>
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import {computed, onMounted, watch} from "vue";

interface Props {
  currentPage: number
  total: number
  limit: number
  itemClass?: string
  activeClass?: string
  disableClass?: string
  paginationButtons?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  itemClass:
    'w-10 h-10 flex-center rounded-xl text-gray-100 text-base leading-130  font-bold border border-[#190A3533] bg-white transition-300 hover:bg-white hover:text-dark hover:border-green',
  activeClass: '!bg-[#D6D2DB] !border-[#190A351F] !text-dark',
  disableClass: 'pointer-events-none',
})
const emit = defineEmits(['change', 'input'])

const pageCount = computed(() => Math.ceil(props.total / props.limit))

const items = computed(() => {
  const valPrev = props.currentPage > 1 ? props.currentPage - 1 : 1 // for easier navigation - gives one previous page
  const valNext =
    props.currentPage < pageCount.value
      ? props.currentPage + 1
      : pageCount.value // one next page
  const extraPrev = valPrev === 3 ? 2 : null
  const extraNext = valNext === pageCount.value - 2 ? pageCount.value - 1 : null
  const dotsBefore = valPrev > 3 ? 2 : null
  const dotsAfter = valNext < pageCount.value - 2 ? pageCount.value - 1 : null
  const output = []
  for (let i = 1; i <= pageCount.value; i += 1) {
    if (
      [
        1,
        pageCount.value,
        props.currentPage,
        valPrev,
        valNext,
        extraPrev,
        extraNext,
        dotsBefore,
        dotsAfter,
      ].includes(i)
    ) {
      output.push({
        label: i,
        active: props.currentPage === i,
        disable: [dotsBefore, dotsAfter].includes(i),
      })
    }
  }
  return output
})
const hasFirst = computed(() => props.currentPage === 1)
const hasLast = computed(() => props.currentPage === pageCount.value)
watch(
  () => props.currentPage,
  () => {
    emit('change')
  }
)


function first() {
  if (!hasFirst.value) {
    emit('input', 1)
  }
}
function prev() {
  if (!hasFirst.value) {
    emit('input', props.currentPage - 1)
  }
}
function goto(page: number) {
  emit('input', page)
}
function next() {
  if (!hasLast.value) {
    emit('input', props.currentPage + 1)
  }
}
function last() {
  if (!hasLast.value) {
    emit('input', pageCount.value)
  }
}
onMounted(() => {
  if (props.currentPage > pageCount.value) {
    emit('change')
  }
})
</script>
