<script setup>
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <div class="flex-grow">
      <RouterView class="flex-col justify-center p-16" />
    </div>
    <Footer />
  </div>
</template>