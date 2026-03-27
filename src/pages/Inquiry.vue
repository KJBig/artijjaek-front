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
          <div class="reply-option">
            <label class="check-label">
              <input
                v-model="wantsReply"
                type="checkbox"
                :disabled="busy"
              />
              <span>이메일로 답변 받기</span>
            </label>
            <p class="reply-help">
              체크하지 않으면 이메일 주소 없이 문의만 남길 수 있습니다.
            </p>
          </div>

          <Transition name="email-field" mode="out-in">
            <div v-if="wantsReply" key="email-input" class="field email-panel">
              <label class="label" for="contact-email">
                이메일 <small>(답변 받을 주소)</small>
              </label>
              <input
                id="contact-email"
                class="input"
                type="email"
                v-model.trim="email"
                maxlength="255"
                placeholder="ex) example@email.com"
                :disabled="busy"
                autocomplete="email"
                :required="wantsReply"
              />
            </div>
            <div v-else key="email-skip" class="reply-skip email-panel" aria-live="polite">
              <strong>이메일 답변 없이 문의만 접수됩니다.</strong>
              <p>답변이 필요해지면 체크 후 이메일 주소를 입력해주세요.</p>
            </div>
          </Transition>

          <!-- 문의 내용 -->
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

const wantsReply = ref(true);
const email = ref("");
const message = ref("");
const busy = ref(false);
const showPopup = ref(false);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isSubmitDisabled = computed(() => {
  const msgLen = message.value.trim().length;
  const emailTrimmed = email.value.trim();
  const emailValid = !wantsReply.value
    || (emailTrimmed.length <= 255 && emailPattern.test(emailTrimmed));

  return busy.value || !emailValid || msgLen < 1 || msgLen > 1000;
});

const onSubmit = async () => {
  if (isSubmitDisabled.value) return;
  busy.value = true;

  try {
    const resp = await postInquiry({
      email: wantsReply.value ? email.value.trim() : undefined,
      content: message.value.trim(),
    });

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
.head {
  text-align: center;
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

.contact-group {
  margin-top: 20px;
  padding: 14px 16px;
  background: #fbfaff;
  border: 1px solid rgba(118, 82, 201, 0.12);
  border-radius: 12px;
  display: grid;
  gap: 14px;
}

.reply-option {
  display: grid;
  gap: 6px;
}

.check-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1f1f2b;
  font-weight: 600;
}

.check-label input {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  margin: 0;
  border: 1.5px solid #c9c6db;
  border-radius: 5px;
  background: #fff;
  display: inline-grid;
  place-items: center;
  transition: background-color 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
}

.check-label input::after {
  content: "";
  width: 9px;
  height: 5px;
  border-left: 2px solid transparent;
  border-bottom: 2px solid transparent;
  transform: rotate(-45deg) translateY(-1px);
  transition: border-color 0.16s ease;
}

.check-label input:checked {
  border-color: #5a5ad6;
  background: #5a5ad6;
}

.check-label input:checked::after {
  border-left-color: #fff;
  border-bottom-color: #fff;
}

.check-label input:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px rgba(90, 90, 214, 0.16);
}

.reply-help {
  margin: 0;
  font-size: 13px;
  color: #6e6a7e;
}

.email-panel {
  min-height: 88px;
}

.reply-skip {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px dashed rgba(102, 117, 224, 0.28);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(242, 244, 255, 0.92) 100%);
  color: #4b4960;
}

.reply-skip strong {
  display: block;
  font-size: 14px;
  color: #2c2a3b;
}

.reply-skip p {
  margin: 6px 0 0;
  font-size: 13px;
  color: #6e6a7e;
  line-height: 1.5;
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

/* ✅ textarea 크기 조절 불가 */
.textarea {
  resize: none;
}

.input::placeholder {
  color: #8a86a0;
}

.email-field-enter-active,
.email-field-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.email-field-enter-from,
.email-field-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.count {
  text-align: right;
  font-size: 12px;
  color: #8a86a0;
  margin-top: 4px;
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
  text-decoration: none;
  border: 1px solid #dcd9f1;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.btn:hover:not([disabled]) {
  transform: translateY(-1px);
}
.btn[disabled] {
  opacity: 0.55;
  cursor: not-allowed;
}
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
.label {
  color: #1f1f2b;
  font-weight: 600;
}
.label small {
  color: #000;
  font-weight: 400;
}
</style>
