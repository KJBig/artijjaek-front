<template>
  <div class="page">
    <main class="main">
      <div class="content">
        <h2 class="title">기술 블로그 구독 서비스</h2>
        <p class="desc">
          한국 IT 기업의 최신 기술 글을 한눈에.<br />
          구독으로 놓치지 마세요.
        </p>
        <button class="cta" @click="onSubscribe">구독 시작하기</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const onSubscribe = (): void => {
  alert("구독하기 버튼 클릭됨!");
};
</script>

<style scoped>
/* 전체 배경: 따뜻한 아이보리톤 */
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f9f7f3 0%, #f0ece6 100%);
  color: #3c3c3c;
  font-family: 'Pretendard', sans-serif;
}

/* 메인 콘텐츠 중앙 배치 */
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
}

.title {
  font-size: 40px;
  font-weight: 700;
  color: #3b332c; /* 부드러운 진한 브라운 */
  margin-bottom: 16px;
}

.desc {
  font-size: 18px;
  line-height: 1.6;
  color: #6a5f55; /* 따뜻한 중간 브라운 */
  margin-bottom: 32px;
}

/* CTA 버튼: 크림 + 브라운 포인트 */
.cta {
  background-color: #e7d7c1;
  color: #3b332c;
  border: 1px solid #d4c2a6;
  border-radius: 14px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.cta:hover {
  background-color: #d4c2a6;
  border-color: #bca98c;
  transform: translateY(-2px);
}
</style>
