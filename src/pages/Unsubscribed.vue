<template>
  <div class="wrap">
    <main class="main">
      <section class="card" role="status" aria-labelledby="done-title">
        <header class="head">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm-1.2-6.2 6-6a1 1 0 0 0-1.4-1.4l-5.3 5.3-2.1-2.1a1 1 0 0 0-1.4 1.4l2.8 2.8a1 1 0 0 0 1.4 0Z" />
          </svg>
          <h1 id="done-title" class="title">구독이 취소되었습니다</h1>
          <p class="desc">
            더 이상 아티짹이 이메일 소식을 보내지 않습니다.<br />
            언제든 다시 구독하실 수 있어요.
          </p>
        </header>

        <div class="info" v-if="email">
          <span class="label">이메일</span>
          <span class="value">{{ email }}</span>
        </div>

        <footer class="foot">
          <router-link class="btn" to="/">홈으로 가기</router-link>
          <a
            class="btn btn--secondary"
            :href="feedbackUrl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="피드백 남기러 가기 (새 창)"
          >
            피드백 남기러 가기
          </a>
        </footer>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const email = computed(() => (route.query.email as string | undefined)?.trim());

/**
 * 피드백 URL 우선순위
 * 1) .env의 VITE_FEEDBACK_URL
 * 2) 폴백(임시) 링크
 */
const feedbackUrl = computed(
  () => import.meta.env.VITE_FEEDBACK_URL ?? "https://forms.gle/your-form-id"
);
</script>

<style scoped>
.wrap{ min-height:100vh; background:linear-gradient(180deg,#ffffff 0%,#fafaff 100%); display:flex; }
.main{ flex:1; display:grid; place-items:center; padding:48px 16px; }
.card{
  width:min(560px, 94vw);
  background:#fff; border:1px solid #ecebf6; border-radius:16px;
  box-shadow:0 14px 36px rgba(23,16,51,.08);
  padding: 24px 20px 20px;
}
.head{ text-align:center; }
.icon{ width:56px; height:56px; fill:#6b7cf0; margin: 8px auto 6px; display:block; }
.title{ margin:8px 0 4px; font-size:22px; font-weight:800; color:#1f1f2b; }
.desc{ margin:0; color:#6e6a7e; line-height:1.6; }
.info{
  margin:16px auto 0; padding:10px 12px; width:fit-content;
  background:#fbfaff; border:1px solid rgba(118,82,201,.12); border-radius:10px;
  display:flex; gap:8px; align-items:center; color:#2a2733;
}
.label{ font-size:12px; color:#8a86a0; }
.value{ font-weight:700; }
.foot{
  display:flex; justify-content:center; gap:10px; /* 두 버튼 간격 */
  margin-top:18px;
}
.btn{
  padding:10px 14px; border-radius:10px; border:1px solid rgba(118,82,201,0);
  background:linear-gradient(135deg,#6675E0 0%, #7652C9 100%);
  color:#fff; font-weight:700; text-decoration:none;
  box-shadow:0 8px 22px rgba(102,117,224,.22);
  transition: box-shadow .15s ease, transform .15s ease;
}
.btn:hover{ box-shadow:0 10px 26px rgba(102,117,224,.30); transform:translateY(-1px); }

/* 세컨더리(우측) 버튼: 라이트 톤 아웃라인 */
.btn--secondary{
  background:#ffffff;
  color:#4b42b9;
  border:1px solid #dcd9f1;
  box-shadow:none;
}
.btn--secondary:hover{
  background:#f7f6ff;
  box-shadow:0 6px 16px rgba(102,117,224,.16);
}
</style>
