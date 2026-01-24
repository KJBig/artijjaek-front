<template>
  <div class="page">
    <main class="main">
      <section class="panel" role="form" aria-labelledby="page-title">
        <header class="panel-head">
          <h1 id="page-title" class="title">아티짹 구독 등록</h1>
          <p class="subtitle">관심 있는 회사를 선택하고 이메일로 구독 알림을 받아보세요.</p>
        </header>

        <div class="panel-body">
          <!-- ================= 회사 선택 ================= -->
          <div class="field">
            <span class="label">회사 <small>중복 선택 가능</small></span>

            <!-- ✅ 열릴 때만 z-index 상승 -->
            <div class="dropdown" :class="{ 'is-invalid': errors.companies, 'is-open': openDropdown }">
              <button
                ref="toggleRef"
                class="dropdown-toggle"
                type="button"
                :aria-expanded="openDropdown ? 'true' : 'false'"
                aria-haspopup="listbox"
                @click="toggleDropdown"
              >
                <span v-if="selected.companies.length === 0" class="placeholder">선택하세요</span>
                <span v-else class="summary">{{ selected.companies.length }}개 선택됨</span>
                <svg class="chev" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>

              <!-- 드롭다운 메뉴 -->
              <div
                v-show="openDropdown"
                ref="menuRef"
                class="dropdown-menu"
                role="listbox"
                :aria-activedescendant="undefined"
              >
                <!-- 전체 선택 -->
                <label class="option option-all">
                  <input class="cb" type="checkbox" :checked="isAllSelectedCompanies" @change="toggleSelectAllCompanies" />
                  <span class="box" aria-hidden="true"></span>
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
                  <span class="box" aria-hidden="true"></span>
                  <img :src="c.image" alt="" class="company-thumb" />
                  <span class="option-label">{{ c.nameKr }}</span>
                </label>

                <!-- 무한 스크롤 -->
                <div class="loader" v-if="loadingCompanies">불러오는 중...</div>
                <div ref="sentinelRef" class="sentinel" v-show="hasMoreCompanies && !loadingCompanies" />
              </div>
            </div>

            <p v-if="errors.companies" class="error-text">{{ errors.companies }}</p>

            <!-- 칩 (회사) -->
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
                  <img v-if="companyById.get(id)?.image" :src="companyById.get(id)?.image" alt="" class="chip-thumb" />
                  <span class="chip-text">
                    {{ companyById.get(id)?.nameKr }}
                  </span>
                  <button
                    class="chip-x"
                    type="button"
                    @click.stop.prevent="removeCompany(id)"
                    aria-label="삭제"
                    title="삭제"
                  >✕</button>
                </span>
              </template>
              <span v-else class="chips-placeholder">선택한 회사가 여기에 표시됩니다</span>
            </div>
          </div>

          <!-- ================= 카테고리 선택 (회사와 동일 구조) ================= -->
          <div class="field">
            <span class="label">카테고리 <small>중복 선택 가능</small></span>

            <!-- ✅ 열릴 때만 z-index 상승 (서로 간섭 없도록) -->
            <div class="dropdown" :class="{ 'is-invalid': errors.categories, 'is-open': openCategoryDropdown }">
              <button
                ref="toggleRefCat"
                class="dropdown-toggle"
                type="button"
                :aria-expanded="openCategoryDropdown ? 'true' : 'false'"
                aria-haspopup="listbox"
                @click="toggleCategoryDropdown"
              >
                <span v-if="selected.categories.length === 0" class="placeholder">선택하세요</span>
                <span v-else class="summary">{{ selected.categories.length }}개 선택됨</span>
                <svg class="chev" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>

              <!-- 드롭다운 메뉴 -->
              <div
                v-show="openCategoryDropdown"
                ref="menuRefCat"
                class="dropdown-menu"
                role="listbox"
                :aria-activedescendant="undefined"
              >
                <!-- 전체 선택 (페이징 반복 호출로 전량 로드) -->
                <label class="option option-all">
                  <input class="cb" type="checkbox" :checked="isAllSelectedCategories" @change="toggleSelectAllCategories" />
                  <span class="box" aria-hidden="true"></span>
                  <span class="option-label"><strong>전체 선택</strong></span>
                </label>

                <div class="divider" role="separator"></div>

                <!-- 개별 카테고리 -->
                <label v-for="c in options.categories" :key="c.id" class="option">
                  <input
                    class="cb"
                    type="checkbox"
                    :value="c.id"
                    :checked="selected.categories.includes(c.id)"
                    @change="toggleCategory(c.id)"
                  />
                  <span class="box" aria-hidden="true"></span>
                  <span class="option-label">{{ c.name }}</span>
                </label>

                <!-- 무한 스크롤 -->
                <div class="loader" v-if="loadingCategories">불러오는 중...</div>
                <div ref="sentinelRefCat" class="sentinel" v-show="hasMoreCategories && !loadingCategories" />
              </div>
            </div>

            <p v-if="errors.categories" class="error-text">{{ errors.categories }}</p>

            <!-- 칩 (카테고리) -->
            <div
              class="chips"
              ref="chipsRef2"
              role="list"
              aria-label="선택한 카테고리 목록 (가로 스크롤 가능)"
              tabindex="0"
              @click.capture="onChipsClickCapture2"
              @pointerdown="onPointerDown2"
              @pointermove="onPointerMove2"
              @pointerup="endDrag2"
              @pointercancel="endDrag2"
              @mouseleave="endDrag2"
            >
              <template v-if="selected.categories.length">
                <span v-for="id in selected.categories" :key="id" class="chip" role="listitem">
                  <img v-if="categoryById.get(id)?.image" :src="categoryById.get(id)?.image" alt="" class="chip-thumb" />
                  <span class="chip-text">
                    {{ categoryById.get(id)?.name }}
                  </span>
                  <button
                    class="chip-x"
                    type="button"
                    @click.stop.prevent="removeCategory(id)"
                    aria-label="삭제"
                    title="삭제"
                  >✕</button>
                </span>
              </template>
              <span v-else class="chips-placeholder">선택한 카테고리가 여기에 표시됩니다</span>
            </div>
          </div>

          <!-- ================= 이메일 ================= -->
          <div class="field field--email">
            <label class="label" for="email">이메일</label>
            <div class="input-row">
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="input"
                :class="{ 'is-invalid': errors.email }"
                placeholder="ex) example@email.com"
                @blur="validateEmail"
              />
            </div>
            <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
          </div>

          <!-- ================= 닉네임 ================= -->
          <div class="field">
            <label class="label" for="nickname">닉네임</label>
            <input
              id="nickname"
              v-model="form.nickname"
              type="text"
              class="input"
              :class="{ 'is-invalid': errors.nickname }"
              placeholder="ex) 준커"
              @blur="validateNickname"
            />
            <p v-if="errors.nickname" class="error-text">{{ errors.nickname }}</p>
          </div>

          <!-- ================= 제출 ================= -->
          <button
            class="primary"
            type="button"
            :disabled="isSubmitting"
            @click="submit"
            title="확인"
          >
            <span v-if="isSubmitting">처리 중…</span>
            <span v-else>확인</span>
          </button>

          <p v-if="errors.submit" class="submit-error" role="alert">{{ errors.submit }}</p>
        </div>
      </section>

      <!-- ✅ 성공 팝업 -->
      <SuccessPopup
        v-if="popup.open"
        :title="popup.title"
        :message="popup.message"
        :redirect-to="popup.redirectTo"
        @close="popup.open = false"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from "vue";
