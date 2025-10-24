<template>
  <div class="page">
    <main class="main">
      <div class="content">
        <h2 class="title">기술 블로그 구독 서비스</h2>
        <p class="desc">
          한국 IT 기업의 최신 기술 글을 한눈에.<br />
          구독으로 놓치지 마세요.
        </p>
        <button class="cta" @click="goRegister">
          구독 시작하기
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const goRegister = () => router.push('/register');
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  /* ✅ 모바일 주소창 포함한 안전한 뷰포트 높이 */
  min-height: 100svh;
  width: 100%;
  background: linear-gradient(135deg, #6675e0 0%, #7652c9 100%);
  color: #ffffff;
  font-family: 'Pretendard', sans-serif;
}

.main {
  flex: 1;
  display: flex;
  align-items: center;   /* 가로 중앙 */
  justify-content: center; /* 세로 중앙 기준 */
}

/* ✅ 중앙에서 살짝 위로 올리기 */
.content {
  text-align: center;
  max-width: 600px;
  padding: 20px;
  transform: translateY(-6vh);
}

.title {
  font-size: 40px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
}

.desc {
  font-size: 18px;
  line-height: 1.6;
  color: #e5e4f2;
  margin-bottom: 32px;
}

.cta {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 14px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
}

.cta:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

/* 📱 작은 화면에서는 이동량을 조금 줄임 */
@media (max-width: 640px) {
  .content {
    transform: translateY(-4vh);
  }
}
</style>
