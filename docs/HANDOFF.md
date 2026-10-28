# 인수인계 — ELSEWHERE 웹사이트 (2026-10-28 기준)

다른 컴퓨터나 다른 AI가 이 문서 하나로 작업을 이어받을 수 있도록 정리했습니다. 이 저장소는 **공개** 저장소이므로, 글쓴이 개인에 관한 정보와 문체 명세서 본문은 여기에 두지 않고 비공개 Google Drive에만 둡니다(아래 6절).

## 1. 한눈에

| 항목 | 값 |
|---|---|
| 공개 사이트 | https://elsewhere-travel-archive.vercel.app/ |
| 저장소 | https://github.com/burntbread-jpg/elsewhere (기본 브랜치 `main`) |
| 배포 | Vercel `elsewhere-travel-archive` 프로젝트. `main`에 push하면 자동 배포, 다른 브랜치는 `https://elsewhere-travel-archive-git-<브랜치>-burntbread.vercel.app/` 프리뷰 |
| 검증 | GitHub Actions가 타입 검사와 빌드를 돌립니다. `pnpm build`는 먼저 `tools/checks/publication.mjs`(EXIF/XMP, 비공개 원고, 비밀키 패턴 차단)를 실행합니다 |
| 최초 명세 | 루트의 `ELSEWHERE_Travel_Archive_Master_Spec_v1.0.md` |
| 스택 | Astro 5 + MDX + Tailwind 4 + TypeScript, Node 24, pnpm 11. 정적 출력(`dist/`) |

## 2. 현재 상태

- 공개 여행기 3편. 번호(`volume`)는 Drive 원고 번호와 같습니다.
  - VOL. 001 `src/content/trips/001-mongolia-gobi.mdx` — 고비 사막, 2025. 08.
  - VOL. 002 `src/content/trips/002-italy-palermo.mdx` — 팔레르모, 2019. 12. — 2020. 01.
  - VOL. 003 `src/content/trips/003-mongolia-dundgovi.mdx` — 둔드고비, 2025. 08. (커버는 별 사진, 낮 사진은 본문 안)
- 사진 4장은 AI 업스케일 후 긴 변 7680px(8K)로 교체되어 있습니다(5절).
- 샘플 원고 2편(`sample-trip-01/02`)은 파일만 남아 있고, 실제 여행기가 하나라도 있으면 목록과 지구본에서 자동으로 빠집니다.
- 홈: 3D 지구본(여행기마다 도시·지역 단위 핀), 선택된 이야기, 집계. Journal: 대륙 보기(ALL · ASIA · EUROPE …) + 연도·장소 필터. Places: 대륙별 묶음. Archive: 연도별 목록.

## 3. 사용자와 합의한 작업 방식

- **디자인 변경**은 별도 브랜치 → Vercel 프리뷰 링크와 스크린샷 → 사용자 승인 → `main` 병합. 사용자가 "main에 바로 반영"이라고 하면 바로 병합합니다.
- **원고**는 Drive `공유 드라이브 B11 / ELSEWHERE`에 Google Docs로 `[NNN]대륙_나라_장소` 형식으로 둡니다(예: `[001]아시아_몽골_고비 사막`). `NNN`은 사이트의 `volume`과 같습니다.
- **문체 명세서**(글쓴이 목소리 재현 규칙)는 Drive `B11 / B Writes`의 `my-writing-style_SKILL_vNN.md`가 최신본입니다(현재 v11). 사용자가 원고에 피드백을 줄 때마다 규칙을 추가하고 버전을 올려 같은 폴더에 새 파일로 올립니다.
- **사진과 글**: 사진 1장에 글 1편이 원칙. 사진이 2장 이상이면 모두 싣고 대표(커버) 사진은 작성자가 정합니다. AI가 고르지 않습니다.
- **사실성**: 사용자가 말하지 않은 경험·감정·숫자·평가는 쓰지 않습니다. 모르면 `[확인 필요]`로 두고 묻습니다. 가족·건강 같은 민감한 내용은 공개 전 확인을 받습니다.
- 커밋 메시지와 문서는 무엇이 왜 바뀌었는지 위주로 씁니다.

