<template>
  <teleport to="body">
    <div v-show="modelValue" class="overlay" role="presentation" @click.self="close">
      <section
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sub-title"
        ref="dialogRef"
        tabindex="-1"
      >
        <header class="modal-head">
          <h3 id="sub-title">아티짹 구독</h3>
          <button class="icon-btn" aria-label="닫기" type="button" @click="close">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                d="M18 6L6 18M6 6l12 12"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </header>

        <div class="modal-body">
          <!-- ✅ 회사 드롭다운 -->
          <div class="field">
            <span class="label">회사 <small>중복 선택 가능</small></span>

            <div class="dropdown" :class="{ 'is-invalid': errors.companies }">
              <button
                class="dropdown-toggle"
                type="button"
                :aria-expanded="openDropdown ? 'true' : 'false'"
                @click="openDropdown = !openDropdown"
              >
                <span v-if="selected.companies.length === 0" class="placeholder">선택하세요</span>
                <span v-else class="summary">{{ selected.companies.length }}개 선택됨</span>
                <svg class="chev" width="16" height="16" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>

              <!-- ✅ 드롭다운 메뉴 -->
              <div v-show="openDropdown" class="dropdown-menu" role="listbox">
                <!-- 전체 선택 -->
                <label class="option option-all">
                  <input class="cb" type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
                  <span class="box"></span>
                  <span class="option-label"><strong>전체 선택</strong></span>
                </label>

                <div class="divider" role="separator"></div>

                <!-- 개별 회사 -->
                <label v-for="c in options.companies" :key="c.id" class="option">
                  <input
                    class="cb"
                    type="checkbox"
                    :value="c.id"
                    :checked="selected.companies.includes(c.id)"
                    @change="toggleCompany(c.id)"
                  />
                  <span class="box"></span>
                  <img :src="c.image" alt="" class="company-thumb" />
                  <span class="option-label">{{ c.nameKr }} ({{ c.nameEn }})</span>
                </label>

                <!-- 무한 스크롤 -->
                <div class="loader" v-if="loading">불러오는 중...</div>
                <div ref="sentinelRef" class="sentinel" v-show="hasMore && !loading"></div>
              </div>
            </div>

            <!-- 에러 메시지 -->
            <p v-if="errors.companies" class="error-text">{{ errors.companies }}</p>

            <!-- 칩 영역 (가로 슬라이드) -->
            <div
              class="chips"
              ref="chipsRef"
              role="list"
              aria-label="선택한 회사 목록 (가로 스크롤 가능)"
              tabindex="0"
              @click.capture="onChipsClickCapture"
              @pointerdown="onPointerDown"
              @pointermove="onPointerMove"
              @pointerup="endDrag"
              @pointercancel="endDrag"
              @mouseleave="endDrag"
            >
              <template v-if="selected.companies.length">
                <span v-for="id in selected.companies" :key="id" class="chip" role="listitem">
                  <img
                    v-if="companyById.get(id)?.image"
                    :src="companyById.get(id)?.image"
                    alt=""
                    class="chip-thumb"
                  />
                  <span class="chip-text">
                    {{ companyById.get(id)?.nameKr }} ({{ companyById.get(id)?.nameEn }})
                  </span>
                  <button class="chip-x" @click="removeCompany(id)" aria-label="삭제">✕</button>
                </span>
              </template>
              <span v-else class="chips-placeholder">선택한 회사가 여기에 표시됩니다</span>
            </div>
          </div>

          <!-- 이메일 -->
          <label class="label" for="email">이메일</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="input"
            :class="{ 'is-invalid': errors.email }"
            placeholder="artijjaek.dev@gmail.com"
            @blur="validateEmail"
          />
          <p v-if="errors.email" class="error-text">{{ errors.email }}</p>

          <!-- 닉네임 -->
          <label class="label" for="nickname">닉네임</label>
          <input
            id="nickname"
            v-model="form.nickname"
            type="text"
            class="input"
            :class="{ 'is-invalid': errors.nickname }"
            placeholder="예: 준커"
            @blur="validateNickname"
          />
          <p v-if="errors.nickname" class="error-text">{{ errors.nickname }}</p>

          <button class="primary" type="button" :disabled="isSubmitting" @click="submit">
            <span v-if="isSubmitting">처리 중…</span>
            <span v-else>확인</span>
          </button>
        </div>
      </section>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed, nextTick } from "vue";
import { fetchCompaniesPage, fetchAllCompanies, type Company } from "../services/companyApi";
import { subscribeMember } from "../services/memberApi"; // ✅ 추가

interface Props { modelValue: boolean }
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "submit", payload: { companies: number[]; email: string; nickname: string }): void;
}>();

const dialogRef = ref<HTMLElement | null>(null);

/* 상태 */
const form = ref({ email: "", nickname: "" });
const options = ref({ companies: [] as Company[] });
const selected = ref({ companies: [] as number[] });
const isSubmitting = ref(false); // ✅ 추가

