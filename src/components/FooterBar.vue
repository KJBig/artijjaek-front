<template>
  <footer class="footer">
    <div class="inner">
      <!-- 왼쪽 브랜드 영역 -->
      <div class="brand">
        <div class="row">
            <strong class="name">아티짹</strong>
            <span class="copy">© {{ year }} Artijjaek. All rights reserved.</span>
        </div>
      </div>

      <!-- 오른쪽 링크 영역 --> 
      <nav class="links" aria-label="푸터 링크">
        <span v-if="copied" class="copied-msg">📋 복사되었습니다!</span>
        <div class="row">
          <strong class="name">Contact</strong>
          <a href="#" class="link" @click.prevent="copyEmail">artijjaek.dev@gmail.com</a>
        </div>
        <div class="row">
          <strong class="name">ETC</strong>
          <a href="https://google.com" class="link">서비스 피드백</a>
        </div>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from "vue";

const year = new Date().getFullYear();
const email = "artijjaek.dev@gmail.com";
const copied = ref(false);

const copyEmail = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(email);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1000);
  } catch (err) {
    alert("복사에 실패했습니다 😢");
  }
};
</script>

<style scoped>
.footer {
  width: 100%;
  background: #0000;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  color: #6a5f55;
}

.inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

/* 브랜드 영역 */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #d2a679; /* 마스코트 포인트 컬러 */
  box-shadow: 0 0 0 3px rgba(210, 166, 121, 0.18);
}

.name {
  color: #3b332c;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.copy {
  font-size: 13px;
  opacity: 0.8;
}

/* 오른쪽 링크 전체 */
.links {
  display: flex;
  flex-direction: row; /* ✅ row끼리는 가로 정렬 */
  align-items: flex-start;
  gap: 40px; /* 두 블럭 간격 */
}

/* 각 블럭 내부 요소는 세로 정렬 */
.row {
  display: flex;
  flex-direction: column; /* ✅ 내부는 세로 정렬 */
  gap: 6px;
}

/* 링크 스타일 */
.link {
  font-size: 14px;
  color: #6a5f55;
  text-decoration: none;
  padding: 4px 6px;
  border-radius: 6px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.link:hover {
  background: rgba(0, 0, 0, 0.04);
  color: #3b332c;
}

/* 반응형 */
@media (max-width: 768px) {
  .inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