## 4. 새 여행기 추가 절차

1. 사용자에게서 사진과 정보를 받습니다(문체 명세서 §12 요청 양식). 정보가 없으면 원고를 쓰지 않고 질문부터 합니다.
2. 문체 명세서를 따라 원고를 쓰고, 사용자 승인을 받습니다.
3. Drive `B11 / ELSEWHERE`에 `[NNN]대륙_나라_장소` Google Doc으로 올립니다(HTML로 만들어 `create_file`에 `text/html`로 올리면 서식이 변환됩니다).
4. 사진 처리(5절) 후 `src/assets/trips/`에 넣습니다. 파일명은 `나라-장소-내용.jpg` 형식(예: `mongolia-dundgovi-milky-way.jpg`).
5. 기존 MDX를 복사해 `src/content/trips/NNN-나라-장소.mdx`를 만듭니다. 필드는 `docs/CONTENT_GUIDE.md` 참고. 주요 필드:
   - `continent`(ASIA · EUROPE · AFRICA · NORTH AMERICA · SOUTH AMERICA · OCEANIA), `volume`(Drive 번호), `datePrecision: month`(정확한 날짜를 모를 때), `pin`(도시·지역 단위 좌표), `coverFocus`(커버 크롭 중심, 예 `"50% 62%"`), `summary`(리드 문장, 본문 첫 문장과 겹치지 않게).
   - 본문은 `<TextSection>`으로 감싸고, 소제목 없이 단락만 둡니다. 본문 사진은 `<ImageSingle>`, 인용구는 `<PullQuote>`(그 글 안의 문장 그대로).
6. `pnpm check && pnpm build` 후 데스크톱(1440)과 모바일(390)에서 확인하고 커밋합니다.

## 5. 사진 처리 (8K 업스케일)

