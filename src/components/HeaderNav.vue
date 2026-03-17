<template>
  <header class="header" :class="{ 'header-open': mobileMenuOpen }">
    <h1 class="logo" aria-label="아티짹">
      <button class="logo-btn" @click="goHome">
        <img src="/main_logo.png" alt="아티짹 로고" class="logo-img" />
        <span class="logo-text">아티짹</span>
      </button>
    </h1>

    <nav class="nav" :class="{ 'nav-open': mobileMenuOpen }" aria-label="헤더 내비게이션">
      <!-- Primary -->
      <button class="btn btn-primary" @click="goRegister">구독하기</button>
      <button class="btn btn-ghost" @click="goCompanyList">지원하는 회사 리스트</button>
      <!-- Ghost / Outline -->
      <button class="btn btn-ghost" @click="goInquiry">문의하기</button>
    </nav>

    <button
      class="nav-toggle"
      type="button"
      :aria-expanded="mobileMenuOpen"
      aria-label="헤더 메뉴 토글"
      @click="toggleMobileMenu"
    >
      <span class="nav-toggle-icon" :class="{ 'nav-toggle-icon-open': mobileMenuOpen }"></span>
    </button>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const mobileMenuOpen = ref(false);

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const goRegister = () => {
  closeMobileMenu();
  router.push('/register');
};

const goHome = () => {
  router.push('/');
};

const goCompanyList = () => {
  closeMobileMenu();
  router.push('/companies');
};

/**
 * ✅ 요청하기 버튼 클릭 시 /inquiry 페이지로 이동
 */
const goInquiry = () => {
  closeMobileMenu();
  router.push('/inquiry');
};
</script>

<style scoped>
.header{
  --header-surface: #ffffff;
  --header-blur: blur(10px);
  position: sticky;
  top: 0;
  z-index: 3000;
  display:flex; justify-content:space-between; align-items:center;
  height:72px; padding:0 64px;
  background: var(--header-surface);
  backdrop-filter: var(--header-blur);
  -webkit-backdrop-filter: var(--header-blur);
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
  white-space: nowrap;
  background: linear-gradient(135deg, #6675E0 0%, #7652C9 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.nav{ display:flex; gap:12px; }

.nav-toggle{
  display:none;
  align-self:center;
  width:36px;
  height:24px;
  padding:0;
  border-radius:999px;
  border:1px solid rgba(118,82,201,.18);
  background:rgba(255,255,255,.92);
  box-shadow: 0 6px 16px rgba(118, 82, 201, 0.08);
}

.nav-toggle-icon{
  display:inline-block;
  width:10px;
  height:10px;
  border-right:2px solid #5b4ed6;
  border-bottom:2px solid #5b4ed6;
  transform: translateY(-2px) rotate(45deg);
  transition: transform .2s ease;
}

.nav-toggle-icon-open{
  transform: translateY(2px) rotate(-135deg);
}

.btn{
  font-size:14px; font-weight:700; cursor:pointer;
  border-radius:10px; padding:10px 20px;
  transition: transform .15s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease, color .2s ease;
  outline: none;
  word-break: keep-all;
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
  .header{
    min-height:72px;
    padding:0 20px;
    display:grid;
    grid-template-columns:1fr;
    align-items:start;
    justify-items:center;
    justify-content:stretch;
    position:sticky;
    background: var(--header-surface);
    backdrop-filter: var(--header-blur);
    -webkit-backdrop-filter: var(--header-blur);
  }

  .header.header-open{
    border-bottom-color: transparent;
    background: var(--header-surface);
    backdrop-filter: var(--header-blur);
    -webkit-backdrop-filter: var(--header-blur);
  }

  .logo{
    width:100%;
    min-height:72px;
    justify-content:center;
    margin:0 auto;
    align-items:center;
  }

  .logo-btn{
    width:fit-content;
  }

  .logo-text{
    font-size:24px;
  }

  .nav{
    display:none;
    grid-template-columns:1fr;
    gap:8px;
    width:calc(100% + 40px);
    margin-left:-20px;
    margin-right:-20px;
    padding:0 0 20px;
    background: var(--header-surface);
    backdrop-filter: var(--header-blur);
    -webkit-backdrop-filter: var(--header-blur);
  }

  .nav.nav-open{
    display:grid;
  }

  .btn{
    min-width:0;
    padding:10px 14px;
    font-size:13px;
    white-space:nowrap;
    text-align:center;
    width:100%;
  }

  .nav-toggle{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    flex-shrink:0;
    position:relative;
    margin-top:-12px;
    margin-bottom:-12px;
    z-index:1;
  }

}

@media (max-width: 480px){
  .header{
    min-height:64px;
    padding:0 16px;
  }

  .logo{
    min-height:64px;
  }

  .nav{
    width:calc(100% + 32px);
    margin-left:-16px;
    margin-right:-16px;
  }

  .logo-img{
    height:26px;
  }

  .logo-text{
    font-size:22px;
  }

  .btn{
    padding:9px 12px;
    font-size:12px;
  }
}

@media (max-width: 420px){
  .btn{
    width:100%;
    font-size:11px;
    padding:10px 12px;
  }
}
</style>
