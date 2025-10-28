<template>
  <Teleport to="body">
    <div class="overlay" role="dialog" aria-modal="true" :aria-labelledby="titleId" @keydown.esc.prevent="onClose">
      <div class="popup" ref="popupRef" tabindex="-1">
        <header class="head">
          <h2 :id="titleId" class="title">{{ title }}</h2>
        </header>
        <div class="body">
          <p class="message" v-if="message">{{ message }}</p>
          <slot />
        </div>
        <footer class="foot">
          <!-- ✅ 확인 누르면 홈으로 이동 -->
          <button type="button" class="btn" @click="onConfirm" autofocus>확인</button>
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
  message?: string;
  /** 확인 클릭 시 이동할 경로 (기본값 '/') */
  redirectTo?: string;
}>(), {
  title: "구독 등록 완료",
  message: "구독 등록이 완료되었습니다.\n 곧 안내 메일이 도착할 예정이니 메일을 확인해주세요!",
  redirectTo: "/",
});

const emit = defineEmits<{ (e: "close"): void }>();
const router = useRouter();

const popupRef = ref<HTMLElement | null>(null);
const titleId = `popup-title-${Math.random().toString(36).slice(2, 7)}`;

const trapFocus = (e: FocusEvent) => {
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
  // 먼저 닫고 라우팅 (화면 깜빡임 방지)
  emit("close");
  await router.push(props.redirectTo);
};
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
.foot{ padding: 12px 20px 20px; display:flex; justify-content:flex-end; }
.btn{
  padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(118,82,201,.0);
  background: linear-gradient(135deg, #6675E0 0%, #7652C9 100%);
  color:#fff; font-weight:700; cursor:pointer;
  box-shadow: 0 8px 20px rgba(102,117,224,.22);
}
.btn:hover{ box-shadow: 0 10px 26px rgba(102,117,224,.30); transform: translateY(-1px); }
.x{
  position:absolute; top:8px; right:8px; border:0; background:transparent; cursor:pointer;
  color:#6e6a7e; font-size:18px; line-height:1; padding:6px; border-radius:8px;
}
.x:hover{ background:#f4f3fb; color:#4b42b9; }
</style>