- 클라우드 CPU에서는 Real-ESRGAN `realesrgan-x4plus` 모델이 장당 약 1시간 걸려 쓰지 않습니다. Upscayl의 경량 사진 모델 `upscayl-lite-4x`가 장당 2~3.5분으로 약 18배 빠르고 화질은 거의 같습니다.
- 준비물: [Real-ESRGAN ncnn 실행 파일](https://github.com/xinntao/Real-ESRGAN/releases/tag/v0.2.5.0)(`realesrgan-ncnn-vulkan-20220424-ubuntu.zip` 등)과 [Upscayl 저장소](https://github.com/upscayl/upscayl)의 `resources/models/upscayl-lite-4x.param/.bin`을 실행 파일의 `models/`에 넣습니다. GPU가 없는 Linux는 `mesa-vulkan-drivers`(llvmpipe)가 필요합니다.
- 명령:
  ```sh
  realesrgan-ncnn-vulkan -i original.png -o ai.png -n upscayl-lite-4x -s 4
  python3 tools/photos/prepare.py original.jpg src/assets/trips/<이름>.jpg --ai ai.png --weight 0.75
  ```
  `--weight`는 AI 결과의 비율입니다. 일반 사진 0.75, 밤하늘처럼 희미한 점이 많은 사진은 0.6(AI만 쓰면 인물 둘레에 밝은 테두리가 생기고 희미한 별이 선처럼 변합니다).
- GPU가 있는 개인 컴퓨터에서는 Upscayl 데스크톱 앱으로 같은 작업을 장당 몇 초에 할 수 있습니다. 결과를 `prepare.py`에 `--ai`로 넘기면 됩니다.
- 화면에는 Astro가 만든 WebP만 나가고, 라이트박스는 최대 3840px 판을 엽니다. 8K 원본은 그대로 다운로드되지 않습니다.

## 6. 문체 명세서 (비공개)

- 위치: Google Drive `공유 드라이브 B11 / B Writes / my-writing-style_SKILL_v11.md`(최신). v4~v10은 이전 버전입니다.
- 쓰는 법: Claude Code에서는 이 파일을 `~/.claude/skills/my-writing-style/SKILL.md`로 저장하면 `my-writing-style` 스킬로 불러집니다. 다른 AI에는 파일 전체를 지침으로 붙여 넣습니다.
- 이 파일에는 글쓴이 개인 정보가 들어 있으므로 이 공개 저장소에 복사하지 않습니다.

## 7. 디자인 체계와 본문 레이아웃

- 서체: 제목·도입 Noto Serif KR, 본문 Pretendard Variable, 영문 로고·메뉴 Manrope. 배경 크림(#F6F3ED), 포인트 올리브. 자세한 것은 `docs/DESIGN_SYSTEM.md`.
- 여행기 상세(`src/components/StoryArticle.astro`, `src/styles/story-layouts.css`) — 사용자가 고른 **A안(커버 스토리)**:
  - 첫 화면을 채우는 커버 사진 위에 VOL 줄, 제목, 영문 부제.
  - 리드 문장 + 정보 칸(날짜·장소·나라·권).
  - 넓은 화면 2단 본문, 첫 글자 드롭캡, 인용구는 큰따옴표 장식과 함께 전체 폭.
  - 글자 크기 단계: 12 라벨 · 14 정보 · 17 본문 · 28 리드 · 42 인용구(모바일 22) · 큰 제목.
- 점검 도구(Impeccable, Taste)가 지적했지만 **사용자 결정으로 유지**하는 것: VOL 라벨과 권 번호, 가는 선, 크림 배경, 제목 아래 영문 부제(제목 문구는 원안 유지), 글꼴 3종.
- 미반영 개선안: `design/story-proposals` 브랜치의 P1(1단 + 여백 인용구), P2(사진 중심), P3(책처럼). 프리뷰 `/preview/p1|p2|p3/<slug>/`.

## 8. 디자인 도구 (Claude Code 스킬)

- 설치(사용자 스킬 폴더 `~/.claude/skills/`):
  - Emil Kowalski `emil-design-eng`: https://github.com/emilkowalski/skills
  - Impeccable: https://github.com/pbakaus/impeccable (`.claude/skills/impeccable`)
  - Taste: https://github.com/Leonxlnx/taste-skill (`skills/taste-skill`)
- 점검 명령(로컬 서버 `pnpm preview`를 띄운 뒤):
  ```sh
  node ~/.claude/skills/taste-skill/scripts/inspect.mjs http://127.0.0.1:4321/journal/<slug>/ --widths 1440,390
  ~/.claude/skills/impeccable/scripts/impeccable detect --json http://127.0.0.1:4321/journal/<slug>/
  ```
  root로 실행되는 리눅스에서는 Chrome이 `--no-sandbox` 없이 뜨지 않으므로, 그 옵션을 붙여 Chrome을 실행하는 작은 셸 스크립트를 `CHROME_PATH` / `IMPECCABLE_BROWSER`로 지정합니다.
- Figma MCP는 연결하지 않았습니다(사용자 Figma 계정 연결이 필요하고, 현재 Figma 파일이 없음).

## 9. 남은 일과 정리할 것

- 원격 브랜치 정리(사용자가 직접 삭제): `chore/cleanup`, `content/first-stories`, `design/editorial-polish`, `design/story-layouts`. `design/story-proposals`는 개선안 검토가 끝나면 삭제.
- 홈의 지구본 핀 좌표는 도시·지역 단위입니다. 숙소 등 정확한 위치는 넣지 않습니다.
- 커스텀 도메인, canonical/sitemap/OG 절대 URL은 아직 없습니다(`docs/PUBLISHING.md`).

## 10. 이 클라우드 작업을 로컬에서 이어받기

Claude Code CLI가 설치된 컴퓨터에서, 같은 claude.ai 계정으로 로그인한 상태로:

```sh
git clone https://github.com/burntbread-jpg/elsewhere && cd elsewhere
claude --teleport session_019nuTKR7jt1eVht2FLwZdih
```

대화 기록 전체와 브랜치를 그대로 가져옵니다. 클라우드에 설치했던 스킬, 업스케일 도구, 임시 파일은 따라가지 않으므로 6절과 8절대로 로컬에 다시 설치합니다.
