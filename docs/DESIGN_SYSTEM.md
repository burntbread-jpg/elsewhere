# 디자인 기준

명세의 Cereal 여백, IGNANT 비대칭 편집 그리드, Exposure 긴 사진 서사를 해석했습니다. 외부 사이트 코드를 복제하지 않았습니다.

- Paper #F6F3ED, Linen #E4E0D6, Taupe #A69D8D, Olive #4F594C, Ink #24231F, Caption #69655F.
- Taupe는 장식에만 사용하며 작은 글자는 Caption으로 대비를 확보합니다.
- 최대 1440px, 본문 680px, 데스크톱 5/7 비대칭 그리드. 모바일 1열.
- 서체 비교 후 사용자 선택 ③ 채택: 제목·도입 Noto Serif KR 400/500, 본문 Pretendard Variable 400, 영문 로고·메뉴 Manrope 400/500/600. Google Fonts와 Pretendard 공식 jsDelivr 배포 사용. 공통 서체 규칙은 `src/styles/typography.css`.
- 모션은 CSS 최소 적용, reduced-motion 지원. GSAP/React 의존성 없음.
- `/design-system/`에서 토큰과 글꼴을 확인합니다.
- 현재 풍경 일러스트는 임시 자산입니다. 사진 15~35장의 실제 서사·색감·세로 구도 검수는 후속 작업입니다.

## 에디토리얼 레이어 (2026-10-25)

Awwwards·CSS Design Awards·FWA 아카이브를 검토해 방향을 골랐습니다. 공통 원칙은 `src/styles/editorial.css`에 있습니다.

- 채택 — Awwwards의 에디토리얼/사진 포트폴리오 계열: 인덱스 번호(01, 02), 헤어라인 메타 표, 큰 숫자, 화면 폭을 채우는 푸터 워드마크, 다음 여행기로 이어지는 어두운 엔딩 밴드.
- 채택 — CSSDA의 타이포그래피 정밀함: 표 형식 숫자(Manrope tabular-nums), 장 번호를 여백에 거는 배치, `FIG. 01` 캡션 카운터, 밑줄이 그려지는 링크.
- 제외 — FWA의 실험형 WebGL·풀스크린 연출·커스텀 커서·프리로더. 명세의 "과한 3D·멀미 유발 금지"와 충돌합니다. 기존 홈 지구본만 유지합니다.
- 모션은 JS 없이 처리합니다: 문서 간 View Transitions(카드 커버 → 여행기 히어로가 이어지는 효과), 스크롤 기반 CSS 애니메이션(`animation-timeline: view()`)으로 사진 펼침·문단 등장·히어로의 느린 확대, 상단 읽기 진행선. 지원하지 않는 브라우저나 모션 줄이기 설정에서는 모든 콘텐츠가 즉시 보입니다.
- 헤더는 상단에 고정되고 아래로 읽을 때 물러납니다. 모바일 메뉴는 큰 글자의 전체 화면 패널이며 Esc로 닫힙니다.
- 아카이브 행은 마우스를 올렸을 때(포인터 기기, 1024px 이상)에만 커버를 살짝 보여 줍니다.
