<template>
  <div class="wrap">
    <!-- ✅ 인증 오류 화면 -->
    <main class="main" v-if="guard.fatal.value">
      <AuthErrorPanel
        :title="'인증 정보가 유효하지 않습니다'"
        :message="`링크에 포함된 <strong>email</strong> 또는 <strong>token</strong>이 올바르지 않거나 만료되었어요.<br/>이메일 받은 편지함에서 최신 링크로 다시 시도해 주세요.`"
        :error="guard.error"
        primaryText="다시 시도"
        secondaryText="홈으로"
        @primary="retry"
        @secondary="goHome"
      />
    </main>

    <!-- ✅ 정상 화면 -->
    <main class="main" v-else>
      <section class="card" role="status" aria-labelledby="done-title">
        <header class="head">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm-1.2-6.2 6-6a1 1 0 0 0-1.4-1.4l-5.3 5.3-2.1-2.1a1 1 0 0 0-1.4 1.4l2.8 2.8a1 1 0 0 0 1.4 0Z"
            />
          </svg>
          <h1 id="done-title" class="title">구독이 취소되었습니다</h1>
          <p class="desc">
            더 이상 아티짹이 이메일 소식을 보내지 않습니다.<br />
            언제든 다시 구독하실 수 있어요.
          </p>
        </header>

        <!-- ✅ 이메일 + 닉네임 한 박스 -->
        <div class="info" v-if="email">
          <div class="row">
            <span class="label">이메일</span>
            <span class="value">{{ email }}</span>
          </div>
          <div class="row" v-if="nickname">
            <span class="label">닉네임</span>
            <span class="value">{{ nickname }}</span>
          </div>
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
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AuthErrorPanel from "../components/AuthErrorPanel.vue";
import { useAuthGuard } from "../composables/useAuthGuard.ts";
import { getMySubscription } from "../services/memberApi";

const guard = useAuthGuard();
const router = useRouter();

const email = computed(() => guard.email.value);
const token = computed(() => guard.token.value);
const nickname = ref<string | undefined>(undefined);

const feedbackUrl = computed(
  () => import.meta.env.VITE_FEEDBACK_URL ?? "https://forms.gle/your-form-id"
);

const retry = () => {
  guard.reset();
  verify();
};

const goHome = () => router.push("/");

const verify = async () => {
  await guard.load(async (email, token) => {
    const resp = await getMySubscription(email, token);
    if (!resp?.isSuccess || !resp?.data) {
      throw new Error(resp?.message ?? "인증 검증에 실패했습니다.");
    }
    nickname.value = resp.data.nickname;
    return true;
  });
};

onMounted(() => {
  verify();
});
</script>

<style scoped>
.wrap {
  min-height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #fafaff 100%);
  display: flex;
}
.main {
  flex: 1;
  display: grid;
  place-items: center;
  padding: 48px 16px;
}
.card {
  width: min(560px, 94vw);
  background: #fff;
  border: 1px solid #ecebf6;
  border-radius: 16px;
  box-shadow: 0 14px 36px rgba(23, 16, 51, 0.08);
  padding: 24px 20px 20px;
}
.head {
  text-align: center;
}
.icon {
  width: 56px;
  height: 56px;
  fill: #6b7cf0;
  margin: 8px auto 6px;
  display: block;
}
.title {
  margin: 8px 0 4px;
  font-size: 22px;
  font-weight: 800;
  color: #1f1f2b;
}
.desc {
  margin: 0;
  color: #6e6a7e;
  line-height: 1.6;
}

/* ✅ 한 박스 안에 이메일 + 닉네임 */
.info {
  margin: 16px auto 0;
  padding: 12px 18px;
  width: fit-content;
  background: #fbfaff;
  border: 1px solid rgba(118, 82, 201, 0.12);
  border-radius: 10px;

  /* ✅ flex-column으로 변경 */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 6px;

  color: #2a2733;
  line-height: 1.4;
}

.row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.label {
  font-size: 13px;
  color: #8a86a0;
  min-width: 50px;
  text-align: left;
}

.value {
  font-weight: 700;
  font-size: 15px;
  color: #1f1f2b;
  word-break: break-all;
}

.foot {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 18px;
}
.btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(118, 82, 201, 0);
  background: linear-gradient(135deg, #6675e0 0%, #7652c9 100%);
  color: #fff;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 8px 22px rgba(102, 117, 224, 0.22);
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.btn:hover {
  box-shadow: 0 10px 26px rgba(102, 117, 224, 0.3);
  transform: translateY(-1px);
}
.btn--secondary {
  background: #ffffff;
  color: #4b42b9;
  border: 1px solid #dcd9f1;
  box-shadow: none;
}
.btn--secondary:hover {
  background: #f7f6ff;
  box-shadow: 0 6px 16px rgba(102, 117, 224, 0.16);
}
</style>
