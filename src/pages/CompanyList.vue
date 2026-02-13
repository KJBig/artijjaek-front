<template>
  <div class="page">
    <main class="main">
      <section class="panel" aria-labelledby="company-list-title">
        <header class="head">
          <h1 id="company-list-title" class="title">지원하는 회사 리스트</h1>
          <p class="desc">현재 구독 가능한 회사입니다.</p>
          <p class="desc">카드를 클릭하면 해당 회사의 블로그로 이동합니다.</p>
          <p v-if="isDummyData" class="dummy-notice">
            샘플 화면 확인용 더미 데이터가 표시되고 있습니다.
          </p>
        </header>

        <p v-if="loading" class="state">회사 목록을 불러오는 중입니다...</p>
        <p v-else-if="!companies.length" class="state">표시할 회사가 없습니다.</p>

        <ul v-else class="grid">
          <li v-for="company in companies" :key="company.id" class="card">
            <a
              v-if="company.blogUrl"
              :href="company.blogUrl"
              class="card-link"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`${company.nameKr} 블로그 새 창으로 열기`"
            >
              <img
                v-if="company.image"
                :src="company.image"
                :alt="`${company.nameKr} 로고`"
                class="logo"
                loading="lazy"
              />
              <div v-else class="logo placeholder" aria-hidden="true">
                {{ company.nameKr.slice(0, 1) }}
              </div>

              <div class="meta">
                <strong class="name-kr">{{ company.nameKr }}</strong>
                <span class="name-en">{{ company.nameEn }}</span>
              </div>
            </a>
            <div v-else class="card-link card-link-disabled" aria-disabled="true">
              <img
                v-if="company.image"
                :src="company.image"
                :alt="`${company.nameKr} 로고`"
                class="logo"
                loading="lazy"
              />
              <div v-else class="logo placeholder" aria-hidden="true">
                {{ company.nameKr.slice(0, 1) }}
              </div>

              <div class="meta">
                <strong class="name-kr">{{ company.nameKr }}</strong>
                <span class="name-en">{{ company.nameEn }}</span>
              </div>
            </div>
          </li>
          <li
            v-for="slot in emptySlots"
            :key="`empty-slot-${currentPage}-${slot}`"
            class="card card-empty"
            aria-hidden="true"
          ></li>
        </ul>

        <div v-if="!loading && totalPages > 0" class="pagination">
          <button
            class="page-btn"
            type="button"
            :disabled="isFirstPage || loading"
            @click="goPrevPage"
          >
            이전
          </button>
          <p class="page-info">
            {{ currentPage + 1 }} / {{ totalPages }} 페이지
          </p>
          <button
            class="page-btn"
            type="button"
            :disabled="isLastPage || loading"
            @click="goNextPage"
          >
            다음
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { fetchCompaniesPage, type Company } from "../services/companyApi";

const companies = ref<Company[]>([]);
const loading = ref(true);
const isDummyData = ref(false);
const currentPage = ref(0);
const totalPages = ref(1);
const apiIsFirstPage = ref(true);
const apiIsLastPage = ref(true);
const PAGE_SIZE = 12;

const DUMMY_COMPANIES: Company[] = [
  { id: 9001, image: "", nameKr: "카카오", nameEn: "Kakao", blogUrl: "https://tech.kakao.com" },
  { id: 9002, image: "", nameKr: "네이버", nameEn: "NAVER", blogUrl: "https://d2.naver.com" },
  { id: 9003, image: "", nameKr: "토스", nameEn: "Toss", blogUrl: "https://toss.tech" },
  { id: 9004, image: "", nameKr: "당근", nameEn: "Danggeun", blogUrl: "https://medium.com/daangn" },
  { id: 9005, image: "", nameKr: "라인", nameEn: "LINE", blogUrl: "https://engineering.linecorp.com/ko" },
  { id: 9006, image: "", nameKr: "우아한형제들", nameEn: "Woowa Brothers", blogUrl: "https://techblog.woowahan.com" },
  { id: 9007, image: "", nameKr: "쿠팡", nameEn: "Coupang", blogUrl: "https://medium.com/coupang-tech" },
  { id: 9008, image: "", nameKr: "무신사", nameEn: "MUSINSA", blogUrl: "https://medium.com/musinsa-tech" },
];