import { fetchCompaniesPage as fetchCompanyPage, fetchAllCompanies, type Company } from "../services/companyApi";
import { fetchCategoriesPage as fetchCategoryPage } from "../services/categoryApi";
import { subscribeMember } from "../services/memberApi";
import SuccessPopup from "../components/SuccessPopup.vue";

/** 카테고리 타입 (id/name/image 정도만 사용) */
type Category = { id: number; name: string; image?: string };

/* 상태 */
const form = ref({ email: "", nickname: "" });
const options = ref<{ companies: Company[]; categories: Category[] }>({ companies: [], categories: [] });
const selected = ref<{ companies: number[]; categories: number[] }>({ companies: [], categories: [] });
const isSubmitting = ref(false);

/* ✅ 팝업 상태 */
const popup = ref<{ open: boolean; title: string; message: string, redirectTo?: string }>({
  open: false,
  title: "구독 등록 완료",
  message: "구독 등록이 완료되었습니다.\n 곧 안내 메일이 도착할 예정이니 메일을 확인해주세요!",
});

/* ============ 회사: 페이지네이션 상태/참조 ============ */
const pageCompanies = ref(0);
const sizeCompanies = ref(10);
const loadingCompanies = ref(false);
const hasMoreCompanies = ref(true);
const sentinelRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const toggleRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

