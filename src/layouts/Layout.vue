<template>
  <div class="main">
    <div class="header">
      <Header />
    </div>
    <div class="body">
      <div class="content pt-16">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "../components/Header.vue";
</script>

<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;

  .header {
    width: 100%;
    height: 50px;
    background-color: #322d2d;
    color: white;
  }

  .body {
    width: 100%;
    height: calc(100% - 50px);
    display: flex;

    .content {
      width: 100%;
      height: 100%;
      padding: 16px;
    }
  }
}
</style>
