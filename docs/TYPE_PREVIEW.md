# 서체 조합 비교

비교 화면: `/type-preview/`. 홈과 실제 샘플 여행기에서 아래 세 조합을 전환합니다.

1. Modern: Pretendard Variable + Manrope.
2. Atlas: IBM Plex Sans KR + IBM Plex Sans + IBM Plex Mono.
3. Photobook: Noto Serif KR 제목 + Pretendard 본문 + Manrope 영문.

넓은 화면 / 390px 모바일 프레임, 조합별 전체 화면 링크, 선택 상태 URL 공유를 지원합니다. 서체와 자간·행간·소형 레이블을 함께 비교합니다.

사용자가 ③ Photobook을 최종 선택해 기본 공개 스타일로 적용했습니다. 제목/도입은 Noto Serif KR, 본문은 Pretendard, 영문 로고/메뉴는 Manrope입니다. 미리보기 쿼리 `?type=modern|atlas|photobook`로 다른 조합을 비교할 수 있으며, 비교 화면 선택은 기본 서체를 바꾸지 않습니다. 미리보기에는 noindex를 설정하고 기본 페이지는 색인을 허용합니다.

이번 비교에서는 Google Fonts 및 Pretendard 공식 jsDelivr 배포를 사용합니다. 초기 로딩은 네트워크 상태에 따라 잠시 걸릴 수 있습니다. 최종 채택 시 필요한 굵기와 한글 범위만 자체 호스팅하는 구성을 검토합니다.

서체 라이선스/배포 근거:
- https://github.com/orioncactus/pretendard
- https://github.com/IBM/plex
- https://fonts.google.com/specimen/Manrope
- https://fonts.google.com/noto/specimen/Noto+Serif+KR
