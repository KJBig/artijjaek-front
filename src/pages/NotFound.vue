<template>
  <div class="notfound">
    <div class="content">
      <img src="/404_logo.png" alt="404 Not Found" class="notfound-img" />
      <p class="desc">페이지를 찾을 수 없습니다.</p>
      <button class="btn" @click="goHome">홈으로 돌아가기</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const goHome = () => router.push("/");
</script>

<style scoped>
.notfound {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background: linear-gradient(135deg, #f4f5ff 0%, #ffffff 100%);
  color: #5746c7;
}

.content {
  transform: translateY(-50px);
}

/* ✅ 404 이미지 */
.notfound-img {
  width: 280px; /* 필요에 맞게 조정 (예: 240~320px) */
  height: auto;
  margin-bottom: 16px;
  user-select: none;
}

/* 문구 */
.desc {
  font-size: 18px;
  margin-bottom: 24px;
}

/* 버튼 스타일 (기존 헤더 버튼과 통일감 유지) */
.btn {
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  background: linear-gradient(135deg, #6675E0 0%, #7652C9 100%);
  color: #fff;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(102,117,224,.25);
  transition: transform .15s ease, box-shadow .2s ease;
}
.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(102,117,224,.32);
}
</style>
