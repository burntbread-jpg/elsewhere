# 인수인계 — ELSEWHERE 웹사이트 (2026-11-23 기준)

다른 컴퓨터나 다른 AI가 이 문서 하나로 작업을 이어받을 수 있도록 정리했습니다. 이 저장소는 **공개** 저장소이므로, 글쓴이 개인에 관한 정보와 문체 명세서 본문은 여기에 두지 않고 비공개 Google Drive에만 둡니다(아래 6절).

## 1. 한눈에

| 항목 | 값 |
|---|---|
| 공개 사이트 | https://elsewhere-travel-archive.vercel.app/ |
| 저장소 | https://github.com/burntbread-jpg/elsewhere (기본 브랜치 `main`) |
| 배포 | Vercel `elsewhere-travel-archive` 프로젝트. `main`에 push하면 자동 배포, 다른 브랜치는 `https://elsewhere-travel-archive-git-<브랜치>-burntbread.vercel.app/` 프리뷰. 배포 결과는 `gh api repos/burntbread-jpg/elsewhere/commits/<SHA>/statuses`로 확인 |
| 검증 | GitHub Actions가 타입 검사와 빌드를 돌립니다. `pnpm build`는 먼저 `tools/checks/publication.mjs`(EXIF/XMP, 비공개 원고, 비밀키 패턴 차단)를 실행합니다 |
| 최초 명세 | 루트의 `ELSEWHERE_Travel_Archive_Master_Spec_v1.0.md` |
| 스택 | Astro 5 + MDX + Tailwind 4 + TypeScript, Node 24, pnpm 11. 정적 출력(`dist/`) |

## 2. 현재 상태

### 2.1 공개 여행기 15편

번호(`volume`)는 Drive 원고 번호와 같습니다. 부제는 커버 제목 아래에 영문으로, Drive 문서 이름 끝에 한글로 붙습니다(4절 4번).

| VOL | 파일 (`src/content/trips/`) | 제목 | 부제 (한글 / 커버 영문) | 시기 | 연재·메모 |
|---|---|---|---|---|---|
| 001 | `001-mongolia-gobi.mdx` | 고비 사막 | 세계가 더 크게 열린다 / The World Opens Wider, Gobi | 2025. 08. | 몽골 연재 ① |
| 002 | `002-italy-palermo.mdx` | 팔레르모 | 바뀌기 전의 초상 / A Portrait Before It Changed, Palermo | 2019. 12. — 2020. 01. | 시칠리아 연재 ① |
| 003 | `003-mongolia-dundgovi.mdx` | 둔드고비 | 별의 후예 / Descendants of the Stars, Dundgovi | 2025. 08. | 몽골 연재 ②. 커버는 별 사진, 낮 사진은 본문 안 |
| 004 | `004-china-beijing.mdx` | 천단 | 모든 답은 위에 있다 / All Answers Lie Above, Beijing | 2025. 02. | |
| 005 | `005-france-paris-louvre.mdx` | 루브르 | 군중이 사라진 밤 / The Night the Crowd Was Gone, Paris | 2022. 01. | 파리는 앞으로 여러 편 예정 |
| 006 | `006-japan-tokyo-ginza.mdx` | 동경 이야기 | 색이 빠진 자리 / Where the Colour Fell Away, Ginza | 2026. 05. | 도쿄는 앞으로 여러 편 예정. 사진은 사용자가 흑백으로 변환 |
| 007 | `007-italy-cefalu.mdx` | 체팔루 | 신화보다 설화 / Folktale over Myth, Cefalù | 2019. 12. — 2020. 01. | 시칠리아 연재 ②. 이 편만 연재 연결 문장 없이 시작(사용자 결정) |
| 008 | `008-japan-kyoto-fushimi-inari.mdx` | 후시미 이나리 | 모든 사람은 꿈을 꾼다 / All Men Dream, Kyoto | 2018. 08. | 사진 색감은 원본(시안 3개 중 원본 선택) |
| 009 | `009-australia-newcastle.mdx` | 뉴캐슬 | 심심한 천국 / A Quiet Kind of Paradise, Newcastle | 2018. 12. | 호주 연재 ① |
| 010 | `010-austria-vienna-khm.mdx` | 빈 미술사 박물관 | 앉아 있을 권리 / The Right to a Seat, Vienna | 2015. 02. | 사진만 주고 시작한 첫 시범 편 |
| 011 | `011-spain-santiago-de-compostela.mdx` | 산티아고 데 콤포스텔라 | 끝과 시작 / Where One Road Ends, Santiago | 2023. 01. | 이베리아 연재. 여정의 세 번째 도시쯤, 앞선 도시들은 아직 미게시 |
| 012 | `012-usa-las-vegas.mdx` | 라스베이거스 | 사막을 잊게 하는 도시 / The City That Forgets the Desert, Las Vegas | 2022. 08. | 미국 연재. 그랜드캐니언 다음 일정 |
| 013 | `013-nepal-kathmandu.mdx` | 카트만두 | 다 알고도 그대로 두는 눈 / Eyes That Know and Let Be, Kathmandu | 2015. 12. 31. | 인도·네팔 연재(순서 미정). 사원 이름(스와얌부나트)은 본문에 쓰지 않음 |
| 014 | `014-russia-moscow.mdx` | 모스크바 | 거인의 어깨 / On the Shoulders of a Giant, Moscow | 2016. 09. | 빈·프라하·드레스덴 여행의 레이오버. 러시아 편이 한 편 더 올 예정 |
| 015 | `015-australia-melbourne.mdx` | 멜버른 | 벤치에 남은 이름 / Names on the Benches, Melbourne | 2019. 01. | 호주 연재 ②(여정의 마지막 전 도시). 골드코스트 새해 편은 나중에 쓸 예정 |

