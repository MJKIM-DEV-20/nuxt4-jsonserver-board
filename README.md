# 개발 미션 게시판

React와 JSON Server로 게시판 기능을 완성하는 인턴 과제입니다. 현재 저장소에는 **평가 기준이 되는 정적 UI 퍼블리싱만** 들어 있습니다. API 호출, React 상태, 이벤트, 링크, 라우팅, 폼 동작은 모두 과제 수행자가 구현합니다.

## 먼저 알아둘 점

`apps/web/index.html`은 Vite가 React 앱을 브라우저에 마운트하기 위한 최소 셸입니다. 목록·상세·작성 화면을 HTML 파일로 나누지 않았으며 실제 화면은 모두 `src/pages`의 React 컴포넌트입니다.

현재 화면 간 링크와 라우터는 없습니다. UI를 검수할 때는 `src/App.jsx`의 `PREVIEW_SCREEN`을 `list`, `detail`, `form` 중 하나로 하드코딩해 확인합니다. 이 미리보기 분기는 제출 전에 실제 라우팅으로 교체해야 합니다.

## 프로젝트 구조

```text
react-jsonserver-board/
├── apps/
│   ├── api/
│   │   ├── db.json                 # posts / comments 초기 데이터
│   │   └── package.json            # JSON Server, 포트 4100
│   └── web/
│       ├── index.html              # React 마운트용 Vite 셸
│       ├── vite.config.js          # Vite 설정, 포트 3500
│       └── src/
│           ├── main.jsx            # React 앱 진입점
│           ├── App.jsx             # 공통 레이아웃 + 정적 화면 미리보기
│           ├── components/
│           │   ├── AppHeader.jsx   # 로고, 검색, 글쓰기 UI
│           │   └── ContentState.jsx # 상태 UI와 skeleton
│           ├── pages/
│           │   ├── PostList.jsx    # 목록 UI
│           │   ├── PostDetail.jsx  # 상세·댓글 UI
│           │   └── PostForm.jsx    # 작성·수정 UI
│           └── styles.css          # 폰트·색상·간격·반응형 공통 스타일
├── package.json
└── pnpm-workspace.yaml
```

## 제공 범위: UI 퍼블리싱

- 목록, 상세, 작성·수정 React 컴포넌트
- Pretendard와 `styles.css` 기반 색상·타입·간격 규칙
- 데스크톱·태블릿·모바일 반응형 레이아웃
- Button, Input, Tabs, Pagination, Dialog의 시각 스타일
- loading, empty, error에 사용할 상태 컴포넌트와 skeleton
- 화면 컴포넌트에 직접 작성된 검수용 텍스트

다음 항목은 의도적으로 제공하지 않습니다.

- 화면 간 링크, React Router, History API 처리
- API client와 모든 비동기 요청
- `useState`, `useEffect`, `useMemo`를 포함한 화면 상태 관리
- 클릭·제출·변경 이벤트 핸들러
- 검색, 필터, 정렬, 페이지네이션 동작
- 게시글과 댓글의 작성, 조회, 수정, 삭제
- validation, 글자 수 계산, 제출 버튼 활성화
- loading, empty, error, success 상태 판별과 재시도
- 삭제·이탈 확인 Dialog의 열기, 닫기, focus 관리
- URL path·parameter·query와 화면 상태 동기화

## 실행 방법

### 요구 환경

- Node.js 20 이상
- PNPM 10.14.0 이상

```bash
pnpm install

# API와 웹을 함께 실행
pnpm dev

# 각각 실행
pnpm dev:api
pnpm dev:web
```

- Web: `http://localhost:3500`
- API: `http://localhost:4100`

포트를 바꾸려면 `apps/web/vite.config.js`와 `apps/api/package.json`의 `dev` 스크립트를 수정합니다.

```bash
pnpm -C apps/web lint
pnpm -C apps/web build
```

## 과제 1. 공통 기반

1. `src/App.jsx`의 `PREVIEW_SCREEN`과 정적 화면 분기를 제거합니다.
2. React Router 또는 History API로 아래 화면 경로를 설계합니다.
3. API base URL과 공통 request 함수를 만들고 요청 실패를 처리합니다.
4. JSX에 직접 작성된 샘플 텍스트를 실제 API 응답 기반 렌더링으로 교체합니다.
5. 각 화면에 loading, empty, error 상태와 재시도 동작을 연결합니다.
6. 로고, 글쓰기, 게시글 제목, 뒤로 가기, 수정, 취소, 페이지 번호에 실제 이동을 연결합니다.
7. 키보드 focus, 본문 바로가기 링크, Dialog focus 복귀를 구현합니다.

권장 경로 계약은 다음과 같습니다. 다른 구조를 선택해도 새로고침과 직접 URL 접근이 정상 동작해야 합니다.

| UI | 권장 이동 대상 | 전달할 값 |
|---|---|---|
| 로고, `전체 글로` | `/` | 없음 |
| `글쓰기` | `/write` | 없음 |
| 게시글 제목 또는 목록 행 | `/posts/:id` | 게시글 `id` |
| `글 수정` | `/posts/:id/edit` | 게시글 `id` |
| `작성 취소` | `/` 또는 이전 화면 | 작성 중 내용 여부 |
| 페이지 번호 | `/?page=2` | `page` query |
| 검색·필터·정렬 | `/?q=...&notice=...&sort=...` | 현재 조건 |