const isFirstPage = computed(() =>
  isDummyData.value ? currentPage.value <= 0 : apiIsFirstPage.value
);
const isLastPage = computed(() =>
  isDummyData.value ? currentPage.value >= totalPages.value - 1 : apiIsLastPage.value
);
const emptySlots = computed(() => Math.max(PAGE_SIZE - companies.value.length, 0));

async function loadCompanies(page: number) {
  loading.value = true;
  const livePage = await fetchCompaniesPage(page, PAGE_SIZE);

  if (livePage.items.length > 0 || livePage.totalElements > 0) {
    companies.value = livePage.items;
    currentPage.value = livePage.page;
    totalPages.value = Math.max(1, livePage.totalPages);
    apiIsFirstPage.value = livePage.isFirst;
    apiIsLastPage.value = livePage.isLast;
    isDummyData.value = false;
  } else {
    totalPages.value = Math.max(1, Math.ceil(DUMMY_COMPANIES.length / PAGE_SIZE));
    currentPage.value = Math.min(Math.max(page, 0), totalPages.value - 1);
    const start = currentPage.value * PAGE_SIZE;
    companies.value = DUMMY_COMPANIES.slice(start, start + PAGE_SIZE);
    apiIsFirstPage.value = currentPage.value <= 0;
    apiIsLastPage.value = currentPage.value >= totalPages.value - 1;
    isDummyData.value = true;
  }

  loading.value = false;
}

function goPrevPage() {
  if (isFirstPage.value) return;
  loadCompanies(currentPage.value - 1);
}

function goNextPage() {
  if (isLastPage.value) return;
  loadCompanies(currentPage.value + 1);
}

onMounted(async () => {
  await loadCompanies(0);
});
</script>

<style scoped>
.page {
  min-height: calc(100svh - 72px);
  background: #f8f9ff;
}

.main {
  max-width: 1080px;
  margin: 0 auto;
  padding: 36px 24px 56px;
}

.panel {
  background: #fff;
  border: 1px solid rgba(118, 82, 201, 0.15);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(36, 26, 87, 0.06);
}

.head {
  margin-bottom: 20px;
}

.title {
  margin: 0;
  font-size: 28px;
  color: #2f2c3d;
}

.desc {
  margin: 8px 0 0;
  font-size: 15px;
  color: #66617a;
}

.dummy-notice {
  margin: 10px 0 0;
  font-size: 13px;
  font-weight: 700;
  color: #5746c7;
}

.state {
  margin: 20px 0 0;
  font-size: 15px;
  color: #5d5772;
}

.grid {
  list-style: none;
  margin: 20px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}

.card {
  display: block;
  min-height: 70px;
  border: 1px solid rgba(118, 82, 201, 0.14);
  border-radius: 14px;
  background: linear-gradient(135deg, #ffffff 0%, #f7f8ff 100%);
}

.card-empty {
  visibility: hidden;
}

.card-link {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 70px;
  padding: 12px;
  box-sizing: border-box;
  color: inherit;
  text-decoration: none;
  border-radius: 14px;
}

.card-link:hover {
  background: linear-gradient(135deg, rgba(102, 117, 224, 0.08) 0%, rgba(118, 82, 201, 0.1) 100%);
}

.card-link-disabled {
  opacity: 0.7;
  cursor: default;
}

.logo {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid rgba(118, 82, 201, 0.16);
  background: #fff;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #5746c7;
  background: rgba(118, 82, 201, 0.1);
}

.meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.name-kr {
  color: #322f44;
  font-size: 15px;
  line-height: 1.3;
}

.name-en {
  color: #7b7690;
  font-size: 12px;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.page-btn {
  min-width: 72px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(118, 82, 201, 0.35);
  background: #fff;
  color: #4b3ec2;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.45;
  cursor: default;
}

.page-info {
  margin: 0;
  min-width: 168px;
  text-align: center;
  color: #4a4561;
  font-size: 14px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .main {
    padding: 20px 14px 40px;
  }

  .panel {
    padding: 18px;
    border-radius: 16px;
  }

  .title {
    font-size: 22px;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .pagination {
    gap: 8px;
  }

  .page-info {
    min-width: 140px;
    font-size: 13px;
  }
}
</style>