### 2.2 앞으로 올 연재 (같은 여행의 다른 편)

- 몽골, 시칠리아, 호주(골드코스트 등), 이베리아(산티아고 앞뒤 도시), 미국(그랜드캐니언 등), 인도·네팔, 러시아, 빈·프라하·드레스덴, 파리, 도쿄, 인도네시아(보로부두르는 프람바난과 따로 한 편).
- 같은 여행의 다음 편은 문체 명세서 §6.4대로 이동 사실을 짧게 쓴 첫 문장으로 열고, 앞 편의 사실·인용·결말을 반복하지 않습니다. 이미 올라간 편보다 앞선 일정을 나중에 쓸 때도 그 편과 겹치지 않게 합니다.

### 2.3 사이트

- 여행기 사진 16장(커버 15장 + 둔드고비 본문 1장)은 AI 업스케일 후 긴 변 7680px(8K)로 교체되어 있습니다(5절).
- 샘플 원고 2편(`sample-trip-01/02`)은 파일만 남아 있고, 실제 여행기가 하나라도 있으면 목록과 지구본에서 자동으로 빠집니다.
- 홈: 3D 지구본(여행기마다 도시·지역 단위 핀, 사용자가 고른 G1 모션: 등장 연출, 자동 회전, 대기 빛, 퍼지는 고리, 여행 순서대로 그려지는 경로. `docs/GLOBE.md`), 지구본 아래 장소 목록(여러 줄로 감김), 선택된 이야기, 집계. Journal: 대륙 보기(ALL · ASIA · EUROPE …) + 연도·장소 필터. Places: 대륙별 묶음. Archive: 연도별 목록.

### 2.4 최근 바뀐 동작 (2026-11)

- **계절 표기**: 적도 남쪽 여행지(`pin.lat < 0`)는 계절을 반대로 표시합니다. 12월 호주는 SUMMER(`src/components/StoryMeta.astro`).
- **휴대폰 커버 선명도**: 커버는 화면 높이에 맞춰 잘려 보이므로, 화면 높이 기준으로 충분히 큰 판을 받도록 `sizes`를 계산합니다(`StoryArticle.astro`의 `coverSizes`). 예전에는 가로 사진이 휴대폰에서 약 3.5배 늘어나 흐렸습니다.
- **홈 장소 목록**: 여행기가 늘어도 화면 폭을 넘지 않도록 여러 줄로 감깁니다(`src/styles/globe.css`). 한 줄로 늘어서던 때는 휴대폰에서 홈 전체가 축소되어 보였습니다.
- **사진 확대(라이트박스)**: 사진 아래 설명을 표시하지 않습니다(설명은 대체 텍스트로만 남음). 사진이 한 장인 편에서는 '1 / 1'과 좌우 화살표를 숨깁니다(`src/components/Lightbox.astro`).
- **부제**: 모든 편이 '내용을 담은 한 줄, 장소' 형식의 영문 부제를 씁니다.
- **About 페이지**(`src/pages/about.astro`): 예시 안내 문구를 빼고 두 단락으로 바꿨습니다. ① 한 편의 단위는 사진 한 장, 그날의 사정과 그 장면이 불러낸 책·영화·생각을 함께 적는다. ② 직접 보고 겪은 일만 쓰고, 동행과 숙소는 공개하지 않으며, 지도 위치는 도시·지역 단위. 편수·연도·나라 수처럼 계속 바뀌는 숫자는 넣지 않기로 했습니다(사용자 결정). 제목 '멀리 다녀온 뒤에도, 곁에 남는 것들.'과 COLOPHON은 그대로입니다.

