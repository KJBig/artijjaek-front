# Artijjaek Frontend 개발 가이드

이 디렉터리는 현재 `artijjaek-front` 코드에서 확인한 구조와 구현 관례를 정리한다. 새 기능은 문서의 규칙을 기계적으로 적용하기보다 인접 코드와 함께 확인하며, 백엔드 계약이 바뀌면 관련 서비스 타입과 화면 상태를 함께 갱신한다.

## 문서 구성

- [아키텍처와 디렉터리 구조](architecture.md)
- [Vue와 TypeScript 컨벤션](vue-typescript-conventions.md)
- [라우팅, 상태, API 연동](routing-state-api.md)
- [UI와 스타일 가이드](ui-style-guide.md)
- [로컬 실행, 빌드, 검증](build-and-verification.md)

## 빠른 작업 순서

1. `src/router/index.ts`와 대상 `src/pages/*.vue`에서 사용자 흐름을 확인한다.
2. 서버 연동은 `src/services/*Api.ts`의 타입과 오류 처리 방식을 확인한다.
3. 화면 상태는 기존 페이지처럼 `ref`, `computed`, lifecycle hook으로 구성하고 재사용되는 인증 흐름은 composable로 분리한다.
4. UI에는 로딩, 빈 결과, 오류, 제출 중 상태를 반영한다.
5. `npm run build`로 TypeScript 검사와 Vite 번들을 모두 검증한다.

## 현재 기술 스택

- Vue 3.5 / `<script setup lang="ts">`
- Vue Router 4.5
- TypeScript 5.9 strict mode
- Vite 7
- 브라우저 기본 `fetch`
- 전역 상태관리 및 UI 프레임워크 없음