/* ============ 카테고리: 페이지네이션 상태/참조 ============ */
const pageCategories = ref(0);
const sizeCategories = ref(10);
const loadingCategories = ref(false);
const hasMoreCategories = ref(true);
const sentinelRefCat = ref<HTMLElement | null>(null);
const menuRefCat = ref<HTMLElement | null>(null);
const toggleRefCat = ref<HTMLElement | null>(null);
let observerCat: IntersectionObserver | null = null;

/* 드롭다운 열림 */
const openDropdown = ref(false);
const openCategoryDropdown = ref(false);

/* ===== 회사 드롭다운 ===== */
const onWindowClickCompanies = (e: MouseEvent) => {
  const t = e.target as Node;
  if (menuRef.value?.contains(t) || toggleRef.value?.contains(t)) return;
  openDropdown.value = false;
  cleanupDropdownCompanies();
};
const toggleDropdown = async () => {
  openDropdown.value = !openDropdown.value;
  if (openDropdown.value) {
    if (options.value.companies.length === 0) await loadMoreCompanies();
    await nextTick();
    if (sentinelRef.value) {
      observer = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && loadMoreCompanies()),
        { root: menuRef.value ?? undefined, threshold: 0.2 }
      );
      observer.observe(sentinelRef.value);
    }
    window.addEventListener("click", onWindowClickCompanies, { capture: true });
  } else {
    cleanupDropdownCompanies();
  }
};
const cleanupDropdownCompanies = () => {
  if (observer && sentinelRef.value) observer.unobserve(sentinelRef.value);
  observer = null;
  window.removeEventListener("click", onWindowClickCompanies, { capture: true } as any);
};

/* ===== 카테고리 드롭다운 ===== */
const onWindowClickCategories = (e: MouseEvent) => {
  const t = e.target as Node;
  if (menuRefCat.value?.contains(t) || toggleRefCat.value?.contains(t)) return;
  openCategoryDropdown.value = false;
  cleanupDropdownCategories();
};
const toggleCategoryDropdown = async () => {
  openCategoryDropdown.value = !openCategoryDropdown.value;
  if (openCategoryDropdown.value) {
    if (options.value.categories.length === 0) await loadMoreCategories();
    await nextTick();
    if (sentinelRefCat.value) {
      observerCat = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && loadMoreCategories()),
        { root: menuRefCat.value ?? undefined, threshold: 0.2 }
      );
      observerCat.observe(sentinelRefCat.value);
    }
    window.addEventListener("click", onWindowClickCategories, { capture: true });
  } else {
    cleanupDropdownCategories();
  }
};
const cleanupDropdownCategories = () => {
  if (observerCat && sentinelRefCat.value) observerCat.unobserve(sentinelRefCat.value);
  observerCat = null;
  window.removeEventListener("click", onWindowClickCategories, { capture: true } as any);
};

onBeforeUnmount(() => {
  cleanupDropdownCompanies();
  cleanupDropdownCategories();
});

/* 에러 */
const errors = ref<{ companies?: string; categories?: string; email?: string; nickname?: string; submit?: string }>({});

