<template>
  <teleport to="body">
    <div
      v-show="modelValue"
      class="overlay"
      role="presentation"
      @click.self="close"
    >
      <section
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sub-title"
        @keydown.esc="close"
        ref="dialogRef"
        tabindex="-1"
      >
        <header class="modal-head">
          <h3 id="sub-title">매일메일 구독</h3>
          <button class="icon-btn" aria-label="닫기" type="button" @click="close">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12"
                    fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </header>

        <div class="modal-body">
          <!-- 분야 드롭다운 (다중 선택 + 전체 선택) -->
          <div class="field">
            <span class="label">분야 <small>중복 선택 가능</small></span>

            <div class="dropdown" :class="{ 'is-invalid': errors.categories }">
              <button
                class="dropdown-toggle"
                type="button"
                :aria-expanded="openCat ? 'true' : 'false'"
                @click="openCat = !openCat"
              >
                <span v-if="selected.categories.length === 0" class="placeholder">선택하세요</span>
                <span v-else class="summary">{{ selected.categories.length }}개 선택됨</span>
                <svg class="chev" width="16" height="16" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>

              <!-- ✅ 드롭다운 메뉴 -->
              <div v-show="openCat" class="dropdown-menu" role="listbox">
                <!-- ✅ 전체 선택 -->
                <label class="option option-all">
                  <input
                    class="cb"
                    type="checkbox"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                  />
                  <span class="box" aria-hidden="true"></span>
                  <span class="option-label"><strong>전체 선택</strong></span>
                </label>

                <div class="divider" role="separator"></div>

                <!-- 개별 옵션 -->
                <label
                  v-for="opt in options.categories"
                  :key="opt.id"
                  class="option"
                >
                  <input
                    class="cb"
                    type="checkbox"
                    :value="opt.id"
                    :checked="selected.categories.includes(opt.id)"
                    @change="toggleCategory(opt.id)"
                  />
                  <span class="box" aria-hidden="true"></span>
                  <span class="option-label">{{ opt.label }}</span>
                </label>
              </div>
            </div>

            <!-- 에러 -->
            <p v-if="errors.categories" class="error-text">{{ errors.categories }}</p>

            <!-- ✅ 칩 영역: 항상 렌더링 + 고정 높이 + 스크롤바 숨김 -->
            <div class="chips">
              <template v-if="selected.categories.length">
                <span
                  v-for="id in selected.categories"
                  :key="id"
                  class="chip"
                >
                  {{ labelById(id) }}
                  <button class="chip-x" @click="removeCategory(id)" aria-label="삭제">✕</button>
                </span>
              </template>
              <span v-else class="chips-placeholder">선택한 분야가 여기에 표시됩니다</span>
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
            placeholder="johndoe@gmail.com"
            @blur="validateEmail()"
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
            placeholder="예: 보영님"
            @blur="validateNickname()"
          />
          <p v-if="errors.nickname" class="error-text">{{ errors.nickname }}</p>

          <button class="primary" type="button" @click="submit">확인</button>
        </div>
      </section>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";

interface Props { modelValue: boolean }
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "submit", payload: {
    categories: string[];
    email: string;
    nickname: string;
  }): void;
}>();

const dialogRef = ref<HTMLElement | null>(null);

/* --- 상태 --- */
const form = ref({ email: "", nickname: "" });

const options = ref({
  categories: [] as { id: string; label: string }[],
});

const selected = ref({
  categories: [] as string[],
});

const openCat = ref(false);

/* --- 에러 상태 --- */
const errors = ref<{ categories?: string; email?: string; nickname?: string }>({});

/* --- 유틸 --- */
const allCategoryIds = computed(() => options.value.categories.map(o => o.id));
const isAllSelected = computed(() =>
  allCategoryIds.value.length > 0 &&
  selected.value.categories.length === allCategoryIds.value.length
);

/* --- 드롭다운 동작 --- */
const close = () => emit("update:modelValue", false);

const toggleCategory = (id: string) => {
  const set = new Set(selected.value.categories);
  set.has(id) ? set.delete(id) : set.add(id);
  selected.value.categories = Array.from(set);
  // 선택 변경 시 카테고리 에러 제거
  if (selected.value.categories.length > 0) errors.value.categories = undefined;
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selected.value.categories = [];
  } else {
    selected.value.categories = [...allCategoryIds.value];
  }
  // 전체 선택/해제 후 에러 처리
  errors.value.categories = selected.value.categories.length ? undefined : "분야를 1개 이상 선택해주세요.";
};

