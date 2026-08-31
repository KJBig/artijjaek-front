# 아키텍처와 디렉터리 구조

## 애플리케이션 진입점

`src/main.ts`가 전역 CSS를 불러오고 `App`에 Router를 설치한 뒤 `#app`에 마운트한다. `src/App.vue`는 모든 페이지에 공통인 `HeaderNav`, `router-view`, `FooterBar`를 배치하는 앱 셸이다.

```text
index.html
  -> src/main.ts
     -> src/App.vue
        -> HeaderNav
        -> router-view (src/pages)
        -> FooterBar
```

## 디렉터리 책임

- `src/pages`: 라우트 단위 화면과 화면 로컬 상태. `Home.vue`, `Register.vue`, `Setting.vue` 등이 여기에 있다.
- `src/components`: 여러 화면 또는 앱 셸에서 사용할 UI. 내비게이션, 푸터, 팝업, 인증 오류 패널이 있다.
- `src/services`: 백엔드 요청, 요청/응답 타입, 응답 정규화. `memberApi.ts`, `companyApi.ts`, `categoryApi.ts`, `inquiryApi.ts`가 기능별로 나뉜다.
- `src/composables`: 재사용 가능한 Vue 상태 로직. 현재 `useAuthGuard.ts`가 URL의 `email`, `token` 검증과 로딩·치명 오류 상태를 캡슐화한다.
- `src/constants`: 화면과 도메인에서 공유하는 정적 값. 현재 탈퇴 사유가 있다.
- `src/assets`: 번들에 포함되는 소스 자산. 공개 경로로 직접 참조하는 이미지들은 `public`에 있다.
- `src/style.css`: reset, body, `#app`, 기본 요소에 대한 최소 전역 스타일.

## 기능 구현 위치 선택

- URL로 직접 진입해야 하는 사용자 흐름은 `pages`와 `router/index.ts`에 추가한다.
- 한 페이지에만 쓰이는 상태와 마크업은 해당 SFC에 유지한다.
- 여러 페이지에서 반복되는 UI나 이벤트 계약은 `components`로 분리한다.
- 라우트 쿼리나 비동기 상태처럼 반복되는 로직은 `composables`로 분리한다.
- HTTP 호출과 서버 응답 변환은 SFC가 아니라 `services`에 둔다.

## 배포와 프록시

이 저장소는 정적 Vite 앱이다. 프로덕션의 동일 출처 `/api/*` 전달은 `vercel.json` 또는 `nginx.conf`가 담당하고, 로컬 개발 프록시는 `vite.config.ts`가 담당한다. 특히 이메일 링크 `/api/v1/email-links/*`는 프런트 라우트로 처리하지 않고 백엔드로 전달해야 한다.

## 현재 구조의 경계

Pinia 같은 전역 store, 공용 HTTP client, 테스트 프레임워크는 현재 없다. 새 의존성을 도입하기 전 기존 페이지 로컬 상태와 서비스 함수로 해결 가능한지 확인하고, 도입이 필요하면 적용 범위와 마이그레이션 이유를 명시한다.
