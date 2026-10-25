# ELSEWHERE. — 개인 여행 아카이브 웹사이트 마스터 작업 명세서

> **버전:** v1.0  
> **작성 기준일:** 2026-10-25 (KST)  
> **상태:** 개발 착수용 기준 문서 / 미확정 사항은 `DECISION` 표기  
> **작업 환경:** Windows PC, iCloud for Windows, Codex, GitHub, Vercel  
> **임시 프로젝트명:** `ELSEWHERE.` — *The Places We Carry* (실제 서비스명·도메인은 추후 변경 가능)  
> **프로젝트 성격:** 개인·가족 여행 사진의 장기 보존과 미감 중심의 공개 여행 에세이 아카이브

---

## 0. Codex 실행 지침 — 이 문서를 처음 읽는 개발 에이전트용

1. 이 문서는 **제품 요구사항(PRD) + UX/UI 상세 명세 + 기술 설계 + 구현 순서 + 인수 기준**의 단일 기준 문서다.
2. **먼저 공개 웹사이트의 완성도**를 만든다. AI 수집 자동화, 공개 관리자, 로그인을 첫 단계부터 한꺼번에 만들지 않는다.
3. 서비스의 핵심은 **Cereal의 여백과 절제 + IGNANT의 에디토리얼 편집 + Exposure의 몰입형 사진 서사**다. 일반적인 SaaS 대시보드나 템플릿형 블로그처럼 보이면 실패로 간주한다.
4. Astro를 기본으로 사용하며 정적 콘텐츠는 `.astro`로 구현한다. React/21st.dev 코드는 **실제 상호작용이 필요한 부분에만** 도입한다. GSAP 역시 핵심 연출에만 선택적으로 적용한다.
5. **iCloud 동기화 원본을 절대 수정·이동·삭제하지 않는다.** 항상 별도 로컬 작업 폴더로 복사한 파일을 처리한다.
6. 사진·GPS·인물 데이터는 민감할 수 있다. **원본 업로드 금지, 위치정보 공개 전 제거, 개인 사진 외부 AI 전송 동의**를 기본 원칙으로 삼는다.
7. 웹사이트에 쓰는 모든 여행 사실은 `확인된 사실 / 추정 / 사용자 직접 작성`으로 구분한다. AI가 실제로 겪지 않은 감정, 식당 평가, 여행 경험을 꾸며내지 않는다.
8. 각 작업 단계의 결과는 실제 브라우저에서 모바일/데스크톱으로 확인한다. 빌드·타입체크·접근성·성능·사진 저작권 및 개인정보 체크를 통과해야 완료다.
9. 미확정 항목은 합리적인 기본값으로 진행하되, 사용자 결정이 필요한 값(실제 도메인, 공개할 가족 사진, AI 제공업체 API 키)은 임의 설정하지 않는다.
10. CLI 및 외부 서비스 요금/플러그인 설치법은 변경될 수 있으므로 **실행 직전에 공식 문서로 검증**한다.

---

## 1. 프로젝트 목표·비목표

### 1.1 한 문장 목표

> iCloud와 카메라 사진에서 여행을 발견하고, AI가 촬영 시각·장소·이미지를 정리해 초안을 만들며, 사용자가 선택한 사진과 문장으로 **한 권의 디지털 여행 사진집**을 발행하는 개인 웹사이트.

### 1.2 핵심 사용자 시나리오

- 여행을 마친 사용자가 Windows PC에서 날짜 범위를 선택한다.
- 시스템이 복사된 원본에서 EXIF 촬영 시각, GPS, 촬영 기종, 사진 비율을 추출한다.
- 사진을 날짜 및 방문지로 묶고 대표 사진과 여행 동선을 제안한다.
- 사용자는 장소명을 확인하고 짧은 메모, 기억, 감정, 이야기 소재를 입력한다.
- AI가 제목, 도입 문장, 장면별 사진 배열, 짧은 산문형 본문을 제안한다.
- 사용자는 사진 선택·크롭·정렬·문장·공개 여부를 직접 수정한다.
- 최종 결과가 Markdown/MDX + 공개용 이미지로 저장되고 GitHub를 거쳐 Vercel에서 공개된다.
- 방문자는 홈에서 여행을 고르고, 사진 위주의 이야기와 선택적 지도로 탐색한다.

### 1.3 성공 기준

- **미감:** Cereal/IGNANT/Exposure의 장점이 일관된 디자인 언어로 구현됨.
- **보존성:** 원고를 표준 Markdown/MDX로 보관해 다른 호스팅으로 이전 가능.
- **사용성:** 한 번 완성한 발행 파이프라인에서 새 여행기 추가 시 코드 수정 불필요.
- **신뢰성:** 사진 속 사실과 추정을 구분하고, 사용자 검토 없이 임의의 장소·평가를 확정하지 않음.
- **프라이버시:** 원본·정확한 GPS·비공개 초안·API 키가 공개 저장소 및 배포 산출물에 포함되지 않음.

### 1.4 비목표(초기 MVP 제외)

회원가입, 공개 댓글, 소셜 로그인, 광고/제휴 수익, 다중 편집자 협업, 전용 iOS 앱, 자동 SNS 크로스포스팅, 전체 사진에 대한 무인 AI 분석, 실시간 위치 추적, 과한 3D·패럴랙스, 여행 예약 기능.

---

## 2. 핵심 원칙과 디자인 레퍼런스

