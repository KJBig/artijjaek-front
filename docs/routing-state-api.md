# 라우팅, 상태, API 연동

## 라우팅

모든 라우트는 `src/router/index.ts`에 선언한다.

- 페이지는 `() => import('../pages/...')` 형태로 lazy loading한다.
- HTML5 history는 `createWebHistory()`를 사용한다.
- 페이지 이동 시 `scrollBehavior`가 최상단으로 복원한다.
- catch-all `/:pathMatch(.*)*`는 항상 마지막에 유지한다.
- 프로그램 이동은 `useRouter().push(...)`를 사용한다.

라우트 쿼리에 의존하는 설정·탈퇴 흐름에서는 `useRoute`를 직접 중복 사용하기보다 `useAuthGuard`의 `email`, `token`, `load`, `fatal`, `isLoading`을 활용한다.

## 상태 관리

현재 전역 store는 없다. 상태는 다음 경계로 관리한다.

- 앱 셸 상태: `App.vue`
- 라우트 화면의 폼·목록·팝업·로딩 상태: 각 `pages/*.vue`
- 재사용 비동기/인증 상태: `src/composables`
- 서버 데이터 형태 변환: `src/services`

페이지 초기 데이터가 독립적이면 `Setting.vue`처럼 `Promise.all`로 병렬 로드한다. 응답 후 초기 snapshot을 저장하면 변경 여부 비교와 제출 활성화에 사용할 수 있다.

## API 기본 규칙

서비스는 `src/services`에서 기능별로 분리하며 브라우저 `fetch`를 사용한다.

- 기본 주소: `import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'`
- JSON 요청: `Content-Type: application/json`
- query string: 문자열 연결보다 `URLSearchParams`를 우선한다.
- 변경 요청: payload interface를 선언하고 `JSON.stringify(payload)`로 전송한다.
- `res.ok`가 false이면 상태 코드와 서버 `message`를 가능한 범위에서 추출한다.

## 응답 정규화

백엔드 응답은 `{ isSuccess, message?, data? }` 래퍼와 페이지 메타데이터를 사용한다. 화면은 원시 필드 변형을 직접 알지 않도록 서비스에서 프런트 모델로 변환한다.

`companyApi.ts`는 `companyId`/`id`, `pageNumber`/`number`, `totalPage`/`totalPages` 등 기존 응답 변형을 서비스 경계에서 흡수한다. 새 계약은 백엔드 DTO를 먼저 확인하고, 레거시 호환이 실제로 필요한 경우에만 fallback을 추가한다.

## 오류 정책 구분

현재 서비스에는 두 방식이 존재한다.

- 회원·문의 요청: 실패 시 예외를 다시 던져 화면이 사용자 오류를 처리한다.
- 회사·카테고리 목록: 오류를 로그로 남기고 빈 결과를 반환한다.

새 기능은 사용자 의도에 맞게 선택한다. 저장·수정·탈퇴처럼 성공 여부가 중요한 요청은 예외를 전달한다. 선택 목록처럼 화면이 빈 상태로 복구 가능한 조회는 fallback을 제공할 수 있지만, 로딩 실패와 실제 빈 목록을 구분해야 하는 UX라면 오류 상태도 반환한다.

## 인증 링크 흐름

`useAuthGuard`는 URL query의 `email`과 `token`을 trim하고 누락을 치명 오류로 처리한다. 인증 API는 `guard.load((email, token) => ...)` 안에서 호출하고, 실패 화면은 `AuthErrorPanel.vue`를 사용한다. 토큰이나 이메일을 로그, 저장소, 오류 문구에 불필요하게 노출하지 않는다.
