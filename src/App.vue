<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div style="font-family: 'Poppins', sans-serif;">
    <RouterView />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Poppins', sans-serif;
}
</style>