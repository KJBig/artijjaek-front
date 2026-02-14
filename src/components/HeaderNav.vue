<template>
  <header class="header">
    <h1 class="logo" aria-label="아티짹">
      <button class="logo-btn" @click="goHome">
        <img src="/main_logo.png" alt="아티짹 로고" class="logo-img" />
        <span class="logo-text">아티짹</span>
      </button>
    </h1>

    <nav class="nav" aria-label="헤더 내비게이션">
      <!-- Primary -->
      <button class="btn btn-primary" @click="goRegister">구독하기</button>
      <button class="btn btn-ghost" @click="goCompanyList">지원하는 회사 리스트</button>
      <!-- Ghost / Outline -->
      <button class="btn btn-ghost" @click="goInquiry">문의하기</button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const goRegister = () => router.push('/register');
const goHome = () => router.push('/');
const goCompanyList = () => router.push('/companies');

/**
 * ✅ 요청하기 버튼 클릭 시 /inquiry 페이지로 이동
 */
const goInquiry = () => {
  router.push('/inquiry');
};
</script>

<style scoped>
.header{
  position: sticky;
  top: 0;
  z-index: 3000;
  display:flex; justify-content:space-between; align-items:center;
  height:72px; padding:0 64px;
  background: rgba(255,255,255,0.86);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(118, 82, 201, 0.18);
}

.logo { display:flex; align-items:center; }
.logo-btn {
  appearance: none;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-img {
  height: 30px;
  width: auto;
  display: block;
  transform: translateY(1px);
}

.logo-btn:focus-visible{
  outline: none;
  box-shadow: 0 0 0 3px rgba(118,82,201,.22);
  border-radius: 8px;
}

.logo-text {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: .2px;
  line-height: 1;
  background: linear-gradient(135deg, #6675E0 0%, #7652C9 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.nav{ display:flex; gap:12px; }

.btn{
  font-size:14px; font-weight:700; cursor:pointer;
  border-radius:10px; padding:10px 20px;
  transition: transform .15s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease, color .2s ease;
  outline: none;
}

.btn-primary{
  color:#fff;
  border: 1px solid rgba(118,82,201,.0);
  background: linear-gradient(135deg, #6675E0 0%, #7652C9 100%);
  box-shadow: 0 4px 10px rgba(102,117,224,.25);
}
.btn-primary:hover{
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(102,117,224,.32);
}
.btn-primary:focus-visible{
  box-shadow: 0 0 0 3px rgba(118,82,201,.22);
}

.btn-ghost{
  background:#fff;
  color:#5746c7;
  border:1px solid rgba(118,82,201,.35);
}
.btn-ghost:hover{
  background: linear-gradient(135deg, rgba(102,117,224,.08) 0%, rgba(118,82,201,.10) 100%);
  border-color: rgba(118,82,201,.55);
  color:#4b3ec2;
}
.btn-ghost:focus-visible{
  box-shadow: 0 0 0 3px rgba(118,82,201,.18);
}

@media (max-width: 768px){
  .header{ padding:0 20px; }
  .logo-text{ font-size:24px; }
  .nav{ gap:8px; }
  .btn{ padding:9px 12px; font-size:13px; }
}
</style>