## 과제 2. 목록 화면 — `PostList.jsx`

- `GET /posts?_page=1&_per_page=10`으로 게시글을 조회합니다.
- 응답 데이터와 전체 개수를 목록과 결과 수에 표시합니다.
- 검색어, 공지 필터, 최신순·조회순 정렬을 구현합니다.
- 검색·필터·정렬·현재 페이지를 URL query와 양방향으로 동기화합니다.
- 조건이 바뀌면 첫 페이지로 이동하고 목록을 다시 조회합니다.
- 페이지 번호, 이전, 다음 이동과 disabled 상태를 구현합니다.
- 게시글을 선택하면 해당 `id`의 상세 화면으로 이동합니다.
- 검색 중 skeleton, 결과 없음, 조회 실패 UI를 구분합니다.
- 빠르게 조건을 바꿔도 이전 요청 결과가 최신 화면을 덮어쓰지 않게 처리합니다.

## 과제 3. 상세 화면 — `PostDetail.jsx`

- URL의 `id`로 `GET /posts/:id`를 호출합니다.
- `GET /comments?postId=:id`로 해당 글의 댓글만 조회합니다.
- 존재하지 않는 글은 일반 오류와 구분한 not-found 상태로 보여줍니다.
- `글 수정`에 현재 게시글 `id`를 전달합니다.
- `글 삭제`를 누르면 확인 Dialog를 열고, 확정 시 `DELETE /posts/:id`를 호출합니다.
- 삭제 성공 후 목록으로 이동하고, 실패하면 Dialog 안에서 오류와 재시도를 제공합니다.
- 댓글 입력을 controlled state로 만들고 필수값을 검증합니다.
- `POST /comments` 성공 후 댓글 목록과 개수를 갱신합니다.
- 댓글 등록 중 중복 제출을 막고 입력값과 버튼 상태를 정확히 표시합니다.
- 상세와 댓글의 loading, empty, error 상태를 각각 처리합니다.

## 과제 4. 작성·수정 화면 — `PostForm.jsx`

- `/write`는 작성 모드, `/posts/:id/edit`는 수정 모드로 구분합니다.
- 수정 모드에서는 `GET /posts/:id`로 기존 값을 불러와 폼에 채웁니다.
- 제목, 닉네임, 내용을 controlled state로 관리합니다.
- 제목 100자, 닉네임 20자, 내용 2,000자 기준으로 글자 수를 표시합니다.
- 필수값과 길이를 검증하고 오류 문구를 해당 입력과 `aria-describedby`로 연결합니다.
- 작성은 `POST /posts`, 수정은 `PATCH /posts/:id`로 저장합니다.
- 저장 중 버튼 비활성화와 loading 상태로 중복 제출을 막습니다.
- 저장 성공 후 생성·수정된 게시글 상세 화면으로 이동합니다.
- 변경 내용이 있을 때 취소나 브라우저 이탈을 시도하면 확인 Dialog를 엽니다.
- 첫 오류 입력으로 focus를 옮기고 서버 오류 뒤에도 작성 내용을 보존합니다.

## 과제 5. 상태 UI 연결

`ContentState.jsx`와 skeleton은 마크업만 제공합니다. 다음 조건을 실제 화면 상태와 연결합니다.

| 상태 | 필요한 처리 |
|---|---|
| Loading | 기존 레이아웃을 유지하는 skeleton과 `aria-busy` |
| Empty | 결과가 없는 이유와 가능한 다음 행동 |
| Error | 이해하기 쉬운 오류 문구와 다시 시도 버튼 |
| Success | 저장·삭제·댓글 등록 결과와 다음 화면 이동 |
| Validation | 필드별 오류와 첫 오류 focus |

## 완료 기준

- 새로고침하거나 URL을 직접 입력해도 목록·상세·작성·수정 화면이 열립니다.
- 브라우저 이전·다음 이동 시 URL과 검색·필터·페이지 상태가 일치합니다.
- API 성공뿐 아니라 지연, 빈 결과, 404, 서버 오류를 확인할 수 있습니다.
- 저장·삭제·댓글 등록을 연속 클릭해도 중복 요청이 발생하지 않습니다.
- Dialog를 키보드로 조작할 수 있고 닫은 뒤 focus가 실행 버튼으로 돌아갑니다.
- 320px, 375px, 768px, 1280px에서 가로 스크롤과 레이아웃 깨짐이 없습니다.
- ESLint와 production build가 통과하고 브라우저 console 오류가 없습니다.
- 정적 샘플 텍스트가 실제 API 응답으로 대체되고 모든 화면 기능이 요구사항대로 동작합니다.

현재 제공된 퍼블리싱은 평가 기준입니다. 기능을 연결하면서 DOM 구조를 조정할 수 있지만, 정보 위계와 반응형·접근성 기준은 유지해야 합니다.
