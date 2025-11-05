<!-- src/pages/Inquiry.vue -->
<template>
  <div class="wrap">
    <main class="main">
      <section class="card" role="form" aria-labelledby="inquiry-title">
        <header class="head">
          <h1 id="inquiry-title" class="title">문의하기</h1>
          <p class="desc">
            아티짹 사용 중 불편한 점이나 요청사항이 있다면<br />
            아래 입력창에 자유롭게 남겨주세요.
          </p>
        </header>

        <section class="contact-group">
          <div class="field">
            <label class="label" for="contact-message">문의 내용 <small>(1000자 이내)</small></label>
            <textarea
              id="contact-message"
              class="input textarea"
              v-model.trim="message"
              rows="8"
              maxlength="1000"
              placeholder="문의하실 내용을 입력해주세요."
              :disabled="busy"
            />
            <div class="count">{{ message.length }}/1000</div>
          </div>
        </section>

        <footer class="foot">
          <button
            class="btn btn--primary"
            type="button"
            @click="onSubmit"
            :disabled="isSubmitDisabled"
          >
            문의하기
          </button>
        </footer>
      </section>

      <!-- 팝업: 성공 시 -->
      <Teleport to="body">
        <div v-if="showPopup" class="overlay" @click.self="closePopup">
          <div class="popup">
            <p class="message">문의가 성공적으로 접수되었습니다.</p>
            <button class="btn btn--primary" @click="goHome">확인</button>
          </div>
        </div>
      </Teleport>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { postInquiry } from "../services/inquiryApi.ts";

const router = useRouter();
const message = ref("");
const busy = ref(false);
const showPopup = ref(false);

const isSubmitDisabled = computed(() => {
  const len = message.value.trim().length;
  return busy.value || len < 1 || len > 1000;
});

const onSubmit = async () => {
  if (isSubmitDisabled.value) return;
  busy.value = true;

  try {
    // ✅ API 스펙에 맞춰 content 필드로 전송
    const resp = await postInquiry({ content: message.value.trim() });
    // 서버 래핑 응답 형식에 맞춰 성공 여부 체크
    if (resp?.isSuccess === true) {
      showPopup.value = true;
    } else {
      const msg = resp?.message ?? "문의 접수에 실패했습니다. 잠시 후 다시 시도해주세요.";
      alert(msg);
    }
  } catch (err: any) {
    console.error("문의하기 에러:", err);
    alert(err?.message ?? "문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  } finally {
    busy.value = false;
  }
};

const closePopup = () => (showPopup.value = false);
const goHome = () => router.push("/");
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
  place-items: start center;
  padding: 40px 16px;
}
.card {
  position: relative;
  width: min(640px, 100%);
  background: #fff;
  border: 1px solid #ecebf6;
  border-radius: 16px;
  box-shadow: 0 14px 36px rgba(23, 16, 51, 0.08);
  padding: 24px 20px 20px;
  overflow: visible;
}
.card::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 6px;
  background: linear-gradient(135deg, #6675e0 0%, #7652c9 100%);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}
.head { text-align: center; }
.title { margin: 8px 0 4px; font-size: 22px; font-weight: 800; color: #1f1f2b; }
.desc { margin: 0; color: #6e6a7e; line-height: 1.6; }

.contact-group {
  margin-top: 20px;
  padding: 14px 16px;
  background: #fbfaff;
  border: 1px solid rgba(118, 82, 201, 0.12);
  border-radius: 12px;
  display: grid;
  gap: 14px;
}

.input {
  width: 100%;
  border: 1px solid #deddee;
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  color: #1f1f2b;
  caret-color: #4b42b9;
}
.textarea { resize: vertical; }
.input::placeholder { color: #8a86a0; }
.count { text-align: right; font-size: 12px; color: #8a86a0; margin-top: 4px; }

.foot { display: flex; justify-content: center; gap: 10px; margin-top: 18px; }
.btn {
  padding: 10px 14px;
  border-radius: 10px;
  text-decoration: none;
  border: 1px solid #dcd9f1;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.btn:hover:not([disabled]) { transform: translateY(-1px); }
.btn[disabled] { opacity: 0.55; cursor: not-allowed; }
.btn--primary {
  background: linear-gradient(135deg, #6675e0 0%, #7652c9 100%);
  color: #fff;
  box-shadow: 0 8px 22px rgba(102, 117, 224, 0.22);
}

/* 팝업 */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(18, 16, 31, 0.45);
  display: grid;
  place-items: center;
  z-index: 9999;
}
.popup {
  width: min(360px, 90vw);
  background: #fff;
  border-radius: 16px;
  padding: 24px 20px;
  text-align: center;
  box-shadow: 0 18px 48px rgba(23, 16, 51, 0.25);
}
.message {
  margin-bottom: 16px;
  font-weight: 600;
  color: #2a2733;
}
</style>
