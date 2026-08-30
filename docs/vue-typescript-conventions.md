# Vue와 TypeScript 컨벤션

## SFC 구성

현재 페이지와 컴포넌트는 Vue 3 Composition API와 `<script setup lang="ts">`를 사용한다. 마크업, 상태 로직, `scoped` 스타일을 한 SFC 안에 배치하는 패턴이 주류다. 기존 파일별 순서는 일관되지 않으므로 수정할 때는 해당 파일의 순서를 유지하고, 새 파일은 `template` → `script setup` → `style scoped` 순서를 권장한다.

## 상태와 파생값

- 변경 가능한 원시 상태와 폼 값은 `ref`를 사용한다. 예: `Inquiry.vue`의 `busy`, `email`, `message`.
- 다른 상태에서 계산되는 값은 `computed`를 사용한다. 예: 제출 가능 여부, 쿼리 파라미터 유효성.
- DOM 또는 초기 원격 데이터가 필요할 때 lifecycle hook을 사용한다.
- 템플릿에서 처리하기 어려운 긴 변환은 이름 있는 함수로 분리한다.
- 비동기 제출 중에는 중복 요청을 막기 위해 `busy` 또는 동등 상태를 버튼 `disabled`에 연결한다.

## Props와 이벤트

공용 컴포넌트는 타입 기반 매크로를 사용한다. `AuthErrorPanel.vue`처럼 `defineProps<{ ... }>()`와 `defineEmits<{ ... }>()`로 공개 계약을 선언한다. 이벤트명은 템플릿에서 의미가 드러나는 동사형을 사용한다.

## 타입 규칙

`tsconfig.app.json`은 `strict: true`와 `noFallthroughCasesInSwitch: true`를 사용한다.

- API 요청 payload와 화면에서 소비하는 응답은 `interface` 또는 `type`으로 명시한다.
- `import type`을 사용해 런타임 import와 타입 import를 구분한다. `src/router/index.ts`의 `RouteRecordRaw`가 예다.
- `unknown` 데이터를 받을 때는 `typeof`, `Array.isArray`와 type predicate로 좁힌다. `Setting.vue`의 ID·회사·카테고리 변환 함수 패턴을 참고한다.
- 새 코드에서 `any`와 non-null assertion을 늘리지 않는다. 현재 서비스의 유연한 응답 매핑에 `any`가 일부 있으므로 수정 시 `unknown` 기반 정규화를 우선한다.
- 서버 필드명이 여러 형태일 수 있어 호환 로직이 필요하면 `companyApi.ts`처럼 서비스 경계에서 하나의 프런트 모델로 정규화한다.

## 이름과 파일

- Vue 컴포넌트와 페이지 파일은 PascalCase (`HeaderNav.vue`, `CompanyList.vue`).
- composable은 `use` 접두사 (`useAuthGuard`).
- API 파일은 기능명 + `Api.ts` (`memberApi.ts`).
- 함수와 지역 변수는 camelCase, 타입은 PascalCase.
- 라우트 name은 현재 소문자 단어를 사용하며 404만 `NotFound`로 되어 있다. 새 라우트는 기존 목록과 충돌하지 않는 일관된 이름을 쓴다.

## 오류 처리

예외를 삼키지 말고 UI가 처리할 수 있는 오류로 전달한다. 인증 흐름은 `useAuthGuard.load`가 예외를 `fatal`과 `error`로 바꾼다. 사용자 동작 요청은 `try/catch/finally`에서 오류 피드백과 busy 해제를 보장한다. 오류의 타입은 가능하면 `unknown`으로 받고 `instanceof Error` 등으로 좁힌다.
