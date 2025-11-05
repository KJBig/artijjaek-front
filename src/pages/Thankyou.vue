<!-- src/pages/Thankyou.vue -->
<template>
  <div class="wrap">
    <main class="main">
      <section class="card" role="status" aria-labelledby="done-title">
        <header class="head">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm-1.2-6.2 6-6a1 1 0 0 0-1.4-1.4l-5.3 5.3-2.1-2.1a1 1 0 0 0-1.4 1.4l2.8 2.8a1 1 0 0 0 1.4 0Z"
            />
          </svg>
          <h1 id="done-title" class="title">구독이 성공적으로 해제되었습니다</h1>
          <p class="desc">
            이제부터 아티짹의 이메일 소식을 보내지 않아요.<br />
            언제든 다시 구독하실 수 있어요.
          </p>
        </header>

        <footer class="foot">
          <router-link class="btn" to="/">홈으로 가기</router-link>
        </footer>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const email = computed(() => (route.query.email as string) || "");
</script>

<style scoped>
.wrap { min-height: 100vh; background: linear-gradient(180deg,#ffffff 0%,#fafaff 100%); display:flex; }
.main { flex:1; display:grid; place-items:center; padding:48px 16px; }
.card {
  width:min(560px,94vw); background:#fff; border:1px solid #ecebf6; border-radius:16px;
  box-shadow:0 14px 36px rgba(23,16,51,.08); padding:24px 20px 20px;
  transform: translateY(-100px);
}
.head { text-align:center; }
.icon { width:56px; height:56px; fill:#6b7cf0; margin:8px auto 6px; display:block; }
.title { margin:8px 0 4px; font-size:22px; font-weight:800; color:#1f1f2b; }
.desc { margin:0; color:#6e6a7e; line-height:1.6; }

.row { display:flex; align-items:baseline; gap:8px; }
.label { font-size:13px; color:#8a86a0; min-width:50px; text-align:left; }
.value { font-weight:700; font-size:15px; color:#1f1f2b; word-break:break-all; }

.foot { display:flex; justify-content:center; gap:10px; margin-top:18px; }
.btn {
  padding:10px 14px; border-radius:10px; border:1px solid rgba(118,82,201,0);
  background: linear-gradient(135deg,#6675E0 0%,#7652C9 100%); color:#fff; font-weight:700; text-decoration:none;
  box-shadow:0 8px 22px rgba(102,117,224,.22); transition: box-shadow .15s ease, transform .15s ease;
}
.btn:hover { box-shadow:0 10px 26px rgba(102,117,224,.30); transform: translateY(-1px); }
</style>