const removeCategory = (id: string) => {
  selected.value.categories = selected.value.categories.filter(v => v !== id);
  errors.value.categories = selected.value.categories.length ? undefined : "분야를 1개 이상 선택해주세요.";
};

const labelById = (id: string) =>
  options.value.categories.find(o => o.id === id)?.label ?? id;

/* --- 이메일/닉네임 벨리데이션 --- */
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateCategories = () => {
  if (selected.value.categories.length === 0) {
    errors.value.categories = "분야를 1개 이상 선택해주세요.";
    return false;
  }
  errors.value.categories = undefined;
  return true;
};
const validateEmail = () => {
  if (!form.value.email.trim()) {
    errors.value.email = "이메일을 입력해주세요.";
    return false;
  }
  if (!emailRe.test(form.value.email.trim())) {
    errors.value.email = "올바른 이메일 형식이 아닙니다.";
    return false;
  }
  errors.value.email = undefined;
  return true;
};
const validateNickname = () => {
  if (!form.value.nickname.trim()) {
    errors.value.nickname = "닉네임을 입력해주세요.";
    return false;
  }
  errors.value.nickname = undefined;
  return true;
};

const validateAll = () => {
  const ok1 = validateCategories();
  const ok2 = validateEmail();
  const ok3 = validateNickname();
  return ok1 && ok2 && ok3;
};

/* --- 제출 --- */
const submit = () => {
  if (!validateAll()) return;
  emit("submit", {
    categories: selected.value.categories,
    email: form.value.email.trim(),
    nickname: form.value.nickname.trim()
  });
  close();
};

/* --- 문서 클릭으로 드롭다운 닫기 --- */
const onDocClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest(".dropdown")) openCat.value = false;
};

/* --- 옵션 로드 (실패 시 기본값) --- */
const loadOptions = async () => {
  try {
    const res = await fetch("/api/categories");
    if (res.ok) {
      const data = await res.json();
      options.value.categories = (data?.items ?? []).map((d: any) => ({
        id: String(d.id ?? d.value ?? d.slug),
        label: String(d.label ?? d.name ?? d.title)
      }));
      return;
    }
  } catch {/* noop */}
  options.value.categories = [
    { id: "frontend", label: "프론트엔드" },
    { id: "backend",  label: "백엔드" },
    { id: "mobile",   label: "모바일" },
    { id: "devops",   label: "DevOps" },
    { id: "ai",       label: "AI/ML" },
  ];
};

/* --- 라이프사이클 --- */
watch(() => props.modelValue, (open) => {
  if (open) {
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => dialogRef.value?.focus());
    document.addEventListener("click", onDocClick);
  } else {
    document.documentElement.style.overflow = "";
    document.removeEventListener("click", onDocClick);
    openCat.value = false;
  }
});

onMounted(async () => {
  if (props.modelValue) document.documentElement.style.overflow = "hidden";
  await loadOptions();
});
onBeforeUnmount(() => {
  document.documentElement.style.overflow = "";
  document.removeEventListener("click", onDocClick);
});
</script>

