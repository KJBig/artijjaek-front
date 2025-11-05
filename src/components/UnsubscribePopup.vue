<template>
  <Teleport to="body">
    <div
      class="overlay"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      @keydown.esc.prevent="onClose"
    >
      <div class="popup" ref="popupRef" tabindex="-1">
        <header class="head">
          <h2 :id="titleId" class="title">{{ title }}</h2>
        </header>

        <div class="body">
          <p class="message" v-if="message">{{ message }}</p>
          <slot />
        </div>

        <footer class="foot">
          <button
            type="button"
            class="btn btn-ghost"
            @click="onClose"
            :disabled="busy"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            class="btn"
            @click="onConfirm"
            :disabled="busy"
            autofocus
          >
            {{ confirmText }}
          </button>
        </footer>

        <button class="x" type="button" aria-label="닫기" title="닫기" @click="onClose">✕</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";

/**
 * 경고 해결 포인트
 * - cancelText, confirmText, busy 를 props 로 명시
 * - Teleport 루트에서 attrs 상속이 안 되므로 props 선언이 필수
 */
const props = withDefaults(defineProps<{
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  busy?: boolean;
}>(), {
  title: "구독을 취소할까요?",
  message: "더 이상 아티짹이 이메일 소식을 보내지 않아요.",
  confirmText: "네, 취소할게요",
  cancelText: "유지할게요",
  busy: false,
});

const emit = defineEmits<{ (e: "close"): void; (e: "confirm"): void }>();

const popupRef = ref<HTMLElement | null>(null);
const titleId = `popup-title-${Math.random().toString(36).slice(2, 7)}`;

const trapFocus = () => {
  if (!popupRef.value) return;
  if (!popupRef.value.contains(document.activeElement)) {
    const first = popupRef.value.querySelector<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    first?.focus();
  }
};

const preventScroll = (enable: boolean) => {
  document.body.style.overflow = enable ? "hidden" : "";
};

onMounted(() => {
  preventScroll(true);
  setTimeout(() => popupRef.value?.focus(), 0);
  window.addEventListener("focus", trapFocus, true);
});

onBeforeUnmount(() => {
  preventScroll(false);
  window.removeEventListener("focus", trapFocus, true);
});

const onClose = () => emit("close");
const onConfirm = () => emit("confirm");
</script>

<style scoped>
.overlay{
  position: fixed; inset: 0;
  background: rgba(18, 16, 31, .45);
  display: grid; place-items: center;
  z-index: 9999;
}
.popup{
  position: relative;
  width: min(420px, 92vw);
  background: #fff;
  border-radius: 16px;
  border: 1px solid #ecebf6;
  box-shadow: 0 18px 48px rgba(23,16,51,.25);
  outline: none;
}
.head{ padding: 18px 20px 8px; }
.title{ margin:0; font-size:18px; font-weight:800; color:#1f1f2b; }
.body{ padding: 0 20px 12px; color:#2a2733; }
.message{ margin: 0; line-height: 1.6; }
.foot{ padding: 12px 20px 20px; display:flex; gap:8px; justify-content:flex-end; }
.btn{
  padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(118,82,201,.0);
  background: linear-gradient(135deg, #6675E0 0%, #7652C9 100%);
  color:#fff; font-weight:700; cursor:pointer;
  box-shadow: 0 8px 20px rgba(102,117,224,.22);
}
.btn:hover{ box-shadow: 0 10px 26px rgba(102,117,224,.30); transform: translateY(-1px); }
.btn[disabled]{ opacity: .65; cursor: not-allowed; transform: none; box-shadow: none; }

.btn-ghost{
  background: #f5f4fb;
  color: #4b42b9;
  border: 1px solid #ecebf6;
  box-shadow: none;
}
.btn-ghost:hover{ background:#eeecfb; }
.x{
  position:absolute; top:8px; right:8px; border:0; background:transparent; cursor:pointer;
  color:#6e6a7e; font-size:18px; line-height:1; padding:6px; border-radius:8px;
}
.x:hover{ background:#f4f3fb; color:#4b42b9; }
</style>