/* 페이지네이션 상태 */
const page = ref(0);
const size = ref(10);
const loading = ref(false);
const hasMore = ref(true);
const sentinelRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

/* 에러 */
const errors = ref<{ companies?: string; email?: string; nickname?: string; submit?: string }>({});

/* computed */
const allCompanyIds = computed(() => options.value.companies.map(c => c.id));
const isAllSelected = computed(() =>
  allCompanyIds.value.length > 0 && selected.value.companies.length === allCompanyIds.value.length
);
const companyById = computed(() => {
  const m = new Map<number, Company>();
  for (const c of options.value.companies) m.set(c.id, c);
  return m;
});

/* 드롭다운 상태 */
const openDropdown = ref(false);
const close = () => emit("update:modelValue", false);

/* 회사 선택 관련 */
const toggleCompany = (id: number) => {
  const set = new Set(selected.value.companies);
  set.has(id) ? set.delete(id) : set.add(id);
  selected.value.companies = Array.from(set);
  errors.value.companies = selected.value.companies.length ? undefined : "회사를 1개 이상 선택해주세요.";
};
const removeCompany = (id: number) => {
  selected.value.companies = selected.value.companies.filter(v => v !== id);
};
const labelById = (id: number) => {
  const c = options.value.companies.find(c => c.id === id);
  return c ? `${c.nameKr} (${c.nameEn})` : String(id);
};

/* 전체 선택 */
const toggleSelectAll = async () => {
  if (isAllSelected.value) {
    selected.value.companies = [];
  } else {
    const all = await fetchAllCompanies(size.value);
    selected.value.companies = all.map(c => c.id);
    options.value.companies = all;
    hasMore.value = false;
  }
  errors.value.companies = selected.value.companies.length ? undefined : "회사를 1개 이상 선택해주세요.";
};

/* API 호출 + 무한 스크롤 */
const loadMore = async () => {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  const { items, hasMore: nextHasMore, nextPage } = await fetchCompaniesPage(page.value, size.value);
  const exist = new Set(options.value.companies.map(c => c.id));
  options.value.companies.push(...items.filter(c => !exist.has(c.id)));
  hasMore.value = nextHasMore;
  page.value = nextPage ?? page.value;
  loading.value = false;
};

/* 옵저버 설정 */
watch(openDropdown, async (open) => {
  if (open) {
    if (options.value.companies.length === 0) await loadMore();
    await nextTick();
    if (sentinelRef.value) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((e) => e.isIntersecting && loadMore());
      }, { root: document.querySelector(".dropdown-menu") as Element || undefined, threshold: 0.2 });
      observer.observe(sentinelRef.value);
    }
  } else {
    if (observer && sentinelRef.value) observer.unobserve(sentinelRef.value);
  }
});

/* 이메일/닉네임 검증 */
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateEmail = () => {
  if (!form.value.email.trim()) return (errors.value.email = "이메일을 입력해주세요.");
  if (!emailRe.test(form.value.email.trim())) return (errors.value.email = "올바른 이메일 형식이 아닙니다.");
  errors.value.email = undefined;
};
const validateNickname = () => {
  if (!form.value.nickname.trim()) return (errors.value.nickname = "닉네임을 입력해주세요.");
  errors.value.nickname = undefined;
};
const validateCompanies = () => {
  if (selected.value.companies.length === 0) return (errors.value.companies = "회사를 1개 이상 선택해주세요.");
  errors.value.companies = undefined;
};

/* 전체 검증 및 제출 */
const validateAll = () => {
  validateEmail(); validateNickname(); validateCompanies();
  return !errors.value.email && !errors.value.nickname && !errors.value.companies;
};

const submit = async () => {
  errors.value.submit = undefined;
  if (!validateAll()) return;

  const payload = {
    companyIds: selected.value.companies,
    email: form.value.email.trim(),
    nickname: form.value.nickname.trim(),
  };

  try {
    isSubmitting.value = true;

    // ✅ API 호출
    await subscribeMember(payload); // subscribeMember는 POST /api/v1/member/subscribe 로 보내는 메서드

    // 상위로 성공 payload 전달 (원래 이벤트 유지)
    emit("submit", payload);

    resetFormAndSelection();

    // 성공 시 모달 닫기
    close();
  } catch (err: any) {
    // 간단한 에러 표시 (원한다면 토스트로 교체)
    errors.value.submit = err?.message ?? "구독 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  } finally {
    isSubmitting.value = false;
  }
};

// ⬇️ 기존 import/상태들 아래 아무 곳에 추가
const resetFormAndSelection = () => {
  form.value.email = "";
  form.value.nickname = "";
  selected.value.companies = [];
  errors.value = {};                 // 에러도 초기화
  openDropdown.value = false;        // 드롭다운 닫기
  // 칩 스크롤 위치 초기화(있으면)
  if (chipsRef.value) chipsRef.value.scrollLeft = 0;
};

</script>

