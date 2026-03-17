<template>
  <div class="landing-page">
    <main>
      <section class="hero">
        <div class="hero-badge">
          <span class="hero-badge-dot"></span>
          현재
          <span class="company-count-inline">
            <span v-if="companyCountLoading" class="company-count-skeleton" aria-hidden="true"></span>
            <span v-else class="company-count-value">{{ companyCountLabel }}</span>개
          </span>
          회사 지원 중
        </div>
        <h1>
          IT 기업의<br />
          <span class="accent">기술 블로그 게시글</span>을<br />
          전달해드려요
        </h1>
        <p>
          관심 있는 회사와 카테고리를 선택하면<br />
          매일 낮 12시, 새 글을 이메일로 받아볼 수 있어요
        </p>
        <div class="hero-actions">
          <button class="btn-hero btn-hero-primary" type="button" @click="goRegister">
            구독하기
          </button>
          <button class="btn-hero btn-hero-secondary" type="button" @click="goCompanyList">
            회사 목록 보기
          </button>
        </div>
        <p class="hero-stat">
          누구나 <strong>무료</strong>로 이용할 수 있어요
        </p>
      </section>

      <section class="mascot-row">
        <div class="mascot-img-wrap" aria-hidden="true">
          <div class="mascot-circle">
            <img src="/logo.png" alt="" class="mascot-logo" />
          </div>
        </div>
        <div class="mascot-text">
          <div class="section-tag">MASCOT</div>
          <h2>
            새 글을 전달하는<br />
            <em>티짹이</em>를 소개해요
          </h2>
          <p>
            아티짹의 마스코트 <strong>티짹이</strong>는 새로 올라온 기술 아티클을 여러분에게
            배달해주는 귀여운 새예요. 매일 낮 12시가 되면 여러분의 메일함을 찾아간답니다.
          </p>
        </div>
      </section>

      <section class="features">
        <div class="section-label">FEATURES</div>
        <h2 class="section-title">이런 특징이 있어요</h2>
        <div class="features-grid">
          <div v-for="feature in features" :key="feature.title" class="feat-card">
            <div class="feat-icon" :style="{ background: feature.background }">
              <svg v-if="feature.type === 'mail'" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="3" fill="#6c63e8" opacity="0.2" />
                <rect x="3" y="5" width="18" height="14" rx="3" stroke="#6c63e8" stroke-width="1.5" />
                <polyline points="3,5 12,13 21,5" stroke="#6c63e8" stroke-width="1.5" fill="none" />
              </svg>
              <svg v-else-if="feature.type === 'grid'" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="7" height="7" rx="1.5" fill="#1d9e75" opacity="0.25" />
                <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="#1d9e75" stroke-width="1.5" />
                <rect x="13" y="4" width="7" height="7" rx="1.5" fill="#1d9e75" opacity="0.25" />
                <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="#1d9e75" stroke-width="1.5" />
                <rect x="4" y="13" width="7" height="7" rx="1.5" fill="#1d9e75" opacity="0.1" />
                <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="#1d9e75" stroke-width="1" />
                <rect x="13" y="13" width="7" height="7" rx="1.5" fill="#1d9e75" opacity="0.1" />
                <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="#1d9e75" stroke-width="1" />
              </svg>
              <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L14.5 9H22L16 13.5L18.5 20.5L12 16L5.5 20.5L8 13.5L2 9H9.5L12 2Z"
                  fill="#f5a623"
                  opacity="0.3"
                  stroke="#f5a623"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </section>

      <section class="how">
        <div class="section-label">HOW IT WORKS</div>
        <h2 class="section-title">3단계면 끝</h2>
        <div class="steps">
          <div v-for="step in steps" :key="step.number" class="step">
            <div class="step-num">{{ step.number }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </section>

      <section class="companies">
        <div class="section-label">COMPANIES</div>
        <h2 class="section-title">이런 회사들을 지원해요</h2>
        <div class="company-list">
          <span v-for="company in visibleCompanies" :key="company.id" class="company-tag">
            {{ company.nameKr }}
          </span>
          <span class="company-tag company-tag-muted">그 외 다양한 회사들</span>
        </div>
      </section>

      <section class="email-preview">
        <div class="email-preview-text">
          <div class="section-tag">EMAIL PREVIEW</div>
          <h2>
            받게 될 메일은<br />
            이렇게 생겼어요
          </h2>
          <p>
            실제 메일도 이런 구성으로 도착해요. 하루 동안 올라온 글을
            한 번에 정리해서 보여주고, 각 아티클을 눌러 바로 원문으로
            이동할 수 있어요.
          </p>
        </div>

        <div class="email-card">
          <div class="email-header">
            <h4>오늘의 아티클</h4>
            <p>{{ previewMailDate }} · 총 {{ previewMailCount }}개의 아티클</p>
          </div>

          <div class="email-body">
            <div class="email-intro-card">
              <img src="/main_logo.png" alt="" class="email-hero-logo" />
              <div class="email-intro-copy">
                <strong>안녕하세요, 구독자님!</strong>
                <p>어제 게시된 아티클만 모아 한 번에 보내드려요.</p>
              </div>
            </div>

            <div class="email-list-title">아티클 목록</div>

            <div
              v-for="article in previewArticles.slice(0, 3)"
              :key="article.title"
              class="email-article-card"
            >
              <div class="email-article-title">{{ article.title }}</div>
              <div class="email-article-meta">
                <img :src="article.companyLogo" :alt="`${article.company} 로고`" class="email-article-logo" />
                <span class="email-article-co">{{ article.company }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { fetchCompanyCount, type Company } from "../services/companyApi";

const router = useRouter();

const companyCount = ref<number | null>(null);
const companyCountLoading = ref(true);
const visibleCompanies = ref<Company[]>([]);

const fallbackCompanies: Company[] = [
  { id: 1, image: "", nameKr: "올리브영", nameEn: "Olive Young" },
  { id: 2, image: "", nameKr: "네이버", nameEn: "NAVER" },
  { id: 3, image: "", nameKr: "당근", nameEn: "Danggeun" },
  { id: 4, image: "", nameKr: "무신사", nameEn: "MUSINSA" },
  { id: 5, image: "", nameKr: "카카오", nameEn: "Kakao" },
  { id: 6, image: "", nameKr: "AWS", nameEn: "AWS" },
  { id: 7, image: "", nameKr: "우아한형제들", nameEn: "Woowa Brothers" },
  { id: 8, image: "", nameKr: "쏘카", nameEn: "Socar" },
  { id: 9, image: "", nameKr: "요기요", nameEn: "Yogiyo" },
  { id: 10, image: "", nameKr: "마이리얼트립", nameEn: "MyRealTrip" },
  { id: 11, image: "", nameKr: "컬리", nameEn: "Kurly" },
  { id: 12, image: "", nameKr: "11번가", nameEn: "11st" },
];

const features = [
  {
    type: "mail",
    background: "#ede9ff",
    title: "매일 낮 12시 이메일 발송",
    description: "전날 올라온 새 글을 매일 정오에 이메일로 받아보세요. 바쁜 일상 속에서도 최신 트렌드를 놓치지 마세요.",
  },
  {
    type: "grid",
    background: "#e6f4ee",
    title: "회사별 선택 구독",
    description: "관심 있는 회사만 골라서 받아보세요. 카카오, 네이버, 올리브영 등 원하는 IT 기업의 글만 선택할 수 있어요.",
  },
  {
    type: "star",
    background: "#fff4e2",
    title: "카테고리 필터링",
    description: "백엔드, 프론트엔드, AI, 디자인 등 원하는 분야의 글만 골라 받으세요. 관심 없는 글은 과감히 제외해요.",
  },
];

const steps = [
  { number: 1, title: "이메일 입력", description: "구독할 이메일 주소를 입력하세요" },
  { number: 2, title: "회사 · 카테고리 선택", description: "원하는 회사와 분야를 골라요" },
  { number: 3, title: "매일 낮 12시 수신", description: "티짹이가 새 글을 배달해 드려요" },
];

const previewArticles = [
  {
    title: "올리브영의 쿠폰 시스템 개선기",
    company: "올리브영 테크",
    companyLogo: "/company/oliveyoung.jpg",
  },
  {
    title: "무신사의 AI 사용법",
    company: "무신사 테크",
    companyLogo: "/company/musinsa.png",
  },
  {
    title: "당근페이 백엔드 아키텍처가 걸어온 여정",
    company: "당근 테크",
    companyLogo: "/company/daangn.png",
  },
];

const previewDate = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
}).format(new Date());

