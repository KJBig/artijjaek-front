<template>
  <header class="header">
    <h1 class="logo">아티짹</h1>
    <nav class="nav">
      <button class="btn" @click="$emit('open-subscribe')">구독하기</button>
      <button class="btn">요청하기</button>
    </nav>
  </header>
</template>

<script setup lang="ts">
defineEmits<{(e:'open-subscribe'): void}>();
</script>

<style scoped>
.header {
  display:flex; justify-content:space-between; align-items:center;
  height:72px; padding:0 64px;
  background: linear-gradient(135deg, #f9f7f3 0%, #f0ece6 100%);
  border-bottom: 1px solid rgba(0,0,0,.06);
}
.logo{ font-size:22px; font-weight:700; color:#3b332c; }
.nav{ display:flex; gap:12px; }
.btn{
  background:#fff; border:1px solid #d1c6b6; color:#3b332c;
  padding:10px 20px; border-radius:8px; cursor:pointer; font-size:14px;
}
.btn:hover{ background:#f0ebe3; border-color:#bfae99; }
</style>
