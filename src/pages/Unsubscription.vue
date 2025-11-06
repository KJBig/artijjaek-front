<!-- src/pages/Unsubscription.vue -->
<template>
  <div class="wrap">
    <!-- 인증 오류 -->
    <main class="main" v-if="guard.fatal.value">
      <AuthErrorPanel
        title="인증 정보가 유효하지 않습니다"
        :message="`링크에 포함된 <strong>email</strong> 또는 <strong>token</strong>이 올바르지 않거나 만료되었어요.<br/>이메일 받은 편지함에서 최신 링크로 다시 시도해 주세요.`"
        :error="guard.error"
        primaryText="다시 시도"
        secondaryText="홈으로"
        @primary="retry"
        @secondary="goHome"
      />
    </main>

    <!-- 정상 화면 -->
    <main class="main" v-else>
      <section class="card" role="status" aria-labelledby="guide-title">
        <header class="head">
          <h1 id="guide-title" class="title">구독 취소 안내</h1>
          <p class="desc">다음 정보에 대해서 구독 취소를 진행하려면</p>
          <p class="desc">아래의 <strong>확인</strong> 버튼을 눌러주세요.</p>
        </header>

        <!-- 이메일 / 닉네임 -->
        <div class="info" v-if="email">
          <div class="inner-info">
            <div class="row">
              <span class="label">이메일:</span>
              <span class="value">{{ email }}</span>
            </div>
            <div class="row" v-if="nickname">
              <span class="label">닉네임:</span>
              <span class="value">{{ nickname }}</span>
            </div>
          </div>
        </div>

        <!-- 구독 취소 사유 -->
        <section class="reason-group" aria-labelledby="reason-title">
          <!-- 드롭다운 -->
          <div class="field">
            <span id="reason-title" class="label">구독 취소 사유</span>
            <div class="dropdown" :class="{ 'is-open': openReasonDropdown }">
              <button
                ref="toggleRefReason"
                class="dropdown-toggle"
                type="button"
                :aria-expanded="openReasonDropdown ? 'true' : 'false'"
                aria-haspopup="listbox"
                @click="toggleReasonDropdown"
                :disabled="busy"
              >
                <span v-if="!selectedReasonId" class="placeholder">사유를 선택하세요</span>
                <span v-else class="summary">{{ selectedReasonLabel }}</span>
                <svg class="chev" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>

              <div v-show="openReasonDropdown" ref="menuRefReason" class="dropdown-menu" role="listbox">
                <div
                  v-for="r in reasons"
                  :key="r.id"
                  class="option"
                  @click="selectReason(r)"
                >
                  <span class="option-label">{{ r.label }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 기타 선택 시 한 줄 입력창 -->
          <div class="field" v-if="selectedReasonId === UnsubscriptionReasonId.ETC">
            <label class="label" for="other-reason">기타 사유 입력</label>
            <input
              id="other-reason"
              type="text"
              class="input"
              placeholder="구체적인 사유를 입력해주세요"
              v-model.trim="otherReason"
              maxlength="100"
            />
          </div>

          <!-- 상세 사유 -->
          <div class="field">
            <label class="label" for="unsubscription-detail">상세 사유 <small>(필수)</small></label>
            <textarea
              id="unsubscription-detail"
              class="input textarea"
              rows="4"
              :disabled="busy"
              v-model.trim="reasonDetail"
              placeholder="자유롭게 작성해 주세요 (최소 1자, 최대 500자)"
              maxlength="500"
            />
            <div class="count">{{ reasonDetail.length }}/500</div>
          </div>
        </section>

        <!-- 버튼 -->
        <footer class="foot">
          <button
            class="btn btn--primary"
            type="button"
            @click="openPopup"
            :disabled="isConfirmDisabled"
            title="사유 선택과 상세 사유 1자 이상 입력 시 활성화"
          >
            확인
          </button>
          <router-link class="btn btn--secondary" :to="{ name: 'setting', query: { email, token } }">
            설정으로 돌아가기
          </router-link>
        </footer>
      </section>

      <!-- 팝업 -->
      <UnsubscribePopup
        v-if="popup.open"
        title="구독을 취소할까요?"
        message="더 이상 아티짹 이메일 소식을 보내지 않아요."
        confirm-text="네, 취소할게요"
        cancel-text="유지할게요"
        :busy="busy"
        @close="onCancel"
        @confirm="onConfirm"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import AuthErrorPanel from "../components/AuthErrorPanel.vue";
import UnsubscribePopup from "../components/UnsubscribePopup.vue";
import { useAuthGuard } from "../composables/useAuthGuard.ts";
import { getMySubscription, unsubscribeMember } from "../services/memberApi.ts";
import {
  UNSUBSCRIPTION_REASONS,
  UnsubscriptionReasonId,
  getReasonLabel,
} from "../constants/unsubscriptionReasons.ts";

const guard = useAuthGuard();
const router = useRouter();

const email = computed(() => guard.email.value);
const token = computed(() => guard.token.value);
const nickname = ref<string | undefined>(undefined);
const busy = ref(false);
const popup = ref({ open: false });

/** 드롭다운 데이터/상태 */
const reasons = UNSUBSCRIPTION_REASONS;
const selectedReasonId = ref<UnsubscriptionReasonId | "">("");
const selectedReasonLabel = computed(() =>
  selectedReasonId.value ? getReasonLabel(selectedReasonId.value) : ""
);
const openReasonDropdown = ref(false);
const menuRefReason = ref<HTMLElement | null>(null);
const toggleRefReason = ref<HTMLElement | null>(null);
const otherReason = ref<string>("");

const onWindowClickReason = (e: MouseEvent) => {
  const t = e.target as Node;
  if (menuRefReason.value?.contains(t) || toggleRefReason.value?.contains(t)) return;
  openReasonDropdown.value = false;
  window.removeEventListener("click", onWindowClickReason, { capture: true } as any);
};
const toggleReasonDropdown = async () => {
  openReasonDropdown.value = !openReasonDropdown.value;
  if (openReasonDropdown.value) {
    await nextTick();
    window.addEventListener("click", onWindowClickReason, { capture: true });
  } else {
    window.removeEventListener("click", onWindowClickReason, { capture: true } as any);
  }
};
onBeforeUnmount(() => window.removeEventListener("click", onWindowClickReason, { capture: true } as any));

const selectReason = (r: { id: UnsubscriptionReasonId; label: string }) => {
  selectedReasonId.value = r.id;
  // 사유 변경 시 기타 입력 초기화
  if (r.id !== UnsubscriptionReasonId.ETC) otherReason.value = "";
  openReasonDropdown.value = false;
};

/** 상세 사유 */
const reasonDetail = ref<string>("");

/** 확인 버튼 비활성 조건: 사유 선택 + 상세 사유 1자 이상 + not busy */
const hasReason = computed(() => !!selectedReasonId.value);
const hasDetail = computed(() => reasonDetail.value.trim().length >= 1);
const isConfirmDisabled = computed(() => busy.value || !hasReason.value || !hasDetail.value);

/** 공통 동작 */
const retry = () => { guard.reset(); verifyOnly(); };
const goHome = () => router.push("/");
const openPopup = () => { if (!isConfirmDisabled.value) popup.value.open = true; };
const onCancel = async () => {
  popup.value.open = false;
  // UX: 닫힌 뒤 포커스를 드롭다운 토글로 되돌려주면 접근성 좋음
  await nextTick();
  toggleRefReason.value?.focus();
};
const onConfirm = async () => {
  if (!email.value || !token.value || !selectedReasonId.value) return;
  busy.value = true;
  try {
    // detail: 기타 입력(있으면) + 본문 상세 내용을 합쳐서 보냄
    const detailCombined = [otherReason.value?.trim(), reasonDetail.value?.trim()]
      .filter(Boolean)
      .join("\n");

    const payload = {
      email: email.value,
      token: token.value,
      // ✅ ENUM ID 그대로 전송
      reason: selectedReasonId.value, // e.g. "NO_COMPANY" | "ETC" ...
      detail: detailCombined,
    };

    // 세션에 저장(감사 페이지 등에서 사용)
    sessionStorage.setItem("artijjaek:unsub-info", JSON.stringify(payload));

    const resp = await unsubscribeMember(payload);
    if (resp?.isSuccess === true) {
      popup.value.open = false;
      router.push({ name: "thankyou" });
    } else {
      onCancel();
    }
  } finally {
    busy.value = false;
  }
};

const verifyOnly = async () => {
  await guard.load(async (email, token) => {
    const resp = await getMySubscription(email, token);
    if (!resp?.isSuccess || !resp?.data)
      throw new Error(resp?.message ?? "인증 검증 실패");
    nickname.value = resp.data.nickname;
    return true;
  });
};
onMounted(async () => {
  await verifyOnly();
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
  overflow: visible; /* dropdown 잘림 방지 */
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

.info {
  margin: 16px 0;
  padding: 14px 16px;
  width: 100%;
  background: #fbfaff;
  border: 1px solid rgba(118, 82, 201, 0.12);
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}
.row { display: flex; gap: 8px; }
.label { font-weight: 700; color: #2a2733; }
.value { font-weight: 700; color: #1f1f2b; }

.reason-group {
  margin-top: 12px;
  padding: 14px 16px;
  background: #fbfaff;
  border: 1px solid rgba(118, 82, 201, 0.12);
  border-radius: 12px;
  display: grid;
  gap: 14px;
}

.dropdown { position: relative; z-index: 20; }
.dropdown.is-open { z-index: 1000; }
.dropdown-toggle {
  width: 100%;
  display: flex; align-items: center; justify-content: space-between;
  border: 1px solid #deddee; background: #fff; color: #2b2740;
  border-radius: 12px; padding: 12px 14px; cursor: pointer;
}
.placeholder { color: #8c88a3; }
.summary { color: #4b42b9; font-weight: 700; }
.dropdown-menu {
  position: absolute; left: 0; right: 0; top: calc(100% + 6px);
  background: #fff; border: 1px solid #e6e5f2; border-radius: 12px;
  box-shadow: 0 14px 32px rgba(23, 16, 51, 0.1);
  padding: 8px; display: grid; gap: 4px; max-height: 260px; overflow: auto; z-index: 1100;
  color: #2e2b3a;
}
.option { padding: 8px 10px; border-radius: 10px; cursor: pointer; }
.option:hover { background: #f7f6ff; }

.input {
  width: 100%; border: 1px solid #deddee; background: #fff;
  border-radius: 12px; padding: 12px 14px; font-size: 14px;
  color: #1f1f2b; caret-color: #4b42b9;
}
.textarea { resize: vertical; }
.input::placeholder { color: #8a86a0; }
.count { text-align: right; font-size: 12px; color: #8a86a0; margin-top: 4px; }

.foot { display: flex; justify-content: center; gap: 10px; margin-top: 18px; }
.btn {
  padding: 10px 14px; border-radius: 10px; text-decoration: none; border: 1px solid #dcd9f1;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.btn:hover:not([disabled]) { transform: translateY(-1px); }
.btn[disabled] { opacity: 0.55; cursor: not-allowed; }
.btn--primary {
  background: linear-gradient(135deg, #6675e0 0%, #7652c9 100%);
  color: #fff; box-shadow: 0 8px 22px rgba(102, 117, 224, 0.22);
}
.btn--secondary { background: #fff; color: #4b42b9; }
</style>