/* computed */
const allCompanyIds = computed(() => options.value.companies.map((c) => c.id));
const isAllSelectedCompanies = computed(
  () => allCompanyIds.value.length > 0 && selected.value.companies.length === allCompanyIds.value.length
);
const companyById = computed(() => {
  const m = new Map<number, Company>();
  for (const c of options.value.companies) m.set(c.id, c);
  return m;
});

const allCategoryIds = computed(() => options.value.categories.map((c) => c.id));
const isAllSelectedCategories = computed(
  () => allCategoryIds.value.length > 0 && selected.value.categories.length === allCategoryIds.value.length
);
const categoryById = computed(() => {
  const m = new Map<number, Category>();
  for (const c of options.value.categories) m.set(c.id, c);
  return m;
});

/* 이메일 유효성 */
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ===== 회사 선택 ===== */
const toggleCompany = (id: number) => {
  const set = new Set(selected.value.companies);
  set.has(id) ? set.delete(id) : set.add(id);
  selected.value.companies = Array.from(set);
  errors.value.companies = selected.value.companies.length ? undefined : "회사를 1개 이상 선택해주세요.";
};
const removeCompany = (id: number) => {
  selected.value.companies = selected.value.companies.filter((v) => v !== id);
  errors.value.companies = selected.value.companies.length ? undefined : "회사를 1개 이상 선택해주세요.";
};

/* ===== 카테고리 선택 ===== */
const toggleCategory = (id: number) => {
  const set = new Set(selected.value.categories);
  set.has(id) ? set.delete(id) : set.add(id);
  selected.value.categories = Array.from(set);
  errors.value.categories = selected.value.categories.length ? undefined : "카테고리를 1개 이상 선택해주세요.";
};
const removeCategory = (id: number) => {
  selected.value.categories = selected.value.categories.filter((v) => v !== id);
  errors.value.categories = selected.value.categories.length ? undefined : "카테고리를 1개 이상 선택해주세요.";
};

/* ===== 전체 선택: 회사 ===== */
const toggleSelectAllCompanies = async () => {
  if (isAllSelectedCompanies.value) {
    selected.value.companies = [];
  } else {
    const all = await fetchAllCompanies(sizeCompanies.value);
    selected.value.companies = all.map((c) => c.id);
    options.value.companies = all;
    hasMoreCompanies.value = false;
  }
  errors.value.companies = selected.value.companies.length ? undefined : "회사를 1개 이상 선택해주세요.";
};

/* ===== 전체 선택: 카테고리 (페이징 반복 호출) ===== */
const fetchAllCategoriesViaPaging = async () => {
  const seen = new Set<number>();
  const acc: Category[] = [];
  let p = 0;
  let more = true;
  let guard = 0;

  while (more && guard < 1000) {
    const { items, hasMore, nextPage } = await fetchCategoryPage(p, sizeCategories.value);
    for (const it of items) {
      if (!seen.has(it.id)) {
        seen.add(it.id);
        acc.push(it);
      }
    }
    more = !!hasMore;
    if (nextPage == null || nextPage === p) p += 1;
    else p = nextPage;
    guard++;
  }
  return acc;
};
const toggleSelectAllCategories = async () => {
  if (isAllSelectedCategories.value) {
    selected.value.categories = [];
  } else {
    const all = await fetchAllCategoriesViaPaging();
    selected.value.categories = all.map((c) => c.id);
    options.value.categories = all;
    hasMoreCategories.value = false;
  }
  errors.value.categories = selected.value.categories.length ? undefined : "카테고리를 1개 이상 선택해주세요.";
};

