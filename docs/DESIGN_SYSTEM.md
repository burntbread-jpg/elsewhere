# 디자인 기준

명세의 Cereal 여백, IGNANT 비대칭 편집 그리드, Exposure 긴 사진 서사를 해석했습니다. 외부 사이트 코드를 복제하지 않았습니다.

- Paper #F6F3ED, Linen #E4E0D6, Taupe #A69D8D, Olive #4F594C, Ink #24231F, Caption #69655F.
- Taupe는 장식에만 사용하며 작은 글자는 Caption으로 대비를 확보합니다.
- 최대 1440px, 본문 680px, 데스크톱 5/7 비대칭 그리드. 모바일 1열.
- 서체 비교 후 사용자 선택 ③ 채택: 제목·도입 Noto Serif KR 400/500, 본문 Pretendard Variable 400, 영문 로고·메뉴 Manrope 400/500/600. Google Fonts와 Pretendard 공식 jsDelivr 배포 사용. 공통 서체 규칙은 `src/styles/typography.css`.
- 모션은 CSS 최소 적용, reduced-motion 지원. GSAP/React 의존성 없음.
- `/design-system/`에서 토큰과 글꼴을 확인합니다.
- 현재 풍경 일러스트는 임시 자산입니다. 사진 15~35장의 실제 서사·색감·세로 구도 검수는 후속 작업입니다.