## 3. 사용자와 합의한 작업 방식

- **디자인 변경**은 별도 브랜치 → Vercel 프리뷰 링크와 스크린샷 → 사용자 승인 → `main` 병합. 사용자가 "main에 바로 반영"이라고 하면 바로 병합합니다. 작은 수정(버그, 표시 문제)은 사용자가 요청하면 바로 `main`에 반영해 왔습니다.
- **원고 흐름**: 사진(+ 메모) 받기 → 8K 업스케일을 백그라운드로 시작 → 초안과 함께 단락별 글자 수, 덧붙인 내용 목록, 사실 보정, `[확인 필요]` 질문, **부제 후보 2–3개(한글 + 커버 영문, 추천 표시)**를 함께 보고 → 사용자 답과 수정 반영 → 사용자가 "업로드해 줘"라고 하면 사이트와 Drive에 올림. 업로드 지시 없이 질문에만 답했으면 업로드 여부를 한 줄로 묻습니다.
- **사진만 받은 경우**: 완성 원고 대신 '사진에서 확인되는 것 + [확인 필요]가 비어 있는 뼈대 초안 + 질문 5–8개'를 먼저 드리고, 답을 받아 완성 원고로 바꿉니다(문체 명세서 §11.1).
- **원고 보관**: Drive `공유 드라이브 B11 / ELSEWHERE`에 Google Docs로 `[NNN]대륙_나라_장소_부제` 형식으로 둡니다(예: `[007]유럽_이탈리아_체팔루_신화보다 설화`). 문서 첫머리는 `제목 · 한글 부제 · 영문 부제 · 날짜 · VOL. NNN` 한 줄, 그다음 본문 단락입니다.
- **Drive 문서 수정**: 연결된 Drive 도구는 문서 이름만 바꿀 수 있고 본문은 고칠 수 없습니다. 본문이 바뀌면 같은 이름으로 문서를 새로 만들고 예전 문서는 휴지통으로 옮깁니다(링크가 바뀜).
- **문체 명세서**(글쓴이 목소리 재현 규칙)는 Drive `B11 / B Writes`의 `my-writing-style_SKILL_vNN.md`가 최신본입니다(현재 v17). 사용자의 원고 피드백이 일반 규칙이 될 때마다 규칙을 추가하고 버전을 올려 같은 폴더에 새 파일로 올립니다. 한 편에만 해당하는 결정(예: 체팔루의 연결 문장 생략)은 규칙으로 올리지 않습니다.
- **사진과 글**: 사진 1장에 글 1편이 원칙. 사진이 2장 이상이면 모두 싣고 대표(커버) 사진은 작성자가 정합니다. AI가 고르지 않습니다.
- **사실성**: 사용자가 말하지 않은 경험·감정·숫자·평가는 쓰지 않습니다. 모르면 `[확인 필요]`로 두고 묻습니다. 사용자가 잘못 기억한 이름·사실(작품 제목, 인물 이름, 건물 이름, 역사)은 고쳐 쓰고 알립니다.
- **동행**: 본문에 쓰지 않는 것이 기본값입니다. 동행이 사건의 중심일 때만 씁니다.
- **색감**: 사진은 원본 색감을 씁니다. 사용자가 요청할 때만 보정 시안을 만듭니다.
- 커밋 메시지와 문서는 무엇이 왜 바뀌었는지 위주로 씁니다.

## 4. 새 여행기 추가 절차