const previewMailDate = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
}).format(new Date());
const previewMailCount = 3;

const companyCountLabel = computed(() => companyCount.value ?? 20);
const moreCompanyCount = computed(() => {
  const total = companyCount.value ?? fallbackCompanies.length;
  return Math.max(total - visibleCompanies.value.length, 0);
});

const goRegister = () => router.push("/register");
const goCompanyList = () => router.push("/companies");

onMounted(async () => {
  const count = await fetchCompanyCount();

  companyCount.value = count;
  companyCountLoading.value = false;
  visibleCompanies.value = fallbackCompanies;
});
</script>

<style scoped>
.landing-page {
  font-family: "Noto Sans KR", "Pretendard", sans-serif;
  background: #fff;
  color: #1a1a2e;
  width: 100%;
  overflow-x: hidden;
}

.landing-page,
.landing-page * {
  box-sizing: border-box;
}

.landing-page main {
  width: 100%;
  display: block;
}

.landing-page section {
  width: 100%;
}

.landing-page button,
.landing-page input {
  font: inherit;
}

.landing-page button {
  appearance: none;
  -webkit-appearance: none;
}

.landing-page input {
  appearance: none;
  -webkit-appearance: none;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 48px 60px;
  background: linear-gradient(160deg, #f7f6ff 0%, #eeeaff 40%, #fdf6ff 100%);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero > * {
  position: relative;
  z-index: 1;
}

.hero::before,
.hero::after {
  content: "";
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
}

.hero::before {
  width: 320px;
  height: 320px;
  top: -120px;
  left: -80px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 70%);
}

