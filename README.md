## 프로젝트 개요
이 프로젝트는 게시판 시스템을 위한 기본 템플릿입니다. Nuxt 4와 JSON Server를 사용하여 구현된 풀스택 애플리케이션입니다.
## 프로젝트 구조
프로젝트는 모노레포 구조로 설계되어 있으며, 다음과 같은 구조를 가지고 있습니다:
``` 
nuxt4-jsonserver-board/
├── apps/
│   ├── api/          # JSON Server 기반 백엔드 API
│   └── web/          # Nuxt 4 기반 프론트엔드 애플리케이션
├── package.json      # 루트 패키지 설정
└── .gitignore
```
## 기술 스택
### 프론트엔드 (apps/web)
- Vue.js 3.5.18
- Nuxt 4.0.3
- Vue Router 4.5.1
- PrimeVue 4.3.7 (UI 컴포넌트 라이브러리)
- PrimeIcons 7.0.0

### 백엔드 (apps/api)
- JSON Server 1.0.0-beta.3 (RESTful API 목업)

### 개발 도구
- TypeScript
- ESLint 9.33.0
- @antfu/eslint-config 5.2.1
- PNPM 패키지 매니저 (v10.14.0)

## 설치 및 실행 방법
### 필수 조건
- Node.js (최신 LTS 버전 권장)
- PNPM 패키지 매니저 (v10.14.0 이상)

### 설치
``` bash
# 의존성 설치
pnpm install
```
### 개발 서버 실행
``` bash
# API 서버와 웹 클라이언트 동시 실행
pnpm dev

# API 서버만 실행
pnpm dev:api

# 웹 클라이언트만 실행
pnpm dev:web
```
## 구현해야하는 기능
- 게시글 목록 조회 (페이지네이션 포함 10개씩)
- 게시글 상세 조회
- 게시글 작성/수정/삭제
- 반응형 UI (PrimeVue 컴포넌트 활용)