<style scoped>
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.55);
  backdrop-filter: blur(2px);
  display: grid; place-items: center;
  z-index: 1000;
}
.modal {
  width: min(640px, 92vw);
  max-width: 92vw; /* 안전장치 */
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 16px 48px rgba(0,0,0,.28);
  overflow: hidden;
}
.modal-head {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  padding: 16px 56px;
  border-bottom: 1px solid rgba(0,0,0,.06);
}
.modal-head h3 {
  color: #3b332c;               /* 제목 컬러 명시 */
  font-weight: 700;
  font-size: 18px;
  line-height: 1.4;
}
.icon-btn {
  position: absolute; right: 12px; top: 12px;
  width: 36px; height: 36px;
  display: grid; place-items: center;
  border: 1px solid rgba(0,0,0,.12);
  border-radius: 999px;
  background: #fff;
  color: #3b332c;               /* X 아이콘 컬러 명시 */
}
.icon-btn:hover { background: #f6f6f6; }
.icon-btn:active { transform: scale(0.98); }
.icon-btn:focus-visible { outline: 2px solid #c8b89c; outline-offset: 2px; }

.modal-body {
  padding: 20px;
  display: grid;
  gap: 16px;
  grid-auto-rows: min-content; /* 내부 아이템이 줄을 밀어내지 않게 */
}
.field { min-width: 0; }
.label { font-weight: 600; color: #3b332c; }
.label small { font-weight: 400; color: #8b7f73; }

/* 드롭다운 */
.dropdown { position: relative; z-index: 50; min-width: 0; }
.dropdown-toggle {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  border: 1px solid #e1d9cc; background: #faf7f2; color: #3b332c;
  border-radius: 10px; padding: 12px 14px; cursor: pointer;
  min-width: 0;
}
.dropdown-menu {
  position: absolute; left: 0; right: 0; top: calc(100% + 6px);
  background: #fff; border: 1px solid #e1d9cc; border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,.12);
  padding: 8px; display: grid; gap: 4px;
  max-height: 240px; overflow: auto; z-index: 60;
  color: #000;
}
.option { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; cursor: pointer; }
.option:hover { background: #faf7f2; }
.option-all { background: #fffdf8; }
.option-all:hover { background: #f7efe0; }
.divider { height: 1px; background: #f0ece6; margin: 4px 6px; }

.cb { position: absolute; opacity: 0; width: 0; height: 0; }
.box {
  width: 18px; height: 18px;
  border: 2px solid #1f1f1f; border-radius: 4px; background: #fff;
  display: inline-block; position: relative;
}
.cb:checked + .box { background: #3b332c; border-color: #3b332c; }
.cb:checked + .box::after {
  content: ""; position: absolute; left: 4px; top: 2px;
  width: 8px; height: 4px; border: 2px solid #fff;
  border-top: 0; border-right: 0; transform: rotate(-45deg);
}

/* 칩: 한 줄 유지 + 내부 가로 스크롤 + 드래그 슬라이드 */
.chips {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 6px 2px;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x proximity;
  position: relative;
  z-index: 1;
  user-select: none;
  touch-action: pan-x;
  scrollbar-width: none;
  overscroll-behavior-x: contain;
  -ms-overflow-style: none;
}
.chips::-webkit-scrollbar { display: none; }
.chips.dragging { cursor: grabbing; }
.chips:not(.dragging) { cursor: grab; }

/* 칩 아이템 */
.chip {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #fffdf8;
  border: 1px solid #e1d9cc;
  scroll-snap-align: start;
  color: #000;
}
.chips-placeholder { color: #b4a393; font-size: 13px; padding-left: 4px; }
.chip-x { background: none; border: 0; cursor: pointer; color: #6a5f55; }
.chip-thumb {
  width: 18px; height: 18px;
  border-radius: 4px; object-fit: cover;
  flex: 0 0 18px;
}
.chip-text {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

/* 썸네일 */
.company-thumb {
  width: 20px; height: 20px;
  border-radius: 4px; object-fit: cover;
}

/* 인풋 */
.input {
  width: 100%;
  border: 1px solid #e1d9cc;
  background: #faf7f2;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 14px;
  min-width: 0;
  color: #3b332c;        /* ✅ 입력 텍스트 컬러 */
  caret-color: #3b332c;  /* 커서 컬러 */
}
.input::placeholder { color: #8b7f73; }
.input.is-invalid, .dropdown.is-invalid .dropdown-toggle {
  border-color: #d96060; box-shadow: 0 0 0 3px rgba(217,96,96,.18);
  background: #fff7f7;
}

/* 에러 텍스트 */
.error-text { color: #c64a4a; font-size: 13px; }

/* 버튼 */
.primary {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #bca98c;
  background: #e7d7c1;
  color: #3b332c;
  font-weight: 700;
  cursor: pointer;
}
.primary[disabled] { opacity: .6; cursor: not-allowed; }
.primary:hover:not([disabled]) { background: #d8c7af; }
</style>