| 레퍼런스 | 차용 요소 | 차용하지 않을 요소 |
|---|---|---|
| [Cereal](https://www.readcereal.com/) | 여백, 낮은 채도, 종이 같은 질감, 조용한 목소리, 정제된 타이포그래피 | 지나치게 작은 본문, 탐색을 방해하는 미니멀리즘 |
| [IGNANT](https://www.ignant.com/) | 편집 디자인, 가변 사진 비율, 비대칭 그리드, 시각적 리듬 | 모든 사진을 불규칙하게 배치하는 과도한 실험성 |
| [Exposure](https://exposure.co/) | 사진이 주인공인 장문 스토리텔링, 넓은 전면 이미지, 장별 흐름 | 모든 페이지에 무거운 스크롤 애니메이션 |
| [Recent (구 Godly)](https://recent.design/) | 최신 웹 인터랙션·타이포·레이아웃의 탐색 및 레퍼런스 수집 | 유행 효과를 검증 없이 전면 도입 |
| [21st.dev](https://21st.dev/) | 검증된 UI 컴포넌트 탐색, 갤러리·라이트박스·메뉴 | React를 사이트 전체에 무차별 사용 |
| [GSAP](https://gsap.com/) | 장면 전환, 이미지 등장, 소량의 ScrollTrigger 연출 | 과장된 스크롤 고정·멀미 유발 인터랙션 |
| [Manus](https://manus.im/) | 필요 시 보조 조사나 독립 실험에 활용 | Codex와 역할이 겹치므로 필수 스택에서 제외 |

**디자인 키워드:** editorial, quiet, cinematic, tactile, unhurried, personal, timeless.  
**반대 키워드:** dashboard, loud gradients, glassmorphism overload, sticky CTA, stock photo template, excessive cards.

---

## 3. 정보 구조(IA) 및 URL

```text
/
├── Journal          /journal             여행기 목록 — 기본 탐색
│   └── [slug]       /journal/[slug]      개별 여행기 상세
├── Places           /places              도시·국가·방문지 기반 탐색
├── Archive          /archive             연도별 여행 인덱스
├── About            /about               아카이브에 대하여
├── Not Found        /404                 맞춤 오류 페이지
└── (로컬 전용)       localhost            AI 사진 분석·편집·발행 도구
```

- 상단 글로벌 내비게이션: 좌측 `ELSEWHERE.` 워드마크 / 우측 `JOURNAL · PLACES · ARCHIVE · ABOUT`.
- `Journal`은 사진 중심 카드 탐색, `Archive`는 압축된 시간순 목록, `Places`는 여행지 기준.
- 태그·연도·국가 필터는 URL 검색 파라미터 또는 클라이언트 상태로 관리하되 직접 URL 접근과 뒤로 가기를 보장한다.
- 공개 사이트에는 **관리자(`/admin`) 라우트를 만들지 않는다.** 로컬 편집기는 별도 프로세스로만 구동한다.
- 언어 기본값: 한국어 `ko-KR`, 영문은 영문 레이블 및 일부 서브타이틀만 사용. 다국어 전체 번역은 후순위.

---

## 4. 화면별 상세 명세

### 4.1 HOME `/` — Cereal 중심의 첫인상

**목적:** 첫 방문 5초 이내에 ‘개인 사진 매거진’임을 이해시키기. CTA/카드 다발보다 사진과 제목이 먼저 보이게 한다.

**데스크톱 기본 그리드:** 12컬럼, 콘텐츠 최대 폭 1,440px, 페이지 측면 여백 64~96px, 텍스트 최대 폭 680px.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ELSEWHERE.                            JOURNAL   PLACES   ARCHIVE   ABOUT    │
│                                                                              │
│                   THE PLACES WE CARRY                                       │
│                   우리가 머물렀던 계절                                      │
│                                                                              │
│          ┌───────────────────────────────────────────────────────┐           │
│          │                                                       │           │
│          │                 FEATURED JOURNEY                      │           │
│          │              대표 여행 사진 16:9                     │           │
│          │                                                       │           │
│          └───────────────────────────────────────────────────────┘           │
│          VOL. 001              TRAVEL JOURNAL              EXPLORE →          │
│                                                                              │
│   SELECTED STORIES                                                           │
│   ┌──────────────────────┐        ┌──────────────────────────────────┐       │
│   │  세로형 사진 4:5     │        │  가로형 사진 3:2                │       │
│   │                      │        └──────────────────────────────────┘       │
│   └──────────────────────┘                        제목 / 날짜 / 장소          │
│   제목 / 날짜 / 장소                                                         │
│                                                                              │
│   A MAP OF MEMORIES — 여행 장소 요약 / 전 여행기 보기 →                     │
│                                                                              │
│   FOOTER: ELSEWHERE.  ·  © Year  ·  Instagram(선택)                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

**필수 섹션 순서**
1. `Header`: 80px 내외, 화면 최상단. 기본은 심플, 스크롤 시 배경이 살짝 나타나도록 선택 가능.
2. `Hero`: 대표 사진 1장 + 한글 제목 + 짧은 영문 키커. 데스크톱 히어로 이미지는 최대 16:9(필요 시 3:2).
3. `Intro Line`: 1~2문장으로 웹사이트의 기록 철학 소개. 억지로 매번 자동 생성하지 않음.
4. `Selected Stories`: 최근 또는 큐레이션된 여행기 3~5개를 비대칭 사진 그리드에 배치.
5. `Places Teaser`: 장소 수·여행지 링크와 작은 정적 지도 또는 장소 목록.
6. `Footer`: 저작권, 사이트 설명, 연락처/소셜 링크(실제 계정 있을 때만).

**홈 인터랙션:** 첫 진입 시 제목 opacity 0→1(500ms), 사진은 최대 650ms reveal. 스크롤 다운 유도 표시는 가급적 생략. 배경 영상 자동 재생 금지.

### 4.2 JOURNAL `/journal` — IGNANT식 아카이브 갤러리

- 상단 제목: `Journal` / `사진으로 기록한 여행의 장면들`.
- 리스트 헤더 아래 필터: `All / Year / Place` (화면이 좁으면 드롭다운).
- 데스크톱: **12컬럼 비대칭 그리드**. 카드 너비 예시 5/7, 7/5, 4/4/4 컬럼 혼합. 각 카드 높이는 사진 원본 비율 유지.
- 카드: 사진, 소형 연도+도시, 제목, 선택적 한 줄 설명. 테두리·그림자·둥근 모서리 남용 금지.
- 카드 간 여백: 가로 24~40px, 세로 52~80px.
- 이미지 Hover: `scale(1.015)` 이하 + 약한 opacity 전환, 효과 200~300ms.
- 사진 비율: 4:5, 3:2, 1:1, 16:9의 의도적인 혼합. *Masonry 무조건 적용 금지* — 텍스트와 독서 순서를 유지할 편집 그리드 사용.
- 검색은 MVP 제외. 게시물이 충분히 쌓이면 태그·연도 필터를 먼저 추가.

### 4.3 JOURNEY DETAIL `/journal/[slug]` — Exposure식 긴 호흡

**목적:** 사용자에게 실제로 여행 사진집을 넘기듯 읽는 경험 제공.

```text
[미니멀 헤더]

            VOL. 002  /  JAPAN  /  AUTUMN 2026
               천천히 걷는, 어느 가을의 하루
             날짜 · 지역 · 읽는 시간(선택)

[전폭/넓은 Hero 사진 — 화면과 원본 비율 조정]

           첫 문단 2~4행 (본문 폭 660px)

[사진 1장: 좌측 정렬 / 본문보다 넓게]
               캡션 (있을 때만)

               소제목 01 — 도착
               산문 2~4문단

[세로 사진 2장 나란히 — 각각 독립 캡션]

         [중간 풀블리드 사진 — 연출의 정점]

               소제목 02 — 오래 머문 곳
               산문 + 장소 확인 카드(선택)

[사진과 문장이 번갈아 나오는 장면 3~6개]

               짧은 마무리 문장

[방문 장소 요약 / 지도 보기]
[이전 · 다음 여행기]
```

**본문 레이아웃 블록 유형**

| 블록 | 용도 | 규칙 |
|---|---|---|
| `StoryIntro` | 여행기의 도입 | 너비 최대 680px, 첫 문단 2~4줄 이상도 허용 |
| `TextSection` | 서사·설명 | 한 섹션당 권장 100~350자(필요하면 가변) |
| `ImageSingle` | 단일 사진 | 세로/가로 원본 비율 유지, 배경에 맞춘 자연스러운 너비 |
| `ImageFullBleed` | 전환점·클라이맥스 | 한 글에 0~2회 권장, 남발 금지 |
| `ImagePair` | 장면 대비·연결 | 사진 2장의 톤을 고려해 나란히 배치 |
| `ImageTriptych` | 세부 관찰 | 3장 조합, 모바일은 가로 스크롤 대신 세로 배열 권장 |
| `Quote` | 여행 메모·인용 | 사용자가 실제 작성한 말만 따옴표 처리 |
| `PlaceNote` | 장소·실용 정보 | 본문을 방해하지 않는 작은 주석 또는 접힘 영역 |
| `DayDivider` | 2박 3일 등 날짜 전환 | 큰 번호/일자/짧은 설명으로 리듬 생성 |
| `RouteSummary` | 확인된 방문지 요약 | 마지막에 표시, 위치 정확도 표시 |

- 여행기 한 편 추천 이미지 수: **15~35장**(스토리 길이에 따라 조절, 제한 아님).
- 여행기가 2박 3일 이상이면 `DayDivider` 또는 장별 소제목으로 구분하되 무조건 일기 형식으로 반복하지 않는다.
- 글쓰기 톤 기본값: 과장 없는 1인칭 회상, 사진 설명 반복 최소화, 사용자가 적은 메모·기억을 가장 높은 신뢰 원천으로 취급.
- 방문지 카드는 근거가 있는 장소만 표시한다. 가게명·영업정보·가격은 별도로 검증하지 않았다면 자동 단정하지 않는다.
- 데스크톱 본문 너비 620~700px, 이미지 최대 1,200~1,440px, 캡션 12~13px.
- 첫 이미지 LCP를 고려해 히어로 이미지에 우선 로딩, 나머지는 lazy-load.

### 4.4 PLACES `/places` — 장소 기반 탐색

- 기본: `Visited Places` 제목, 국가·도시 목록, 각 여행기 커버 썸네일.
- 지도는 **선택적 보조 수단**. 기본 화면의 주인공은 사진과 장소명이다.
- 지도 구현 MVP: 정적 지도 요약 또는 지도 버튼. 실제 지도 라이브러리 도입은 2차 단계.
- 2차: MapLibre GL JS 등으로 지도 핀, 장소 카드, 해당 여행기 연결.
- 지도에서 실제 이동 경로는 **GPS 사진만으로 확정하지 않는다**. 사진 촬영 지점 간 선은 ‘추정 이동 순서’로 표시하고 실제 경로인 양 렌더링하지 않는다.
- 정확한 집 주소, 병원, 아이 관련 일상적 위치 등 민감 장소는 공개 지도 데이터에서 제외.

### 4.5 ARCHIVE `/archive` — 압축된 시간축

- 연도(2026, 2025...)별 그룹, 각 여행의 날짜·도시·제목·썸네일.
- 최소한의 시각적 장식, 키보드 탐색, 빠른 접근을 우선.
- 시간 순서 필터는 발행일보다 **여행 시작일** 기준으로 기본 정렬.

### 4.6 ABOUT `/about`

- 이 아카이브를 만든 이유를 3~5문단 내외로 소개.
- 카메라·사진 철학은 선택적으로 소개. 개인 신상·가족 상세 정보는 의도적으로 비공개.
- 사이트 운영 방식이나 촬영 장비는 별도의 ‘Colophon’ 하단 섹션으로 분리 가능.

### 4.7 PHOTO LIGHTBOX — 사진 감상의 중심

- 이미지 클릭 → 화면 전체 오버레이, 검은색 또는 따뜻한 잉크색 배경.
- 이전/다음 버튼, `Esc` 닫기, 좌우 화살표 탐색, 모바일 스와이프.
- 원본 비율 유지, 이미지가 뷰포트를 벗어나지 않도록 `object-fit: contain`.
- 캡션·촬영 정보는 기본 최소 노출, 확대/정보 펼치기 선택 가능.
- 키보드 포커스 트랩, 닫은 후 기존 사진으로 포커스 복귀, 스크롤 잠금 해제 보장.
- **원본 고해상도 RAW 다운로드 기능은 제공하지 않는다.** 공개용 웹 버전만 사용.

### 4.8 404 / EMPTY STATES

- `아직 기록이 없는 페이지입니다.` 등 사이트 톤에 맞춘 문구.
- 사진이 없는 연도/도시 필터에서도 오류가 아니라 정상적인 빈 화면을 제공.

---

## 5. 반응형 디자인 규칙

| 기기 | 범위(기본 제안) | 외곽 여백 | 구성 |
|---|---|---|---|
| 모바일 | < 768px | 18~22px | 1컬럼, 메뉴 버튼, 원본 비율 유지 |
| 태블릿 | 768~1199px | 32~48px | 2컬럼 편집 그리드 |
| 데스크톱 | 1200px 이상 | 64~96px | 12컬럼 편집 그리드, max 1440px |

**모바일 원칙**
- 홈에서는 대표 사진이 첫 화면을 차지하되 제목을 볼 수 있도록 높이 제한을 둔다.
- 모바일 메뉴는 버튼으로 열며, 메뉴 전체는 투명한 장식보다 명확한 패널로 표시.
- 본문은 16~18px(기본 17px)이고 line-height 1.75 전후.
- 이미지 2~3개 페어링은 필요 시 1컬럼으로 전환한다. 모바일에서 임의로 중요한 부분을 잘라내지 않는다.
- 버튼·터치 요소는 터치 가능한 충분한 크기(권장 최소 약 44px)를 확보한다.
- 사진 전환 효과는 모바일 성능에 맞춰 제한한다.
- 좌우 스크롤이 콘텐츠 전체에서 발생하지 않아야 한다(의도된 카루셀 제외).

---

## 6. 디자인 토큰(디자인 시스템)

### 6.1 색상

| Token | HEX | 사용 |
|---|---|---|
| `--color-paper` | `#F6F3ED` | 전체 페이지 배경 |
| `--color-linen` | `#E4E0D6` | 미묘한 구분선·카드 배경 |
| `--color-taupe` | `#A69D8D` | 보조 메타데이터·레이블 |
| `--color-olive` | `#4F594C` | 아주 제한적인 강조색 |
| `--color-ink` | `#24231F` | 제목·본문·주요 UI |
| `--color-caption` | `#69655F` | 대비를 확보한 캡션 |
| `--color-overlay` | `#191A18` | 라이트박스 배경 |

- 메인 배경은 거의 순백이 아닌 **종이 같은 웜 아이보리**로 유지한다.
- 이미지별 색감이 다른 경우에도 UI 컬러는 변하지 않는다.
- 주황색 CTA, 과한 그라디언트, 반투명 유리 카드, 둥근 SaaS형 카드 지양.
- WCAG 대비를 검증하고 연한 Taupe는 작은 본문 글자에 직접 사용하지 않는다.

### 6.2 글꼴

- 한국어 긴 제목: `Noto Serif KR` (대안: 본명조 계열, 실제 웹 라이선스·로딩 확인).
- 영문 큰 제목/장식: `Cormorant Garamond`.
- 한국어·영어 본문과 UI: `Pretendard` (fallback: system-ui, sans-serif).
- 최소 굵기: 본문 400, 제목 400~600. 극단적으로 얇은 100/200은 금지.
- 외부 폰트 호출 수 최소화, 가능하면 웹폰트 subset/자체 호스팅.

### 6.3 글자 크기(초기 권장값; clamp 사용)

```css
:root {
  --font-ui: 'Pretendard', system-ui, sans-serif;
  --font-editorial: 'Noto Serif KR', serif;
  --font-display-en: 'Cormorant Garamond', Georgia, serif;
  --color-paper: #F6F3ED;
  --color-linen: #E4E0D6;
  --color-taupe: #A69D8D;
  --color-olive: #4F594C;
  --color-ink: #24231F;
  --color-caption: #69655F;
  --color-overlay: #191A18;
  --font-body-size: clamp(1rem, .9rem + .2vw, 1.125rem);
  --font-hero-size: clamp(2.5rem, 5vw, 5.6rem);
  --content-max: 1440px;
  --reading-max: 680px;
}
```

### 6.4 공간과 질감

- 기본 여백 배수: 4/8/12/16/24/32/48/64/80/96/128px.
- 카드 라운드: **0~4px**. 사진에는 기본적으로 라운드 없음.
- 기본 그림자: 없음. 라이트박스·모달은 명도 차이로 구분.
- 이미지와 이미지의 거리는 사진의 밀도·서사에 따라 조절; 동일 간격만 반복하지 않는다.
- 별도의 디지털 노이즈·필름 그레인을 UI 전체에 덮지 않는다. 사진 원본의 질감을 보존한다.

---

## 7. 모션 명세 — CSS 우선, GSAP 선택

| 상황 | 기본 기술 | 권장 효과 | 제한 |
|---|---|---|---|
| 헤더/텍스트 등장 | CSS | fade/translateY 8~16px, 450~650ms | 1회만 |
| 사진 hover | CSS | scale 1.01~1.015, 250ms | 데스크톱 포인터에서만 |
| 사진 reveal | IntersectionObserver 또는 CSS | opacity 0→1, 350~650ms | 지연 최소화 |
| 긴 에세이 주요 장면 | GSAP ScrollTrigger | 장면별 reveal, 필요한 경우 제한적 pin | 한 글 1~2곳 수준 |
| 라이트박스 전환 | CSS/React | 150~250ms | 빠른 닫기 보장 |
| 일반 스크롤 | 네이티브 | 강제 스무스 스크롤 없음 | 접근성·모바일 성능 우선 |

**필수:** `prefers-reduced-motion: reduce`일 때 거의 모든 시각 효과를 비활성화하고, 콘텐츠가 숨은 상태로 남지 않게 한다. GSAP ScrollTrigger는 컴포넌트 해제 시 정리(cleanup)하고 화면 크기가 변하면 재계산한다.

---

## 8. 기술 스택 및 책임 분리

### 8.1 공개 사이트

- **Astro**: 정적 사이트 생성(SSG), 페이지·레이아웃·콘텐츠 컬렉션.
- **TypeScript**: 데이터 스키마 검증 및 개발 안정성.
- **Tailwind CSS**: 레이아웃 유틸리티(프로젝트 버전에 맞는 설치법 사용), 사이트 토큰은 CSS 변수로 관리.
- **MDX**: `ImagePair`, `ImageFullBleed`, `DayDivider`, `PlaceNote` 같은 재사용 편집 블록을 원고 내에서 활용. 단순 글만 있으면 Markdown도 허용.
- **React (선택)**: 라이트박스, 복잡한 필터 및 인터랙션 부품만 부분 탑재(Astro islands).
- **21st.dev**: 컴포넌트 레퍼런스/코드 제공원. 라이선스와 의존성을 점검한 뒤 프로젝트 디자인 시스템에 통합.
- **GSAP + ScrollTrigger (선택)**: 에세이 상세의 의미 있는 연출에만.
- **GitHub**: 코드와 공개용 콘텐츠 버전 관리. 개인 계정의 비공개 저장소 우선.
- **Vercel**: Astro 정적 사이트 배포, Preview 배포, HTTPS, 사용자 도메인.

### 8.2 로컬 사진/AI 제작기

- **운영 위치:** Windows PC의 localhost (`127.0.0.1` 바인딩 기본).
- **1차 MVP:** `Python` CLI/간단한 로컬 UI 또는 `Node` 로컬 스크립트. 사진 메타데이터는 ExifTool처럼 HEIC와 카메라 포맷에 강한 검증 도구 권장.
- **2차:** 편집 경험이 필요할 때에만 `FastAPI + React` 등의 로컬 웹 편집기 분리.
- **영상/사진 처리:** HEIC/HEIF·JPEG·PNG·RAW의 처리 범위를 나누고 공개 사진은 AVIF/WebP/JPEG 변형 생성.
- **AI 연동:** 교체 가능한 Provider Adapter 구조. API 키는 로컬 환경 변수/OS 비밀 저장소에서 읽고 소스 저장소에 넣지 않는다.
- **좌표 변환:** 사용자가 허용할 경우에만 지도 지오코딩 API 사용. 위치·사진 전송량 최소화.

### 8.3 배포 역할

```text
[비공개 원본] iCloud Photos / Sony 카메라 폴더
     │          (절대 직접 변경하지 않음)
     ▼
[로컬 복사본] 프로젝트별 작업 디렉터리
     │
     ├─ EXIF/GPS/중복/품질/장소 클러스터
     ├─ AI 사진 설명·스토리 초안 (선택된 이미지·메모만)
     └─ 사용자 검토/사진 편집/공개 승인
              │
              ▼
       [공개용 결과물]
       MDX + 위치정보 제거된 최적화 사진
              │
              ▼
        GitHub repository
              │ git push / PR merge
              ▼
            Vercel
              │
              ▼
         개인 도메인 공개
```

**중요:** `Vercel = 배포·호스팅`, `GitHub = 이력·자동 배포 연결`, `Astro = 페이지 생성`, `로컬 제작기 = 사진과 AI 처리`. Vercel 자체에는 개인 블로그용 글쓰기 편집기나 iCloud Photos 전체 접근 기능이 기본 내장된 것이 아니다.

---

## 9. iCloud 사진 수집·처리 명세

### 9.1 수집 경로 우선순위

1. **우선:** [Windows용 iCloud](https://support.apple.com/ko-kr/guide/icloud-windows/icw9f0ba665f/icloud) 공식 앱 → Windows 파일 탐색기의 iCloud 사진 → 사용자가 다운로드한 사진을 별도 작업 폴더로 복사.
2. **보조:** [iCloud.com/photos](https://www.icloud.com/photos/)에서 사용자가 원하는 앨범/날짜 범위를 직접 다운로드.
3. **주력 사용 금지:** 공유 앨범의 공개 URL이나 내부 JSON 파싱. 메타데이터·원본 품질·공개 범위·비공식 인터페이스 위험이 있음.
4. **권장하지 않음:** `pyicloud` 등 비공식 Apple 로그인 자동화. 인증/세션 갱신/보안·유지보수 부담이 큼.
5. **향후 확장:** iOS 앱을 별도로 개발할 경우 Apple PhotoKit 기반 사용자 권한 수집 검토.

**참고 경로(사용자 환경에 따라 다름):** `C:\Users\<사용자>\Pictures\iCloud Photos\Photos`. 실제 경로는 OS에서 확인한다. 파일이 자리표시자/썸네일이면 먼저 다운로드를 완료해야 한다.

**엄격한 보호 규칙:** iCloud 동기화 폴더의 사진 삭제·이동·편집·일괄 리네임 금지. 동기화 동작이 다른 기기의 사진에 영향을 줄 수 있다.

### 9.2 입력 형식

- iPhone: HEIC/HEIF, JPEG, Live Photo 조합(정지 이미지+비디오), MOV, MP4.
- Sony a6400 등 카메라: JPEG, RAW(ARW), MP4 등. `RAW+JPEG` 짝은 하나의 장면으로 취급하고 JPEG를 우선 미리보기로 활용.
- 오리지널 RAW/HEIC는 로컬에서 유지하며, 공개용 웹 이미지는 별도 렌더링.
- PNG 등 스크린샷은 사진과 구분하고 기본 추천에서 낮은 우선순위(필요하면 포함).

### 9.3 파이프라인 단계

1. **Source Inventory:** 읽기 가능한 원본 파일 목록 확보, `relative_path`, `size`, `mtime`, 포맷, 안정적 해시 계산.
2. **Copy:** 로컬 작업 폴더에 안전하게 복사, 재시도/건너뛰기 지원, 원본 수정 없음.
3. **Metadata:** ExifTool 등으로 EXIF/XMP 읽기; `DateTimeOriginal`, 타임존 오프셋, GPS, 방향, 기종, 크기.
4. **Normalization:** 촬영 시간대 보정, 회전 방향 정규화, Live Photo·RAW/JPEG 짝 연결.
5. **Duplicate Grouping:** 해시 일치, 지각 해시 유사, 연사·라이브포토·RAW+JPEG 관계 표시. 자동 원본 삭제 금지.
6. **Geographic Clustering:** GPS 있는 사진의 근접도 + 촬영 시각 기반 방문지 후보 산출. 예시 임계값 200m/60분은 시작값일 뿐, 사용자가 조절 가능하도록.
7. **Scene/Quality Analysis:** 흔들림, 노출, 얼굴 가림, 구도, 다양한 장면·감정 흐름을 고려해 추천. ‘선명함 점수만으로’ 선별 금지.
8. **Place Enrichment:** 좌표 역지오코딩 → 주변 장소 후보 생성 → **사용자 확인**. 가게 간판 OCR이나 지도 매칭은 확인 전 추정.
9. **Draft Generation:** 일자·방문지별 AI 초안, 사진 배열 제안, 캡션 후보 생성.
10. **Review:** 사진 포함 여부·글·지명·얼굴·정확한 위치·저작권·공개 범위 검토.
11. **Export:** 공개용 이미지 생성(메타데이터 제거) + 유효한 MDX + 미리보기.
12. **Publish:** 로컬 승인 후 GitHub 반영 → Vercel 배포.

### 9.4 시간·장소 데이터의 신뢰도

- 정렬 우선순위: `DateTimeOriginal + OffsetTimeOriginal` > 대체 EXIF > 파일 생성시간. 타임존 미상 시 `unknown`으로 표시.
- GPS가 없으면 앞뒤 사진으로 장소를 추정할 수 있으나 **확정 지도 핀 생성 금지**.
- 장소 식별 confidence: `confirmed`, `suggested`, `unknown`.
- 서로 다른 시간대(한국/해외) 여행과 카메라 날짜 설정 오류에 대비해 수동 시간 보정 기능 필요.
- 교통 경로는 GPS 사진 좌표의 연결일 뿐 실제 차량/보행 경로를 검증한 것이 아님을 표시.

### 9.5 공개용 이미지 처리

- 기본 포맷: WebP 또는 AVIF + 필요 시 JPEG 대체.
- 히어로: 원본 비율 유지, 목표 폭 약 1600~2200px(화면·용량·콘텐츠에 따라 최적화).
- 본문 사진: 800/1200/1600px 등의 반응형 버전, `srcset/sizes` 사용.
- 썸네일: 320~960px 범위에서 용도별 생성.
- 사진의 색을 바꾸는 강제 AI 필터·자동 LUT 적용 금지. 사용자가 보정한 색감 유지.
- EXIF GPS, 기기 고유정보, 위치 관련 XMP 등 **공개용 출력에서 제거**. 화면에 보이는 메타데이터도 승인된 값만.
- 이미지 alt는 단순 키워드 반복이 아니라 화면에서 실제 보이는 장면의 짧은 설명.
- 빌드에는 모든 원본을 포함하지 말고 **사용자가 공개 승인한 이미지만** 포함.

---

## 10. AI 글쓰기 정책·프롬프트 계약

### 10.1 AI의 역할

AI는 **여행을 대신 기억하는 작가가 아니라, 사용자의 기록을 편집하는 에디터**다. 사진 자체에서 확인할 수 있는 사실과 메모, 위치 후보를 구분한다.

입력 예시:

```json
{
  "trip": {"dates": ["2026-10-01", "2026-10-03"], "regions": ["..."], "tone": "quiet-editorial"},
  "photos": [{"id": "p001", "capturedAt": "...", "placeStatus": "suggested", "scene": "..."}],
  "userNotes": ["첫날 비가 왔다", "그 골목의 빵 냄새가 기억난다"],
  "constraints": {"inventEmotions": false, "inventReviews": false, "confirmPlaces": true}
}
```

### 10.2 글 톤 기본값

- 담백하고 구체적인 한국어, 문학적이되 과장되지 않은 문장.
- 사진마다 사물을 낱낱이 설명하는 캡션 반복을 피한다.
- 1인칭은 사용자 메모에 근거할 때만 사용하고 미확인 감정·행동을 만들어내지 않는다.
- 사진이 충분히 말하는 곳에서는 텍스트를 짧게, 정보가 필요한 곳에서는 단정하지 않고 구체적으로.
- 기본 제안: 제목 3개, 도입부 2개, 장면 배열 1개, 본문 초안 1개. 사용자가 대안 선택 가능.
- 모호한 장소/사건은 `[확인 필요]` 표기로 남기되 공개 화면에 그대로 발행되지 않도록 검사.

### 10.3 편집기에서 확인받을 질문(일괄 표시)

- `이곳이 실제로 방문한 장소가 맞나요?`
- `이 사진 속 인물을 공개해도 될까요?`
- `이 장면에서 기억나는 일이나 감정이 있나요?`
- `이 식당의 이름·음식 평가를 본문에 포함할까요?` (자료 없으면 자동 평점/평가 작성 금지)

### 10.4 AI 호출 전략

- 모든 원본 350장을 무조건 고해상도로 모델에 보내지 않는다.
- 로컬 저해상도 프리뷰·중복 그룹 결과를 바탕으로 **대표/애매한 사진만 선택적으로** 전송.
- 전송 전에 사용자 확인(기본 opt-in), 처리 결과·비용·삭제 정책 기록.
- Provider Adapter 인터페이스로 공급업체 교체 가능. 외부 AI를 사용하지 않는 수동 모드도 허용.

---

## 11. 콘텐츠 모델·파일 포맷

### 11.1 여행기 frontmatter 필드

```yaml
---
title: "우리가 머물렀던 계절"
subtitle: "The places we carry"
slug: "quiet-autumn-journey"
status: "draft"                 # draft | review | approved | published
tripStart: "2026-10-01"
tripEnd: "2026-10-03"
publishedAt: null
country: "KR"
regions:
  - "예시 지역"
summary: "짧은 여행 소개문"
cover: "../../assets/trips/quiet-autumn-journey/cover.webp"
coverAlt: "해 질 무렵 조용한 풍경"
tags: ["autumn", "slow-travel"]
featured: false
visibility: "public"            # public | unlisted(local only) | private(local only)
placeRefs: ["place-01"]
photoIds: ["p001", "p003", "p011"]
---
```

**구현 주의:** 위 YAML의 경로와 `status`, `visibility`는 계약 예시다. 실제 Astro 버전에 맞는 content collection schema/Zod와 image import 규칙으로 확정한다. 공개 빌드에는 `status=published` 및 `visibility=public`만 포함한다. `unlisted`가 단순 비노출일 뿐 접근 제한이 아니라는 오해를 피하기 위해 실제 비공개 원고는 **공개 사이트 프로젝트 밖에 저장**한다.

### 11.2 사진/장소 매니페스트

```ts
type PlaceConfidence = 'confirmed' | 'suggested' | 'unknown';

type PhotoAsset = {
  id: string;
  tripId: string;
  sourceId: string;            // 로컬 관리용 — 공개 빌드에 불필요하면 제거
  capturedAt?: string;
  camera?: string;
  width: number;
  height: number;
  publicSrc?: string;          // 공개 승인된 변환 이미지 상대 경로
  alt: string;
  caption?: string;
  layout?: 'hero' | 'single' | 'pair' | 'triptych' | 'fullBleed';
  publicationApproved: boolean;
  hasPeople: boolean;
  // 실제 EXIF의 GPS/사적 위치는 공개 매니페스트에 포함하지 않음
};

type Place = {
  id: string;
  name: string;
  city?: string;
  country?: string;
  confidence: PlaceConfidence;
  publicCoordinates?: { lat: number; lng: number }; // 사용자 명시 승인 시에만
  tripSlugs: string[];
};
```

### 11.3 파일 관리

```text
elsewhere/
├── README.md
├── package.json
├── astro.config.mjs
├── src/
│   ├── content.config.ts
│   ├── content/
│   │   └── trips/
│   │       └── quiet-autumn-journey.mdx
│   ├── assets/
│   │   └── trips/
│   │       └── quiet-autumn-journey/
│   │           ├── cover.webp
│   │           ├── scene-01.webp
│   │           └── scene-02.webp
│   ├── components/
│   │   ├── SiteHeader.astro
│   │   ├── SiteFooter.astro
│   │   ├── JourneyCard.astro
│   │   ├── EditorialGrid.astro
│   │   ├── StoryIntro.astro
│   │   ├── ImageSingle.astro
│   │   ├── ImagePair.astro
│   │   ├── ImageFullBleed.astro
│   │   ├── DayDivider.astro
│   │   ├── PlaceNote.astro
│   │   └── Lightbox.tsx         # 필요할 때만 React
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── journal/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── places.astro
│   │   ├── archive.astro
│   │   └── about.astro
│   └── styles/
│       ├── tokens.css
│       └── global.css
├── public/
│   ├── favicon.svg
│   └── og-default.jpg
├── tools/
│   ├── ingest/                 # 로컬 사진 분석 명령
│   ├── draft/                  # AI 초안 모듈
│   ├── export/                 # 공개 승인 및 내보내기
│   └── checks/                 # 개인정보·경로·빌드 검사
└── docs/
    ├── DESIGN_SYSTEM.md
    ├── CONTENT_GUIDE.md
    ├── PUBLISHING.md
    └── DECISIONS.md
```

- 실제 원본은 예컨대 `D:\TravelArchive\originals\` 등에 보관하며 저장소 밖에 둔다.
- 공개 이미지 양이 증가하면 `src/assets` 대신 별도 객체 스토리지/CDN로 이동할 수 있는 Adapter를 고려한다.
- Astro의 이미지 최적화를 활용하려면 공개용 이미지를 가급적 `src/` 아래에 두고 `<Image />`, `<Picture />`로 불러온다. `public/`은 별도 자동 최적화가 되지 않음을 유의.
- 사진 파일이 많아지면 GitHub 저장소 크기/빌드 시간을 점검하고 전용 스토리지 검토.

---

## 12. 로컬 편집기의 핵심 UX

### 12.1 사용자 플로우

```text
[프로젝트 만들기]
    ↓ 날짜 범위/사진 폴더/여행 이름
[사진 인덱싱]
    ↓ 파일 수·읽기 상태·메타데이터 오류 표시
[장소·일정 검토]
    ↓ 날짜 타임라인 + 지도 후보 + 신뢰도
[사진 선별]
    ↓ 대표/상세/중복 그룹, 제외/포함, 커버 지정
[기억 메모]
    ↓ 방문 경험·감정·사건 키워드 입력
[AI 원고 생성]
    ↓ 제목/본문/사진 배치 비교
[디자인 미리보기]
    ↓ 데스크톱·모바일 확인
[공개 전 안전 검사]
    ↓ 얼굴·GPS·장소·감정/평가·저작권 승인
[GitHub 반영 및 발행]
    ↓ Vercel 배포 결과 확인
[완료 / 수정 / 롤백]
```

### 12.2 편집 화면 레이아웃(데스크톱)

```text
┌─────────────────────────┬──────────────────────────────────┬────────────────┐
│ 여행 목록·날짜/장소     │ 사진 그리드·원고·미리보기        │ 속성/확인 패널 │
│                         │                                  │                │
│ [2026 가을여행]         │ [사진 카드][사진 카드][사진]     │ 촬영일시       │
│   1일차                 │ [글 블록 편집]                   │ 장소 후보      │
│   2일차                 │ [사진 정렬/추가/제외]            │ 공개 여부      │
│   3일차                 │                                  │ 캡션·메모      │
│                         │                                  │                │
└─────────────────────────┴──────────────────────────────────┴────────────────┘
```

- 여러 사진 선택, 키보드 접근, undo/redo, 자동 저장(로컬), 작업 재개 지원.
- 삭제는 편집 프로젝트에서 제외할 뿐 원본을 삭제하지 않음.
- 게시 전 `Preview` 링크로 실제 Astro 랜더링 확인. 사적인 초안은 외부 Preview 배포에도 올라가지 않게 처리.
- 첫 번째 릴리스에서는 발행 버튼 대신 **승인된 파일 내보내기 + 수동 git push**도 허용(MVP 단순화).

---

## 13. 21st.dev / GSAP / Recent / Manus 적용 가이드

### 13.1 21st.dev — 채택, 그러나 종속 금지

**탐색 키워드:** `minimal navigation`, `editorial grid`, `masonry gallery`, `image lightbox`, `photo viewer`, `mobile menu`, `image comparison`.

- 기능은 유용해도 Cereal식 미감에 맞지 않는 그림자, rounded-xl, 불필요한 버튼은 제거.
- 외부 컴포넌트의 라이선스·의존성·접근성을 확인한다.
- Astro에서 정적 그리드라면 React 컴포넌트를 억지로 이식하지 않는다.
- 외부 CSS/React 라이브러리를 사이트 전체에 무조건 적용하지 않는다.

**Codex 연결(확인 가능한 공식 진입점)**

```bash
# CLI 방식 — 설치 실행 전에 최신 안내 확인
npx @21st-dev/cli@latest init --client codex

# 또는 Codex 플러그인 마켓플레이스 방식
codex plugin marketplace add 21st-dev/codex-plugin
```

위 두 방식은 대안이며 반드시 둘 다 설치할 필요는 없다. 추가 인증/플러그인 설치 단계는 [21st.dev MCP 공식 페이지](https://21st.dev/mcp)와 [21st-dev/codex-plugin](https://github.com/21st-dev/codex-plugin)을 기준으로 따른다. API 키를 GitHub에 커밋하지 않는다.

### 13.2 GSAP — 선택 채택

- 1차에는 CSS transition + 필요한 경우 IntersectionObserver만으로 시작.
- 별도의 사진 에세이 주요 장면에만 GSAP ScrollTrigger 적용.
- ScrollTrigger, resize, hydration, route transition, reduced motion 처리를 검증.
- 장면 고정(pin)이 사진 감상을 방해하면 제거한다.

### 13.3 Recent(구 Godly) — 레퍼런스만

- 실제 개발 자산이나 의존성으로 쓰는 도구가 아니라 조사 자료.
- 선정할 레퍼런스는 최대 10개로 제한하고 `왜 참고하는지`를 DESIGN_SYSTEM.md에 기록.
- 복제보다 그리드/여백/모션의 원리를 재구성한다.

### 13.4 Manus — 초기 제외

- Codex와 중복되는 자동 코딩·조사 역할이 크므로 MVP 의존성을 만들지 않는다.
- 자료 조사나 대안 실험이 필요한 경우만 별도 도구로 검토.

---

## 14. GitHub + Vercel 배포 명세

1. 개인 GitHub 계정의 **비공개 저장소**로 초기 개발.
2. Astro 사이트가 로컬에서 `build`되는지 확인.
3. Vercel에 저장소를 연결, Astro 자동 감지 및 정적 배포.
4. `main`에 반영된 승인된 커밋만 프로덕션 배포.
5. 작업 브랜치/PR은 Preview 배포로 확인. 단, **민감한 사진·비공개 원고를 Preview에 배포하지 않음**.
6. 초기에는 `*.vercel.app` 주소 사용 후 실사이트명을 확정하면 개인 도메인 연결.
7. Vercel의 HTTPS, 도메인, 환경 변수, 배포 로그를 점검.
8. 비밀키, 개인 GPS 원본, 원본 RAW, 로컬 DB, `.env` 등은 `.gitignore`와 배포 검사로 제외.
9. 새 여행기 발행 = `MDX + 공개용 사진 추가 → 검사 → commit/push → Vercel 배포 → 실사이트 확인`.
10. 문제 발생 시 이전 Git commit을 되돌리거나 검증된 이전 배포 버전으로 복구.

**요금/운영 원칙:** 개인 비상업 사이트는 Vercel Hobby로 시작할 수 있다. Hobby는 **개인·비상업 용도 제한**이 있으므로 광고/협찬/수익화 또는 사업 목적이 생기면 Pro 등 적합한 요금제 검토. 도메인, AI API, 이미지 스토리지는 별도 과금 가능성이 있다. 요금·한도는 운영 시점에 재확인.

---

## 15. 보안·개인정보·윤리

### P0 — 절대 지켜야 하는 항목

- [ ] iCloud 동기화 파일의 이름 변경·이동·삭제·수정 없음.
- [ ] 공개 파일에서 EXIF GPS 및 비공개 메타데이터 제거.
- [ ] 얼굴·가족·아이·실시간 생활 반경 노출 사진은 사용자 개별 승인.
- [ ] 정확한 거주지·일상 동선·숙소 호실 등 정보 자동 노출 금지.
- [ ] 사용자가 승인하지 않은 사진은 GitHub·Vercel·외부 CDN 전송 금지.
- [ ] 외부 AI API 전송 전 사진 미리보기, 데이터 범위, 비용을 안내하고 동의 받기.
- [ ] 비밀키/Apple 자격 증명/액세스 토큰 소스 코드 내 포함 금지.
- [ ] 공개 사이트 저장소 및 빌드 산출물에 로컬 원본·DB·검토 로그 없음.
- [ ] AI 생성 사진 설명·장소명·식당 정보 중 불확실한 내용을 사실로 발행 금지.
- [ ] 공개 페이지의 사진 저작권과 타인의 사진 이용 허가 확인.

### P1 — 추가 권장

- 배포 전 정적 검사로 `GPSLatitude`, `GPSLongitude`, API 키 패턴, 비공개 폴더 경로 등을 검사.
- 공개 프로젝트 `.gitignore`와 git hook으로 비밀 파일 커밋 탐지.
- 위치 API 사용 시 요청 수 제한, API 키 도메인/서버 제한.
- 원본은 별도 백업(최소 2곳)과 복구 테스트 실시. GitHub는 원본 사진의 백업 서비스가 아님.
- 실제 인물 사진에 대해 불필요한 얼굴 인식·개인 식별 기능을 구현하지 않음.

---

## 16. 성능·접근성·품질 기준

### 16.1 목표 지표

- LCP: 주요 템플릿 모바일 실측에서 **2.5초 이하 목표**(테스트 네트워크 기준 명시).
- CLS: **0.1 이하 목표**, 사진 너비·높이 명시.
- INP: **200ms 이하 목표**(실사용 데이터 확보 시).
- Lighthouse 모바일 성능·접근성·SEO 점검, 핵심 화면 목표 점수 90점 이상(네트워크·툴 편차 감안).
- 이미지 포맷과 `sizes/srcset`, lazy-loading, 사전 로딩 대상 관리.
- 접근성: 의미 있는 alt, 키보드 포커스, 충분한 대비, reduced-motion, 올바른 heading 계층.
- JavaScript 최소화: 정적인 페이지는 가능한 0에 가까운 클라이언트 JS.

### 16.2 테스트 화면

- iPhone급 좁은 화면(375~390px), 일반 모바일(430px), 태블릿(768px), 노트북(1280px), 데스크톱(1440px 이상).
- Safari/iOS, Chrome/Windows, Edge/Windows 주요 동작 확인.
- 긴 한글 제목, 사진 없는 글, GPS 없는 여행, 이미지 1장만 있는 여행, 세로 사진 연속 등 예외 데이터.

---

## 17. 구현 로드맵·우선순위

### Phase 0 — 프로젝트 초기화 및 기준 구축 [P0]

- [ ] Astro + TypeScript + Tailwind 프로젝트 초기화.
- [ ] 폰트/색상/간격 토큰 구성, 코드 품질·빌드·기본 테스트.
- [ ] `sample-trip-01`, `sample-trip-02` 샘플 여행기(저작권 문제 없는 임시 이미지) 생성.
- [ ] 실제 iCloud 사진 사용 전 원본 복사/공개 승인 정책 구현.

**완료 조건:** 로컬 빌드 성공, 디자인 시스템 페이지 확인, 어떠한 개인 원본도 코드 저장소에 없음.

### Phase 1 — 공개 웹사이트 MVP [P0]

- [ ] 공통 헤더·푸터·반응형 레이아웃.
- [ ] Home (대표 여행/Selected Stories).
- [ ] Journal (비대칭 편집 그리드).
- [ ] Journey detail (최소 5개 블록: Intro, Text, Single, Pair, FullBleed).
- [ ] Archive / About 기본 화면.
- [ ] 클릭 가능한 Lightbox.
- [ ] 데스크톱/모바일 시각 검수.

**완료 조건:** 여행기 2편을 새 코드를 작성하지 않고 MDX/사진 추가만으로 발행 가능.

### Phase 2 — 배포와 콘텐츠 표준화 [P0]

- [ ] GitHub 비공개 저장소 연결.
- [ ] Vercel Preview/Production 배포.
- [ ] MDX 콘텐츠 스키마 검증, 발행 상태 관리.
- [ ] SEO 메타, OG 이미지, 사이트맵, 404.
- [ ] 이미지 최적화 및 개인정보 사전 검사.

**완료 조건:** `git push` → 자동 배포 → 공개 URL 검증; 비공개 사진/원본이 배포 산출물에 없음.

### Phase 3 — 사진 가져오기·분석 [P0/P1]

- [ ] Windows용 iCloud 동기화 사진을 복사하는 로컬 툴.
- [ ] HEIC/JPEG/ARW 등 파일 인덱싱, EXIF 시간·GPS 추출.
- [ ] 중복·RAW+JPEG·Live Photo 그룹 정리.
- [ ] 날짜/장소 클러스터 추천 및 사용자 수정.
- [ ] 대표 사진 선정 기능과 이미지 웹 변환.

**완료 조건:** 한 여행의 사진 100~300장에 대해 원본을 훼손하지 않고 작업 결과를 얻음.

### Phase 4 — AI 원고 및 편집기 [P1]

- [ ] AI 공급업체 Adapter와 선택 사진 전송 허용.
- [ ] 사진·확인된 메모 기반 글 초안, 제목 3안 생성.
- [ ] 장소 검수·사진 순서 수정·본문 편집.
- [ ] 공개 전 얼굴·위치·메타데이터 승인 워크플로.
- [ ] MDX/사진 Export 자동화.

**완료 조건:** 실제 여행 사진에서 생성한 글을 사용자가 다듬어 발행 가능한 상태로 내보냄.

### Phase 5 — 고도화 [P2]

- [ ] Places 지도 인터랙션 및 여행기 링크.
- [ ] 실제 필요 부분에만 GSAP ScrollTrigger 적용.
- [ ] 21st.dev 컴포넌트 중 검증된 Lightbox/탐색 UI 도입.
- [ ] 로컬 편집기 발행 버튼(명시 승인 후 GitHub 갱신).
- [ ] 공개 이미지 객체 스토리지 이관(용량/트래픽에 따라).
- [ ] 검색·연도/도시 필터 고도화, 필요 시 다국어.

**완료 조건:** 사이트가 불필요하게 느려지지 않고 아카이브 확대와 유지보수에 대응.

---

## 18. 작업 체크리스트 및 인수 테스트

### 기능

- [ ] 홈에서 여행기 상세까지 두 번 이내의 주요 클릭으로 이동.
- [ ] 여행기 추가 시 기존 페이지 레이아웃 깨짐 없음.
- [ ] 모든 카드가 타이틀/날짜/장소/커버의 일관된 모델 사용.
- [ ] 라이트박스 클릭/키보드/모바일 터치/닫은 후 포커스 복귀 정상.
- [ ] 본문 사진이 정확한 비율로 표시되고 이미지 누락 시 친절한 fallback.
- [ ] 사진 위치정보가 없는 경우에도 여행기 작성 가능.
- [ ] AI 없이도 수동 글쓰기·사진 배열·발행 가능.
- [ ] 상태가 `draft`인 글은 어떤 공개 경로에서도 조회되지 않음.

### 디자인

- [ ] 첫 화면이 시끄러운 템플릿형 블로그처럼 보이지 않음.
- [ ] 사진이 페이지에서 압도적이되 본문 가독성 보장.
- [ ] 비대칭 배열이 의도적인 시각 리듬을 가짐.
- [ ] 데스크톱/모바일 모두 과도한 여백 부족 또는 수평 스크롤 없음.
- [ ] 인터랙션 제거 시에도 사진과 콘텐츠가 완전하게 보임.

### 보안/운영

- [ ] 작업 중 iCloud 원본 체크섬/파일 mtime이 바뀌지 않음.
- [ ] 공개용 이미지 GPS 제거 확인.
- [ ] Git 이력·배포 산출물에 비밀키·원본 사진 없음.
- [ ] Vercel 새 배포 완료 확인, 재발행·롤백 절차 문서화.
- [ ] 사진 출처·공개 승인 이력 로컬 저장.

### 주요 QA 시나리오

| ID | 입력/상황 | 기대 결과 |
|---|---|---|
| QA-01 | 300장 중 40장이 iCloud 자리표시자 | 미다운로드 경고, 누락 목록 표시, 원본 변경 없음 |
| QA-02 | GPS 없는 카메라 JPEG | 시간순 배열 가능, 장소는 미확인으로 유지 |
| QA-03 | 아이폰 HEIC와 Live Photo | 정지 이미지와 영상 쌍 감지, 공개용 이미지 정상 생성 |
| QA-04 | Sony RAW+JPEG 동일 장면 | 중복 장면 그룹화, 원본 삭제 없음 |
| QA-05 | 같은 장소를 두 번 방문 | 시간 간격 기준으로 별도 방문 세그먼트 후보 표시 |
| QA-06 | 해외 여행에서 카메라 시각 오류 | 시간대 미상 경고, 수동 보정 가능 |
| QA-07 | AI가 식당명을 잘못 제안 | `suggested`로 남고 사용자 검증 없이는 공개 확정 안 됨 |
| QA-08 | 가족 사진이 비승인 상태 | 해당 사진은 공개 빌드에 포함되지 않음 |
| QA-09 | 모션 줄이기 활성화 | 사진 등장 지연 없음, 스크롤/라이트박스 정상 |
| QA-10 | 모바일 375px 긴 제목 | 오버플로 없이 줄바꿈, 내비게이션 접근 가능 |

---

## 19. 결정해야 할 사항(DECISION LOG)

| 항목 | 현재 가정/기본값 | 최종 확정 시점 |
|---|---|---|
| 사이트 이름 | `ELSEWHERE.` 가제 | 도메인 구매 전 |
| 도메인 | 미정; 먼저 vercel.app 사용 | Phase 2 |
| 글 톤 | 감성적이되 담백한 한국어 사진 에세이 | 첫 실제 여행기 발행 전 |
| 공개 대상 | 개인 여행 사진, 가족·아이 사진은 개별 승인 | Phase 1 이후 |
| 메인 사진 | 사용자 승인 커버 이미지 | 각 글 발행 시 |
| AI Provider | 교체 가능하게 추상화; 특정 업체 미선정 | Phase 4 |
| 지도 엔진 | Places v1은 목록 위주, v2 지도 | Phase 5 |
| 영상 | MVP에서는 정지 이미지 우선 | 필요한 시점 |
| 이미지 저장 | 초기 공개용 파일만 GitHub, 성장 시 스토리지 | 용량 증대 시 |
| 자동 발행 | 1차 수동 git push, 2차 로컬 승인 버튼 | Phase 4~5 |
| 광고/수익화 | 없음, 개인 비상업 목적 | 상업화 결정 시 요금제 재검토 |

---

## 20. Codex용 시작 프롬프트 — 그대로 붙여넣기

> 너는 시니어 프런트엔드 개발자이자 에디토리얼 웹 디자이너다. 프로젝트의 `ELSEWHERE_Travel_Archive_Master_Spec_v1.0.md`를 읽고, **Phase 0과 Phase 1의 공개 웹사이트 MVP만** 구현해라. 디자인 레퍼런스는 Cereal의 조용한 여백, IGNANT의 의도적 비대칭 사진 그리드, Exposure의 사진 중심 읽기 흐름이다. Astro + TypeScript + Tailwind, Markdown/MDX Content Collections, 정적 우선 원칙을 적용하라. `Home`, `Journal`, `Journey Detail`, `Archive`, `About`, 반응형 헤더와 라이트박스를 구현하라. 사진·글 블록 5종 이상을 컴포넌트화하고, 샘플 여행기 2편으로 실제 화면을 검증하라. React는 라이트박스처럼 필요한 곳에만 허용하며 GSAP은 현 단계에서 필요 없으면 설치하지 않는다. iCloud 원본을 건드리지 않고, 개인정보와 API 키를 배포 코드에 포함하지 말아라. 각 화면 구현 후 데스크톱/모바일 브라우저에서 확인하고 빌드·타입체크·기본 접근성 점검을 수행한 다음, 남은 작업과 판단 사항을 `docs/DECISIONS.md`에 정리하라. 추가 기능을 임의로 확장하지 말고 미감과 사용성을 우선하라.

---

## 21. 공식 문서 / 구현 참고 링크 (2026-10-25 확인)

### Apple / 사진

- [Windows용 iCloud 사진 설정](https://support.apple.com/ko-kr/guide/icloud-windows/icw9f0ba665f/icloud) — 기본 사진 폴더 위치.
- [Windows iCloud 사진 다운로드 및 보기](https://support.apple.com/ko-kr/guide/icloud-windows/icw2ed20ffd1/icloud) — 다운로드 전 자리표시자/썸네일, 동기화 파일 취급 주의.
- [PC에서 iCloud 사진 사용](https://support.apple.com/ko-kr/108994) — 공식 PC 작업 흐름.
- [iCloud.com Photos](https://www.icloud.com/photos/) — 브라우저 수동 다운로드.
- [Apple PhotoKit](https://developer.apple.com/documentation/photokit) — 장래 전용 iOS 앱 확장.

### 웹 프레임워크 / 배포

- [Astro Content Collections](https://docs.astro.build/guides/content-collections/) — 타입 검증된 여행기 데이터.
- [Astro Images](https://docs.astro.build/guides/images/) — `src/` 이미지와 `public/`의 최적화 차이.
- [Astro on Vercel](https://vercel.com/docs/frameworks/frontend/astro) — 정적 배포.
- [Vercel Git Deployments](https://vercel.com/docs/git) — GitHub 반영과 자동 배포.
- [Vercel 요금제](https://vercel.com/docs/plans) / [Hobby 상업 이용 제한](https://vercel.com/legal/terms) — 운영 전 최신 조건 확인.

### 디자인/인터랙션/에이전트

- [Cereal](https://www.readcereal.com/) · [IGNANT](https://www.ignant.com/) · [Exposure](https://exposure.co/)
- [Recent (Godly 후속)](https://recent.design/)
- [21st.dev MCP](https://21st.dev/mcp) · [Codex 플러그인 소스](https://github.com/21st-dev/codex-plugin)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Manus](https://manus.im/) — 선택적 보조 도구, MVP 비포함.

---

## 22. 최종 한 줄 결론

**먼저 오래 봐도 질리지 않는 사진 매거진을 완성하고, 그다음 iCloud 사진과 AI 글쓰기 파이프라인을 연결한다.**  
기술은 사진과 기록을 돋보이게 하는 수단이며, 아카이브의 원본·추억·서사에 대한 최종 결정권은 사용자에게 남긴다.
