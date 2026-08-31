# 로컬 실행, 빌드, 검증

## 요구 환경

`package-lock.json`을 사용하는 npm 프로젝트다. Node 버전은 저장소에 별도로 고정되어 있지 않으므로, Vite 7이 지원하는 Node 버전을 사용하고 팀·배포 환경과 일치시킨다.

## 설치와 실행

```bash
npm ci
npm run dev
```

API 기본 주소는 `VITE_API_BASE_URL`이며 없으면 `http://localhost:8080`을 사용한다. Vite의 동일 출처 `/api/*` 프록시 대상은 `VITE_API_PROXY_TARGET`, 그다음 `VITE_PROXY_TARGET`, 마지막으로 `http://localhost:8080` 순서다.

## 필수 검증

```bash
npm run build
```

`build`는 `vue-tsc -b` 후 `vite build`를 실행하므로 TypeScript와 프로덕션 번들을 함께 검증한다. 현재 `package.json`에는 lint와 자동 테스트 스크립트가 없다. 따라서 존재하지 않는 검증을 통과했다고 보고하지 않는다.

## 수동 확인 체크리스트

- 변경한 라우트의 직접 접근과 앱 내 이동
- 브라우저 새로고침 시 SPA fallback 동작
- API 성공, 서버 오류, 네트워크 오류
- 로딩 중 중복 제출 방지와 버튼 상태
- 빈 회사·카테고리 목록과 pagination 종료
- `email`/`token` 누락 또는 유효하지 않은 인증 링크
- 데스크톱, 768px 이하 내비게이션, 640px 이하 폼 레이아웃
- 키보드 Tab 이동, focus 표시, label과 오류 안내
- `/api/*`가 프런트 SPA가 아니라 백엔드로 전달되는지 확인

## 배포 관련 확인

- Vercel 배포는 `vercel.json` rewrite를 확인한다.
- Nginx 배포는 `nginx.conf`의 SPA fallback과 `/api/` proxy를 확인한다.
- 비밀값을 `VITE_*` 변수에 넣지 않는다. Vite 클라이언트 환경 변수는 번들에 노출된다.

## 변경 전후 품질 기준

문서만 변경한 경우 링크, 경로, 명령을 실제 저장소와 대조한다. 코드 변경 시 빌드를 필수로 실행하고, UI 변경은 수동 체크 결과를 PR에 기록한다. 실패하거나 실행하지 못한 항목은 이유와 영향 범위를 함께 남긴다.
