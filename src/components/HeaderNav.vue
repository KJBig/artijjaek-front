<template>
  <header class="header">
    <h1 class="logo">아티짹</h1>
    <nav class="nav">
      <button class="btn">구독하기</button>
      <button class="btn">요청하기</button>
    </nav>
  </header>
</template>

<script setup lang="ts"></script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 72px;
  padding: 0 64px;
  background: #f5f0E8;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.logo {
  font-size: 22px;
  font-weight: 700;
  color: #3c3c3c; /* 부드러운 짙은 회색 */
}

.nav {
  display: flex;
  gap: 12px;
}

/* 버튼 */
.btn {
  background: #ffffff;
  border: 1px solid #d1c6b6;
  color: #3c3c3c;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  transition: 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn:hover {
  background-color: #f0ebe3;
  border-color: #bfae99;
}
</style>
