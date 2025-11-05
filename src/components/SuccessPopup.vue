<!-- src/components/SuccessPopup.vue -->
<template>
  <Teleport to="body">
    <div class="overlay" role="dialog" aria-modal="true" :aria-labelledby="titleId" @keydown.esc.prevent="onClose">
      <div class="popup" ref="popupRef" tabindex="-1">
        <header class="head">
          <h2 :id="titleId" class="title">{{ title }}</h2>
        </header>

        <div class="body">
          <p class="message" v-if="message" v-html="message"></p>
          <slot />
        </div>

        <footer class="foot">
          <button type="button" class="btn" @click="onConfirm" autofocus>{{ confirmText }}</button>
        </footer>

        <button class="x" type="button" aria-label="닫기" title="닫기" @click="onClose">✕</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";

const props = withDefaults(defineProps<{
  title?: string;
  message?: string;           // HTML 허용(굵게/줄바꿈 위해 v-html 사용)
  confirmText?: string;       // 버튼 레이블
  redirectTo?: string | null; // 없으면 이동하지 않음
}>(), {
  title: "처리가 완료되었어요",
  message: "변경 사항이 저장되었습니다.",
  confirmText: "확인",
  redirectTo: null,
});

const emit = defineEmits<{ (e: "close"): void }>();
const router = useRouter();

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

const onConfirm = async () => {
  // 먼저 닫기
  emit("close");
  // 목적지가 있을 때만 라우팅
  if (props.redirectTo) {
    await router.push(props.redirectTo);
  }
};
</script>

<style scoped>
.overlay{ position: fixed; inset: 0; background: rgba(18, 16, 31, .45); display: grid; place-items: center; z-index: 9999; }
.popup{ position: relative; width: min(420px, 92vw); background: #fff; border-radius: 16px; border: 1px solid #ecebf6; box-shadow: 0 18px 48px rgba(23,16,51,.25); outline: none; }
.head{ padding: 18px 20px 8px; }
.title{ margin:0; font-size:18px; font-weight:800; color:#1f1f2b; }
.body{ padding: 0 20px 12px; color:#2a2733; }
.message{ margin: 0; line-height: 1.6; white-space: normal; }
.foot{ padding: 12px 20px 20px; display:flex; justify-content:flex-end; }
.btn{ padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(118,82,201,.0); background: linear-gradient(135deg, #6675E0 0%, #7652C9 100%); color:#fff; font-weight:700; cursor:pointer; box-shadow: 0 8px 20px rgba(102,117,224,.22); }
.btn:hover{ box-shadow: 0 10px 26px rgba(102,117,224,.30); transform: translateY(-1px); }
.x{ position:absolute; top:8px; right:8px; border:0; background:transparent; cursor:pointer; color:#6e6a7e; font-size:18px; line-height:1; padding:6px; border-radius:8px; }
.x:hover{ background:#f4f3fb; color:#4b42b9; }
</style>