/* ===== API 호출 + 무한 스크롤 ===== */
const loadMoreCompanies = async () => {
  if (loadingCompanies.value || !hasMoreCompanies.value) return;
  loadingCompanies.value = true;
  const { items, hasMore, nextPage } = await fetchCompanyPage(pageCompanies.value, sizeCompanies.value);
  const exist = new Set(options.value.companies.map((c) => c.id));
  options.value.companies.push(...items.filter((c) => !exist.has(c.id)));
  hasMoreCompanies.value = !!hasMore;
  pageCompanies.value = nextPage ?? pageCompanies.value + 1;
  loadingCompanies.value = false;
};
const loadMoreCategories = async () => {
  if (loadingCategories.value || !hasMoreCategories.value) return;
  loadingCategories.value = true;
  const { items, hasMore, nextPage } = await fetchCategoryPage(pageCategories.value, sizeCategories.value);
  const exist = new Set(options.value.categories.map((c) => c.id));
  options.value.categories.push(...items.filter((c) => !exist.has(c.id)));
  hasMoreCategories.value = !!hasMore;
  pageCategories.value = nextPage ?? pageCategories.value + 1;
  loadingCategories.value = false;
};

/* ===== 이메일/닉네임/선택 검증 ===== */
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
const validateCategories = () => {
  if (selected.value.categories.length === 0) return (errors.value.categories = "카테고리를 1개 이상 선택해주세요.");
  errors.value.categories = undefined;
};
const validateAll = () => {
  validateEmail();
  validateNickname();
  validateCompanies();
  validateCategories();
  return !errors.value.email && !errors.value.nickname && !errors.value.companies && !errors.value.categories;
};

/* ===== 제출 ===== */
const submit = async () => {
  errors.value.submit = undefined;

  if (!validateAll()) return;

  const payload = {
    companyIds: selected.value.companies,
    categoryIds: selected.value.categories,
    email: form.value.email.trim(),
    nickname: form.value.nickname.trim(),
  };

  // 다양한 서비스 구현 형태를 대비한 응답 정규화 헬퍼
  const normalize = async (resp: any) => {
    // 1) fetch Response 그대로 반환하는 경우
    if (resp && typeof resp === "object" && "ok" in resp && "status" in resp) {
      const httpStatus = resp.status as number;
      let data: any = null;
      try { data = await resp.json(); } catch {}
      return {
        ok: Boolean(resp.ok),                // ✅ 2xx 여부
        isSuccess: Boolean(data?.isSuccess), // 서버 바디 기준 성공 플래그
        message: data?.message,
        httpStatus,
      };
    }

    // 2) JSON으로 { isSuccess, message, status } 형태가 오는 경우
    const httpStatus = resp?.status ?? resp?._httpStatus;
    return {
      ok: typeof httpStatus === "number" ? httpStatus >= 200 && httpStatus < 300 : Boolean(resp?.isSuccess),
      isSuccess: Boolean(resp?.isSuccess),
      message: resp?.message,
      httpStatus,
    };
  };

  const openSuccessPopup = () => {
  popup.value = {
    open: true,
    title: "구독 등록 완료",
    message: "곧 안내 메일이 도착할 예정이니 메일을 확인해주세요!",
    redirectTo: "/",
  };
};

const openErrorPopup = (msg: string) => {
  popup.value = {
    open: true,
    title: "구독 등록 실패",
    message: msg,
    redirectTo: undefined, // ✅ 실패면 이동 안 함
  };
};


  try {
    isSubmitting.value = true;

    const raw = await subscribeMember(payload);
    const { ok, isSuccess, message, httpStatus } = await normalize(raw);

    // ✅ 200(2xx) 이외면 무조건 팝업으로 알림
    if (!ok) {
      const msg =
        message ??
        (httpStatus ? `요청이 실패했습니다. (HTTP ${httpStatus})` : "요청이 실패했습니다.");
      openErrorPopup(msg);
      return;
    }

    // ✅ 2xx인데도 isSuccess=false인 케이스도 팝업으로 처리(원하면 유지/변경 가능)
    if (!isSuccess) {
      const msg = message ?? "요청이 실패했습니다.";
      openErrorPopup(msg);
      return;
    }

    // ✅ 성공: 팝업 열고 초기화
    openSuccessPopup();
    resetFormAndSelection();

  } catch (err: any) {
    // 네트워크/예외도 팝업으로
    openErrorPopup(
      err?.message ?? "구독 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
    );
  } finally {
    isSubmitting.value = false;
  }
};