.hero::after {
  width: 260px;
  height: 260px;
  right: -90px;
  bottom: -120px;
  background: radial-gradient(circle, rgba(216, 211, 252, 0.55) 0%, rgba(216, 211, 252, 0) 72%);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ede9ff;
  color: #5650d0;
  border-radius: 100px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 28px;
  border: 1px solid #ccc8f8;
}

.company-count-skeleton {
  display: inline-block;
  width: 30px;
  height: 1em;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(108, 99, 232, 0.18) 25%, rgba(108, 99, 232, 0.34) 50%, rgba(108, 99, 232, 0.18) 75%);
  background-size: 200% 100%;
  vertical-align: -0.08em;
  animation: skeleton-shimmer 1.2s ease-in-out infinite;
}

.company-count-inline {
  display: inline-flex;
  align-items: center;
  gap: 0;
}

.company-count-value {
  font-weight: 800;
}

.hero-badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6c63e8;
  animation: pulse 1.6s infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(1.3);
  }
}

.hero h1 {
  margin: 0 0 20px;
  font-size: 52px;
  font-weight: 700;
  line-height: 1.18;
  color: #1a1430;
  letter-spacing: -1.5px;
}

.hero h1 .accent {
  color: #6c63e8;
}

.hero p {
  margin: 0 0 36px;
  font-size: 17px;
  color: #555;
  line-height: 1.75;
  max-width: 520px;
}

.hero-actions {
  display: flex;
  gap: 14px;
  margin-bottom: 56px;
  align-items: center;
}

.btn-hero {
  min-height: 52px;
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  font-weight: 600 !important;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.btn-hero:hover {
  transform: translateY(-1px);
}

.btn-hero-primary {
  background: linear-gradient(135deg, #6675e0 0%, #7652c9 100%);
  color: #fff;
  border: 1px solid rgba(118, 82, 201, 0);
  box-shadow: 0 4px 10px rgba(102, 117, 224, 0.25);
}

.btn-hero-primary:hover {
  box-shadow: 0 6px 14px rgba(102, 117, 224, 0.32);
}

.btn-hero-secondary {
  background: #fff;
  color: #5746c7;
  border: 1px solid rgba(118, 82, 201, 0.35);
}

.btn-hero-secondary:hover {
  background: linear-gradient(135deg, rgba(102, 117, 224, 0.08) 0%, rgba(118, 82, 201, 0.1) 100%);
  border-color: rgba(118, 82, 201, 0.55);
  color: #4b3ec2;
}

.hero-stat {
  font-size: 13px;
  color: #888;
}

.hero-stat strong {
  color: #6c63e8;
}

.mascot-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
  background: #fff;
  padding: 64px 48px;
  border-bottom: 1px solid #f0eeff;
  max-width: 1200px;
  margin: 0 auto;
}

.mascot-text {
  max-width: 400px;
}

.section-tag {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #9b93f0;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.mascot-text h2,
.email-preview-text h2 {
  margin: 0 0 14px;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.3;
  color: #1a1430;
}

.mascot-text h2 em {
  font-style: normal;
  color: #6c63e8;
}

.mascot-text p,
.email-preview-text p {
  margin: 0;
  font-size: 15px;
  color: #666;
  line-height: 1.8;
}

.mascot-img-wrap {
  position: relative;
  width: 180px;
  height: 180px;
  flex-shrink: 0;
}

.mascot-circle {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ede9ff 0%, #d8d3fc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 3.2s ease-in-out infinite;
}

.mascot-logo {
  width: 132px;
  height: 132px;
  object-fit: contain;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.features {
  background: #f9f8ff;
  padding: 72px 48px;
  text-align: center;
}

.features-grid,
.steps,
.company-list,
.email-preview {
  width: 100%;
}

.section-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #9b93f0;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.section-title {
  margin: 0 0 48px;
  font-size: 34px;
  font-weight: 700;
  color: #1a1430;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.feat-card {
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #ece9ff;
  padding: 28px 24px;
  text-align: left;
  transition: transform 0.15s, box-shadow 0.15s;
}

.feat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(108, 99, 232, 0.1);
}

.feat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 16px;
}

