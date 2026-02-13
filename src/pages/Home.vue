<template>
  <div class="page">
    <main class="main">
      <div class="content">
        <h2 class="title">기술 블로그 구독 서비스</h2>
        <p class="desc">
          한국 IT 기업의 최신 기술 글을 한눈에.<br />
          구독으로 놓치지 마세요.
        </p>
        <p v-if="companyCount !== null" class="count">
          현재 {{ companyCount }}개의 회사를 지원하고 있어요.
        </p>
        <button class="cta" @click="goRegister">
          무료 구독하기
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router';
import { fetchCompanyCount } from "../services/companyApi";

const router = useRouter();
const companyCount = ref<number | null>(null);
const goRegister = () => router.push('/register');

onMounted(async () => {
  companyCount.value = await fetchCompanyCount();
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  width: 100%;
  background: #ffffff; /* ✅ 흰색 배경 */
  color: #222222;
  font-family: 'Pretendard', sans-serif;
}

.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  text-align: center;
  max-width: 600px;
  padding: 20px;
  transform: translateY(-10vh);
}

.title {
  font-size: 40px;
  font-weight: 700;
  color: #4b4b4b; /* 짙은 회색으로 대비 */
  margin-bottom: 16px;
}

.desc {
  font-size: 18px;
  line-height: 1.6;
  color: #666666;
  margin-bottom: 12px;
}

.count {
  font-size: 16px;
  line-height: 1.5;
  color: #4b3ec2;
  font-weight: 700;
  margin-bottom: 24px;
}

/* ✅ 시그니처 컬러 기반 버튼 */
.cta {
  background: linear-gradient(135deg, #6675e0 0%, #7652c9 100%);
  color: #ffffff;
  border: none;
  border-radius: 14px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(102, 117, 224, 0.25);
}

/* ✅ hover 시 좀 더 밝게 */
.cta:hover {
  background: linear-gradient(135deg, #7684f0 0%, #8863d8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(102, 117, 224, 0.35);
}

/* ✅ 작은 화면 대응 */
@media (max-width: 640px) {
  .title {
    font-size: 32px;
  }

  .desc {
    font-size: 16px;
  }

  .count {
    font-size: 15px;
  }

  .content {
    transform: translateY(-6vh);
  }
}
</style>