const resetFormAndSelection = () => {
  form.value.email = "";
  form.value.nickname = "";
  selected.value.companies = [];
  selected.value.categories = [];
  errors.value = {};
  if (chipsRef.value) chipsRef.value.scrollLeft = 0;
  if (chipsRef2.value) chipsRef2.value.scrollLeft = 0;
};

/* ===== 칩 드래그 스크롤 (회사) - 클릭과 충돌 방지 ===== */
const chipsRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const preparedForDrag = ref(false);
let pointerId: number | null = null;
let startX = 0;
let startScrollLeft = 0;
let moved = false;
let captured = false;
const DRAG_THRESHOLD = 3;

const isInteractive = (el: HTMLElement | null): boolean => {
  if (!el) return false;
  return !!el.closest('.chip-x, button, a, input, textarea, select, [role="button"], [contenteditable=""], .dropdown-toggle');
};

const onPointerDown = (e: PointerEvent) => {
  if (!chipsRef.value) return;
  if (e.button !== 0 && e.pointerType === "mouse") return;
  const target = e.target as HTMLElement | null;
  if (isInteractive(target)) return;

  preparedForDrag.value = true;
  isDragging.value = false;
  moved = false;
  captured = false;
  pointerId = e.pointerId;

  startX = e.clientX;
  startScrollLeft = chipsRef.value.scrollLeft;
  chipsRef.value.classList.add("dragging");
};
const onPointerMove = (e: PointerEvent) => {
  if (!chipsRef.value || !preparedForDrag.value) return;
  const dx = e.clientX - startX;
  if (!isDragging.value && Math.abs(dx) > DRAG_THRESHOLD) {
    isDragging.value = true;
    moved = true;
    if (pointerId != null && !captured) {
      chipsRef.value.setPointerCapture(pointerId);
      captured = true;
    }
  }
  if (isDragging.value) chipsRef.value.scrollLeft = startScrollLeft - dx;
};
const endDrag = () => {
  if (!chipsRef.value) return;
  if (captured && pointerId != null) chipsRef.value.releasePointerCapture?.(pointerId);
  chipsRef.value.classList.remove("dragging");
  preparedForDrag.value = false;
  isDragging.value = false;
  pointerId = null;
};
const onChipsClickCapture = (e: Event) => {
  const target = e.target as HTMLElement | null;
  if (isInteractive(target)) { moved = false; return; }
  if (moved) { e.stopPropagation(); e.preventDefault(); }
  moved = false;
};

/* ===== 칩 드래그 스크롤 (카테고리) - 독립 핸들러 ===== */
const chipsRef2 = ref<HTMLElement | null>(null);
const isDragging2 = ref(false);
const preparedForDrag2 = ref(false);
let pointerId2: number | null = null;
let startX2 = 0;
let startScrollLeft2 = 0;
let moved2 = false;
let captured2 = false;

const onPointerDown2 = (e: PointerEvent) => {
  if (!chipsRef2.value) return;
  if (e.button !== 0 && e.pointerType === "mouse") return;
  const target = e.target as HTMLElement | null;
  if (isInteractive(target)) return;

  preparedForDrag2.value = true;
  isDragging2.value = false;
  moved2 = false;
  captured2 = false;
  pointerId2 = e.pointerId;

  startX2 = e.clientX;
  startScrollLeft2 = chipsRef2.value.scrollLeft;
  chipsRef2.value.classList.add("dragging");
};
const onPointerMove2 = (e: PointerEvent) => {
  if (!chipsRef2.value || !preparedForDrag2.value) return;
  const dx = e.clientX - startX2;
  if (!isDragging2.value && Math.abs(dx) > DRAG_THRESHOLD) {
    isDragging2.value = true;
    moved2 = true;
    if (pointerId2 != null && !captured2) {
      chipsRef2.value.setPointerCapture(pointerId2);
      captured2 = true;
    }
  }
  if (isDragging2.value) chipsRef2.value.scrollLeft = startScrollLeft2 - dx;
};
const endDrag2 = () => {
  if (!chipsRef2.value) return;
  if (captured2 && pointerId2 != null) chipsRef2.value.releasePointerCapture?.(pointerId2);
  chipsRef2.value.classList.remove("dragging");
  preparedForDrag2.value = false;
  isDragging2.value = false;
  pointerId2 = null;
};
const onChipsClickCapture2 = (e: Event) => {
  const target = e.target as HTMLElement | null;
  if (isInteractive(target)) { moved2 = false; return; }
  if (moved2) { e.stopPropagation(); e.preventDefault(); }
  moved2 = false;
};

