<script setup lang="ts">
import { ref } from "vue";
import HeaderNav from "./components/HeaderNav.vue";
import FooterBar from "./components/FooterBar.vue";

const showSubscribe = ref(false);
</script>

<template>
  <div class="app">
    <!-- 헤더: 구독 버튼 누르면 모달 열림 -->
    <header-nav @open-subscribe="showSubscribe = true"></header-nav>
    <router-view @open-subscribe="showSubscribe = true"></router-view>
    <footer-bar></footer-bar>
  </div>
</template>

<style>
</style>