1. 사용자에게서 사진과 정보를 받습니다(문체 명세서 §12 요청 양식, §15 사용자가 재료를 주는 방식). 정보가 없으면 뼈대와 질문부터 드립니다.
2. 사진 업스케일을 백그라운드로 시작합니다(5절).
3. 문체 명세서를 따라 원고를 쓰고, 사용자 승인을 받습니다. 앞 편의 주제어(부지런함, 위를 봄, 천국, 한 시대의 끝 등)를 다른 편의 해석에 다시 쓰지 않습니다.
4. 제목과 부제를 정합니다. 부제는 '내용을 담은 한 줄'(한글)과 '그 한 줄의 영문, 장소'(커버)입니다. 같은 도시·나라의 편이 여럿이면 부제로 구분합니다.
5. 사진을 `src/assets/trips/`에 넣습니다. 파일명은 `나라-장소-내용.jpg` 형식(예: `mongolia-dundgovi-milky-way.jpg`).
6. 기존 MDX를 복사해 `src/content/trips/NNN-나라-장소.mdx`를 만듭니다. 필드는 `docs/CONTENT_GUIDE.md` 참고. 주요 필드:
   - `continent`(ASIA · EUROPE · AFRICA · NORTH AMERICA · SOUTH AMERICA · OCEANIA), `volume`(Drive 번호), `datePrecision: month`(정확한 날짜를 모를 때), `pin`(도시·지역 단위 좌표), `coverFocus`(커버 크롭 중심, 예 `"50% 62%"`. 휴대폰 세로 화면에서 인물·주요 대상이 들어오는지 확인), `summary`(리드 문장, 본문 첫 문장과 겹치지 않게), `subtitle`(영문 부제), `coverAlt`(사진 설명. 라이트박스에는 나오지 않고 화면 낭독기만 읽음).
   - 본문은 `<TextSection>`으로 감싸고, 소제목 없이 단락만 둡니다. 본문 사진은 `<ImageSingle>`, 인용구는 `<PullQuote>`(그 글 안의 문장 그대로, 그 편의 통찰이 담긴 문장).
7. `pnpm check && pnpm build` 후 데스크톱(1440)과 모바일(390)에서 커버와 페이지 폭을 확인하고 `main`에 커밋·푸시합니다.
8. Drive `B11 / ELSEWHERE`에 `[NNN]대륙_나라_장소_부제` Google Doc을 만듭니다. HTML 파일을 만들어 `create_file`에 `text/html`로 올리면 서식이 변환됩니다. 로컬 파일은 `base64Content`에 `sha256:<해시>:<절대경로>` 형식의 파일 참조로 넘기면 내용을 직접 붙여 넣지 않아도 됩니다.
9. 이 문서의 2절 표를 갱신합니다.

## 5. 사진 처리 (8K 업스케일)