onMounted(() => {
  // 페이지 진입 시 첫 페이지 미리 로드 (선택)
  loadMoreCompanies();
  loadMoreCategories();
});
</script>

<style scoped>
/* ===== Layout / Theme ===== */
.page{
  min-height: 90vh;
  background:#ffffff; /* 전체 흰 배경 */
  display:flex; flex-direction:column;
}
.main{
  flex:1; display:grid; place-items:center;
  padding: 40px 16px;
}

/* 패널: 상단 얇은 시그니처 스트립 + 은은한 그림자 */
.panel{
  position: relative;
  width: min(640px, 100%);
  background:#fff;
  border-radius: 16px;
  border: 1px solid #e9e9f1;
  box-shadow: 0 10px 30px rgba(20, 20, 33, .06);
  overflow: hidden;
}
.panel::before{
  content:"";
  position:absolute; left:0; right:0; top:0;
  height:6px;                       /* ▶ 얇은 시그니처 스트립 */
  background: linear-gradient(135deg, #6675E0 0%, #7652C9 100%);
}

/* 헤더 */
.panel-head{
  padding: 24px 24px 12px 24px;
  border-bottom: 1px solid #eeeef5;
}
.title{
  margin:0;
  font-size: 24px; font-weight: 800; line-height:1.3;
  color:#1f1f2b;
}
.subtitle{
  margin-top: 6px; color:#6e6a7e; font-size: 14px;
}

/* 본문: 헤더 구분선과 첫 필드(회사) 사이 간격 = 16px 로 통일 */
.panel-body{
  padding: 16px 24px 24px; /* ⬅ top을 16px로 맞춤 */
  display:grid; gap:16px;  /* 모든 섹션 사이 간격 16px */
  background: linear-gradient(180deg, #ffffff 0%, #fafaff 100%);
}

/* ===== Controls ===== */
.field{ min-width:0; }
.label{ font-weight:700; color:#2a2733; }
.label small{ font-weight:400; color:#8a86a0; }

/* 드롭다운 */
.dropdown{ position:relative; z-index:10; min-width:0; }
.dropdown.is-open{ z-index: 1000; }
.dropdown.is-open .dropdown-menu{ z-index: 1100; }

.dropdown-toggle{
  width:100%; display:flex; align-items:center; justify-content:space-between; gap:10px;
  border:1px solid #deddee;
  background:#fff;
  color:#2b2740;
  border-radius:12px; padding:12px 14px; cursor:pointer;
  transition: box-shadow .2s ease, border-color .2s ease, background .2s ease;
}
.dropdown-toggle:hover{ border-color:#cfcde7; background:#fafaff; }
.dropdown-toggle:focus-visible{ outline:none; box-shadow:0 0 0 3px rgba(118,82,201,.18); }

.placeholder{ color:#8c88a3; }
.summary{ color:#4b42b9; font-weight:700; }
.chev{ flex:0 0 auto; }

.dropdown-menu{
  position:absolute; left:0; right:0; top: calc(100% + 6px);
  background:#fff;
  border:1px solid #e6e5f2;
  border-radius: 12px;
  box-shadow: 0 14px 32px rgba(23, 16, 51, .10);
  padding:8px; display:grid; gap:4px;
  max-height: 260px; overflow:auto;
  z-index: 20;
  color:#2e2b3a;
}
.option{
  display:flex; align-items:center; gap:10px;
  padding:8px 10px; border-radius:10px; cursor:pointer;
}
.option:hover{ background: #f7f6ff; }
.option-all{ background:#fbfaff; border:1px solid rgba(118,82,201,.10); }
.option-all:hover{ background:#f2efff; }
.divider{ height:1px; background: #efeff7; margin:4px 6px; }

.cb{ position:absolute; opacity:0; width:0; height:0; }
.box{
  width:18px; height:18px; border-radius:4px;
  border:2px solid #4b42b9; background:#fff; position:relative;
}
.cb:checked + .box{ background:#4b42b9; border-color:#4b42b9; }
.cb:checked + .box::after{
  content:""; position:absolute; left:2.5px; top:2px;
  width:8px; height:4px; border:2px solid #fff; border-top:0; border-right:0; transform: rotate(-45deg);
}

/* 칩 (가로 스크롤/드래그) */
.chips{
  width:100%; min-width:0;
  display:flex; flex-wrap:nowrap; gap:8px;
  overflow-x:auto; overflow-y:hidden; white-space:nowrap;
  padding:6px 2px; -webkit-overflow-scrolling:touch;
  scroll-snap-type:x proximity; position:relative; user-select:none; touch-action:pan-x;
  scrollbar-width:none; -ms-overflow-style:none;
}
.chips::-webkit-scrollbar{ display:none; }
.chips.dragging{ cursor:grabbing; }
.chips:not(.dragging){ cursor:grab; }
.chips-placeholder{ color:#9a97ad; font-size:13px; padding-left:4px; }

.chip{
  flex:0 0 auto; display:inline-flex; align-items:center; gap:6px;
  padding:6px 10px; border-radius:999px;
  background:#ffffff;
  border:1px solid #e4e3f0;
  scroll-snap-align:start;
  color: #16161a;
}
.chip-thumb{ width:18px; height:18px; border-radius:4px; object-fit:cover; flex:0 0 18px; }
.chip-text{ max-width:180px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color: #16161a;}
.chip-x{ background:none; border:0; cursor:pointer; color:#6e66c6; }

/* 회사/카테고리 썸네일 공통 */
.company-thumb{ width:20px; height:20px; border-radius:4px; object-fit:cover; }

/* 인풋 */
.input{
  width:100%; border:1px solid #deddee;
  background:#fff; border-radius:12px; padding:12px 14px; font-size:14px; min-width:0;
  color:#2b2a33; caret-color:#4b42b9;
}
.input::placeholder{ color:#9a98aa; }
.input.is-invalid, .dropdown.is-invalid .dropdown-toggle{
  border-color:#d96060; box-shadow:0 0 0 3px rgba(217,96,96,.12); background:#fff7f7;
}

/* 이메일 입력 + 버튼 가로 배치 */
.input-row{
  display:flex; gap:8px; align-items:center;
}

/* ✅ 모든 섹션 간격을 grid gap(16px)로 일원화하기 위해 커스텀 마진 제거 */
.field--email { margin-bottom: 0; }

/* 에러 */
.error-text{ color:#b73737; font-size:13px; }

/* 제출 버튼 */
.primary{
  width:100%; padding:12px 14px; border-radius:12px;
  border:1px solid rgba(118,82,201,.0);
  background: linear-gradient(135deg, #6675E0 0%, #7652C9 100%);
  color:#fff; font-weight:800; cursor:pointer;
  box-shadow: 0 10px 24px rgba(102,117,224,.24);
  transition: transform .15s ease, box-shadow .2s ease;
}
.primary:hover:not([disabled]){
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(102,117,224,.32);
}
.primary[disabled]{ opacity:.65; cursor:not-allowed; }

.submit-error{ color:#b03030; font-size:13px; }

/* 반응형 */
@media (max-width: 640px){
  .panel-head{ padding:20px; }
  .panel-body{ padding:16px; } /* 모바일도 동일 간격 유지 */
}
</style>
