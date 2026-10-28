# ELSEWHERE. — The Places We Carry

Astro + TypeScript + Tailwind CSS + MDX 기반 개인 여행 아카이브. 기준 명세는 루트의 `ELSEWHERE_Travel_Archive_Master_Spec_v1.0.md`이며 다운로드 원본을 그대로 복사했습니다.

## 실행

Node.js 24 및 pnpm 11 환경:

```sh
pnpm install
pnpm dev
pnpm check
pnpm build
pnpm preview
```

`http://127.0.0.1:4321`에서 확인합니다. 개발 서버는 로컬에만 바인딩합니다.

## 구성

- `src/content/trips/*.mdx`: 공개 승인된 여행기
- `src/assets/trips/`: 메타데이터를 제거한 공개 이미지
- `src/components/`: 사진·본문 블록과 라이트박스
- `docs/`: 디자인, 콘텐츠, 배포, 결정 및 검증 기록
- `tools/checks/publication.mjs`: 공개 입력 검사

공개 여행기 3편(고비 사막, 팔레르모, 둔드고비)이 올라가 있습니다: https://elsewhere-travel-archive.vercel.app/ . 작업을 이어받을 때는 먼저 `docs/HANDOFF.md`를 읽습니다. 사진 처리는 `tools/photos/prepare.py`.

비공개 원고와 원본 사진은 이 저장소 밖에 보관합니다. `published`와 `public` 조건을 만족하는 원고만 라우트에 포함하며, 빌드 사전 검사는 그 외 상태의 원고가 공개 소스에 들어오면 차단합니다. 검사는 보조 장치이며 얼굴·저작권·이미지에 보이는 개인정보는 사용자가 검토해야 합니다.

GitHub/Vercel 연결은 `docs/PUBLISHING.md`, 미완료 사항은 `docs/DECISIONS.md`를 참고하세요.
