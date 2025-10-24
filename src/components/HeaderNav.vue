<template>
  <header class="header">
    <h1 class="logo" aria-label="아티짹">
      <button class="logo-btn" @click="goHome">
        <span class="logo-text">아티짹</span>
      </button>
    </h1>

    <nav class="nav" aria-label="헤더 내비게이션">
      <!-- Primary -->
      <button class="btn btn-primary" @click="goRegister">구독하기</button>
      <!-- Ghost / Outline -->
      <button class="btn btn-ghost">요청하기</button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const goRegister = () => router.push('/register');
const goHome = () => router.push('/');
</script>

<style scoped>
/* Color tokens (참고용 주석)
   primary-start: #6675E0
   primary-end:   #7652C9
   primary-mid:   #6F63D4
*/

.header{
  position: sticky;
  top: 0;
  z-index: 3000;
  display:flex; justify-content:space-between; align-items:center;
  height:72px; padding:0 64px;

  /* 🔳 화이트 + 살짝 유리효과로 메인 그라데이션 위에서도 잘 어울리게 */
  background: rgba(255,255,255,0.86);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  /* 보라 계열 라인 */
  border-bottom: 1px solid rgba(118, 82, 201, 0.18);
}

/* 로고 버튼(접근성/포커스 가능) */
.logo { display:flex; align-items:center; }
.logo-btn{
  appearance: none;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
}
.logo-btn:focus-visible{
  outline: none;
  box-shadow: 0 0 0 3px rgba(118,82,201,.22);
  border-radius: 8px;
}

/* 그라데이션 텍스트 로고 - 사이즈 업 */
.logo-text{
  font-size:26px; /* ⬅️ 22px -> 26px */
  font-weight:800; letter-spacing:.2px;
  background: linear-gradient(135deg, #6675E0 0%, #7652C9 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.nav{ display:flex; gap:12px; }

/* 공통 버튼 */
.btn{
  font-size:14px; font-weight:700; cursor:pointer;
  border-radius:10px; padding:10px 20px;
  transition: transform .15s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease, color .2s ease;
  outline: none;
}

/* Primary: 보라 그라데이션 솔리드 */
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

/* Ghost: 화이트 바탕 + 보라 라인 */
.btn-ghost{
  background:#fff;
  color:#5746c7; /* mid 톤 */
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

/* 반응형 */
@media (max-width: 768px){
  .header{ padding:0 20px; }
  .logo-text{ font-size:24px; } /* 모바일에서도 기존보다 크게 */
  .btn{ padding:9px 14px; }
}
</style>