.feat-card h3 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 700;
  color: #1a1430;
}

.feat-card p {
  margin: 0;
  font-size: 13.5px;
  color: #888;
  line-height: 1.7;
}

.how {
  padding: 72px 48px;
  background: #fff;
  text-align: center;
}

.steps {
  display: flex;
  gap: 0;
  justify-content: center;
  align-items: flex-start;
  max-width: 820px;
  margin: 0 auto;
  position: relative;
}

.steps::before {
  content: "";
  position: absolute;
  top: 28px;
  left: 12%;
  right: 12%;
  height: 2px;
  background: repeating-linear-gradient(
    90deg,
    #cac4f8 0px,
    #cac4f8 8px,
    transparent 8px,
    transparent 14px
  );
}

.step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 12px;
  position: relative;
  z-index: 1;
}

.step-num {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #6c63e8;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border: 4px solid #fff;
  box-shadow: 0 0 0 2px #6c63e8;
}

.step h3 {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 700;
  color: #1a1430;
}

.step p {
  margin: 0;
  font-size: 13px;
  color: #888;
  line-height: 1.6;
}

.companies {
  background: #f9f8ff;
  padding: 64px 48px;
  text-align: center;
}

.company-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  max-width: 700px;
  margin: 28px auto 0;
}

.company-tag {
  background: #fff;
  border: 1.5px solid #e0dcff;
  border-radius: 100px;
  padding: 7px 16px;
  font-size: 13px;
  color: #4a43b0;
  font-weight: 500;
}

.company-more {
  background: #6c63e8;
  color: #fff;
  border-color: #6c63e8;
  cursor: pointer;
}

.company-tag-muted {
  background: #f3f1ff;
  color: #6c63e8;
  border-style: dashed;
}

.company-more:hover {
  background: #5650d0;
}

.email-preview {
  padding: 72px 48px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 64px;
  max-width: 1200px;
  margin: 0 auto;
}

.email-preview-text {
  max-width: 380px;
}

.email-card {
  width: 560px;
  background: #f8f6f3;
  border-radius: 18px;
  border: 1px solid #dddaf6;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(108, 99, 232, 0.12);
}

.email-header {
  background: linear-gradient(135deg, #6c63e8, #9b93f0);
  padding: 28px 24px 22px;
  color: #fff;
  text-align: center;
}

.email-header h4 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
}

.email-header p {
  margin: 0;
  font-size: 13px;
  opacity: 0.85;
}

.email-body {
  padding: 22px 20px 22px;
}

.email-intro-card {
  background: #fff;
  border: 1px solid #dddff2;
  border-left: 4px solid #6c63e8;
  border-radius: 10px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.email-hero-logo {
  width: 72px;
  height: 72px;
  object-fit: contain;
  flex-shrink: 0;
}

.email-intro-copy {
  text-align: left;
}

.email-intro-card strong {
  display: block;
  margin-bottom: 6px;
  color: #2b2b2b;
  font-size: 15px;
}

.email-intro-card p {
  margin: 0;
  color: #6e6e6e;
  font-size: 12px;
  line-height: 1.6;
}

.email-list-title {
  margin: 16px 0 12px;
  color: #2a2a2a;
  font-size: 14px;
  font-weight: 700;
}

.email-article-card {
  background: #fff;
  border: 1px solid #d9deea;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 10px;
}

.email-article-card:last-of-type {
  margin-bottom: 0;
}

.email-article-title {
  font-size: 13px;
  font-weight: 700;
  color: #2b2a3a;
  line-height: 1.5;
}

.email-article-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.email-article-logo {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid #ececf5;
}

.email-article-co {
  font-size: 12px;
  color: #7a7a7a;
}

@media (max-width: 768px) {
  .hero {
    padding: 48px 24px 40px;
  }

  .hero h1 {
    font-size: 34px;
  }

  .hero-actions {
    flex-direction: column;
    gap: 10px;
  }

  .mascot-row {
    flex-direction: column;
    gap: 32px;
    padding: 48px 24px;
  }

  .features {
    padding: 48px 24px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .how {
    padding: 48px 24px;
  }

  .steps {
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }

  .steps::before {
    display: none;
  }

  .companies {
    padding: 48px 24px;
  }

  .email-preview {
    flex-direction: column;
    padding: 48px 24px;
    gap: 40px;
  }

  .email-card {
    width: 100%;
    max-width: 560px;
  }
}

@media (max-width: 480px) {
  .btn-hero {
    width: 100%;
  }

  .hero-actions {
    width: 100%;
    max-width: 320px;
  }

  .section-title {
    font-size: 28px;
    margin-bottom: 36px;
  }

  .mascot-text h2,
  .email-preview-text h2 {
    font-size: 28px;
  }
}
</style>