- 클라우드 CPU에서는 Real-ESRGAN `realesrgan-x4plus` 모델이 장당 약 1시간 걸려 쓰지 않습니다. Upscayl의 경량 사진 모델 `upscayl-lite-4x`가 장당 2~3.5분으로 약 18배 빠르고 화질은 거의 같습니다.
- 준비물: [Real-ESRGAN ncnn 실행 파일](https://github.com/xinntao/Real-ESRGAN/releases/tag/v0.2.5.0)(`realesrgan-ncnn-vulkan-20220424-ubuntu.zip` 등)과 [Upscayl 저장소](https://github.com/upscayl/upscayl)의 `resources/models/upscayl-lite-4x.param/.bin`을 실행 파일의 `models/`에 넣습니다. GPU가 없는 Linux는 `mesa-vulkan-drivers`(llvmpipe)가 필요합니다.
- 명령:
  ```sh
  realesrgan-ncnn-vulkan -i original.png -o ai.png -n upscayl-lite-4x -s 4
  python3 tools/photos/prepare.py original.jpg src/assets/trips/<이름>.jpg --ai ai.png --weight 0.75
  ```
  - `--weight`는 AI 결과의 비율입니다. 일반 사진 0.75, 밤하늘·밤 풍경·잔 구름과 작은 실루엣이 많은 사진은 0.6(둔드고비, 루브르, 뉴캐슬, 라스베이거스). AI만 쓰면 인물 둘레에 밝은 테두리가 생기고 희미한 별이 선처럼 변합니다.
  - 작은 얼굴은 AI가 다시 그리면서 번지거나 이중 윤곽이 생길 수 있습니다(체팔루 편). 업스케일 후 원본과 얼굴을 나란히 비교하고, 문제가 있을 때만 `--protect x0,y0,x1,y1`(원본 픽셀 기준 얼굴 영역, 여러 번 가능)을 붙입니다. 그 부분만 일반 확대본에 약한 샤픈을 더해 씁니다. 문제가 없는데 붙이면 잡티가 도드라질 수 있습니다(후시미 이나리 편).
  - 좌표는 원본 크기 기준입니다. 화면에 축소되어 보이는 이미지 좌표를 그대로 쓰지 않습니다.
- GPU가 있는 개인 컴퓨터에서는 Upscayl 데스크톱 앱으로 같은 작업을 장당 몇 초에 할 수 있습니다. 결과를 `prepare.py`에 `--ai`로 넘기면 됩니다.
- 화면에는 Astro가 만든 WebP만 나가고(커버 최대 3200px), 라이트박스는 최대 3840px 판을 엽니다. 8K 원본은 그대로 다운로드되지 않습니다.

## 6. 문체 명세서 (비공개)

- 위치: Google Drive `공유 드라이브 B11 / B Writes / my-writing-style_SKILL_v17.md`(최신). v4~v16은 이전 버전입니다.
- 주요 절: §0 혼합 비율, §6 한 편의 구성과 연재, §9 사실성, §11 입력 상황별 프로토콜, §13 사용자 판단 기록, §14 사진 스타일, §15 사용자가 재료를 주는 방식.
- 쓰는 법: Claude Code에서는 이 파일을 `~/.claude/skills/my-writing-style/SKILL.md`로 저장하면 `my-writing-style` 스킬로 불러집니다. 다른 AI에는 파일 전체를 지침으로 붙여 넣습니다.
- 이 파일에는 글쓴이 개인 정보가 들어 있으므로 이 공개 저장소에 복사하지 않습니다.

## 7. 디자인 체계와 본문 레이아웃

- 서체: 제목·도입 Noto Serif KR, 본문 Pretendard Variable, 영문 로고·메뉴 Manrope. 배경 크림(#F6F3ED), 포인트 올리브. 자세한 것은 `docs/DESIGN_SYSTEM.md`.
- 여행기 상세(`src/components/StoryArticle.astro`, `src/styles/story-layouts.css`) — 사용자가 고른 **A안(커버 스토리)**:
  - 첫 화면을 채우는 커버 사진 위에 VOL 줄(VOL · 대륙 · 나라 · 계절 연도), 제목, 영문 부제.
  - 리드 문장 + 정보 칸(날짜·장소·나라·권).
  - 넓은 화면 2단 본문, 첫 글자 드롭캡, 인용구는 큰따옴표 장식과 함께 전체 폭.
  - 글자 크기 단계: 12 라벨 · 14 정보 · 17 본문 · 28 리드 · 42 인용구(모바일 22) · 큰 제목.
  - 긴 제목(예: 산티아고 데 콤포스텔라)은 휴대폰에서 두 줄로 나뉩니다.
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
- 화면 확인은 Playwright로 데스크톱(1440×900)과 휴대폰(390×844, 고해상도 3배)을 찍고, 모든 페이지의 `document.documentElement.scrollWidth`가 화면 폭과 같은지(가로 넘침 없음) 확인합니다.
- Figma MCP는 연결하지 않았습니다(사용자 Figma 계정 연결이 필요하고, 현재 Figma 파일이 없음).

## 9. 남은 일과 정리할 것

- 원격 브랜치 정리(사용자가 직접 삭제): `chore/cleanup`, `content/first-stories`, `design/editorial-polish`, `design/story-layouts`. `design/story-proposals`는 개선안 검토가 끝나면 삭제.
- 홈의 지구본 핀 좌표는 도시·지역 단위입니다. 숙소 등 정확한 위치는 넣지 않습니다.
- 커스텀 도메인, canonical/sitemap/OG 절대 URL은 아직 없습니다(`docs/PUBLISHING.md`).
- 같은 시리즈의 국내판 사이트는 별도 클라우드 세션에서 새로 만드는 중입니다(이 저장소와 무관).

## 10. 이 클라우드 작업을 로컬에서 이어받기

Claude Code CLI가 설치된 컴퓨터에서, 같은 claude.ai 계정으로 로그인한 상태로:

```sh
git clone https://github.com/burntbread-jpg/elsewhere && cd elsewhere
claude --teleport session_019nuTKR7jt1eVht2FLwZdih
```

대화 기록 전체와 브랜치를 그대로 가져옵니다. 클라우드에 설치했던 스킬, 업스케일 도구, 임시 파일은 따라가지 않으므로 5절, 6절, 8절대로 로컬에 다시 설치합니다.