<style scoped>
/* ===== 오버레이 / 모달 ===== */
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.55);
  backdrop-filter: blur(2px);
  display: grid; place-items: center;
  z-index: 1000;
}
.modal {
  width: min(640px, 92vw);
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 16px 48px rgba(0,0,0,.28);
}
.modal-head {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  padding: 16px 56px;
  border-bottom: 1px solid rgba(0,0,0,.06);
}
.modal-head h3 {
  margin: 0; font-size: 18px; font-weight: 700; color: #3b332c;
}
.icon-btn {
  position: absolute; right: 12px; top: 12px;
  width: 36px; height: 36px;
  display: grid; place-items: center;
  border: 1px solid rgba(0,0,0,.12);
  border-radius: 999px;
  background: #fff; color: #3b332c;
  cursor: pointer;
}
.modal-body { padding: 20px; display: grid; gap: 16px; }
.field { display: grid; gap: 10px; }
.label { font-weight: 600; color: #3b332c; display: inline-flex; gap: 6px; align-items: baseline; }
.label small { font-weight: 400; color: #8b7f73; }

/* ===== 드롭다운 (항상 칩 위에) ===== */
.dropdown { position: relative; z-index: 50; }
.dropdown-toggle {
  width: 100%;
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  border: 1px solid #e1d9cc; background: #faf7f2; color: #3b332c;
  border-radius: 10px; padding: 12px 14px; cursor: pointer;
}
.dropdown-toggle .placeholder { color: #b4a393; }
.dropdown-toggle .summary { font-weight: 600; }
.dropdown-toggle .chev { flex: 0 0 auto; color: #6a5f55; }
.dropdown-menu {
  position: absolute; left: 0; right: 0; top: calc(100% + 6px);
  background: #fff; color: #3b332c;
  border: 1px solid #e1d9cc; border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,.12);
  padding: 8px; display: grid; gap: 4px;
  max-height: 240px; overflow: auto;
  z-index: 60;
}
.option { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; cursor: pointer; }
.option:hover { background: #faf7f2; }
.option-all { background: #fffdf8; border-radius: 8px; }
.option-all:hover { background: #f7efe0; }
.divider { height: 1px; background: #f0ece6; margin: 4px 6px; }
.option-label { color: #3b332c; }

/* ===== 커스텀 체크박스 (안정 패턴) ===== */
.cb { position: absolute; opacity: 0; width: 0; height: 0; }
.box {
  width: 18px; height: 18px;
  border: 2px solid #1f1f1f; border-radius: 4px; background: #fff;
  display: inline-block; flex: 0 0 18px; position: relative;
}
.cb:focus-visible + .box { outline: 3px solid rgba(59,51,44,.25); outline-offset: 2px; }
.cb:checked + .box { background: #3b332c; border-color: #3b332c; }
.cb:checked + .box::after {
  content: ""; position: absolute; left: 4px; top: 2px;
  width: 8px; height: 4px;
  border: 2px solid #fff; border-top: 0; border-right: 0;
  transform: rotate(-45deg);
}

/* ===== 칩 영역 (모달 높이 고정 + 스크롤바 숨김) ===== */
.chips {
  display: flex; align-items: center; gap: 8px;
  overflow-x: auto; white-space: nowrap;
  -webkit-overflow-scrolling: touch; scroll-snap-type: x proximity;
  width: 100%; padding: 4px 0;
  min-height: 46px; box-sizing: border-box;
  z-index: 1; /* 드롭다운 아래 */
}
/* 스크롤바 숨김 */
.chips::-webkit-scrollbar { height: 0 !important; display: none !important; }
.chips { scrollbar-width: none; -ms-overflow-style: none; }

.chips-placeholder { color: #b4a393; font-size: 13px; padding-left: 4px; }

.chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 10px; border-radius: 999px;
  background: #fffdf8; color: #3b332c;
  border: 1px solid #e1d9cc; scroll-snap-align: start;
}
.chip-x {
  background: none; border: 0; cursor: pointer; color: #6a5f55;
  font-size: 13px; line-height: 1;
}
.chip-x:hover { color: #3b332c; }

/* ===== 인풋/버튼 & 에러 ===== */
.input {
  width: 100%;
  border: 1px solid #e1d9cc; background: #faf7f2;
  border-radius: 10px; padding: 12px 14px;
  font-size: 14px; color: #3b332c;
  transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
}
.input.is-invalid,
.dropdown.is-invalid .dropdown-toggle {
  border-color: #d96060 !important;
  box-shadow: 0 0 0 3px rgba(217,96,96,.18);
  background: #fff7f7;
}
.error-text {
  margin: 4px 2px 0;
  color: #c64a4a;
  font-size: 13px;
}

.input::placeholder { color: #b4a393; }
.input:focus { outline: none; border-color: #d4c2a6; background: #fffdf8; box-shadow: 0 0 0 3px rgba(231,215,193,.55); }

.primary {
  width: 100%; padding: 12px 14px;
  border-radius: 10px; border: 1px solid #bca98c;
  background: #e7d7c1; color: #3b332c; font-weight: 700; cursor: pointer;
}
.primary:hover { background: #d8c7af; }
</style>
