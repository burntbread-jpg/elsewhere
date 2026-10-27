# 여행기 추가

1. 원본과 비공개 초안을 저장소 밖에 보관합니다. iCloud 동기화 파일을 직접 수정하지 않습니다.
2. 공개 승인된 복사본을 WebP로 변환하고 EXIF/XMP를 제거합니다. 얼굴, 정확한 위치, 저작권을 별도로 확인합니다.
3. `src/assets/trips/새-slug/`에 공개 파일만 추가합니다.
4. 샘플 MDX를 복사해 `src/content/trips/새-slug.mdx`를 만들고 제목, 여행 시작/종료일, 국가, 지역, 커버 경로, alt를 작성합니다. 파일명이 URL이 됩니다.
   - `continent`: ASIA · EUROPE · AFRICA · NORTH AMERICA · SOUTH AMERICA · OCEANIA 중 하나. Journal의 대륙 보기와 Places의 대륙 묶음에 쓰입니다.
   - `volume`: Drive 원고 번호(`[001]대륙_나라_장소`)와 같은 권 번호. 같은 시작일의 여행기는 이 번호로 정렬합니다.
   - `datePrecision: month`: 정확한 날짜를 모를 때 연·월까지만 표시합니다.
   - `pin`: 지구본 핀 좌표. 도시·지역 단위로만 적고 숙소 등 정확한 위치는 쓰지 않습니다.
5. StoryIntro, TextSection, ImageSingle, ImagePair, ImageFullBleed를 import하고 본문에서 사용합니다. 이미지도 MDX에서 import합니다.
6. 공개 승인 완료 후에만 `status: published`, `visibility: public`로 저장소에 반영합니다. 실제 원고는 `sample: false`로 변경합니다.
7. `pnpm check`와 `pnpm build` 후 모바일·데스크톱에서 확인합니다.

새 여행기를 추가할 때 페이지 코드를 수정할 필요는 없습니다. 국가·지역·연도 탐색은 공개 컬렉션에서 계산합니다. GPS 좌표나 실제 이동 경로는 공개 모델에 저장하지 않습니다(지구본 `pin`은 도시·지역 단위). 실제 여행기가 하나라도 공개되면 샘플 원고는 목록·지구본에서 자동으로 빠집니다. 임시 샘플을 실제 체험으로 간주하거나 임의의 감정·장소 평가를 추가하지 않습니다.
