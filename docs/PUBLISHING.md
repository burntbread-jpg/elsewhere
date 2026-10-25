# GitHub / Vercel 연결

## 준비 상태

## 실제 연결 결과 — 2026-10-25

- 공개 GitHub: https://github.com/burntbread-jpg/elsewhere
- Vercel 프로젝트: https://vercel.com/burntbread/elsewhere-travel-archive
- 프로덕션: https://elsewhere-travel-archive.vercel.app/
- `main` push 자동 배포 확인. 검증된 앱 커밋 `70ee320`.
- GitHub Actions 타입 검사/빌드 성공: https://github.com/burntbread-jpg/elsewhere/actions/runs/40156528055
- Vercel Production Ready: https://vercel.com/burntbread/elsewhere-travel-archive/GVPtniHtrdMLUCXaSGL6kaBrpGfg
- 초기 Linux 빌드의 MissingSharp 오류는 sharp 0.34.5 직접 의존성 선언으로 해결했습니다.
- 홈 및 샘플 여행기 공개 URL 표시를 확인했습니다. 현재는 예시 콘텐츠이며 실제 사진은 아직 없습니다.

아래는 향후 재연결과 운영을 위한 절차입니다.

Astro 정적 출력 `dist/`, `vercel.json`, pnpm 잠금 파일, GitHub Actions 검증 작업을 제공합니다. 배포 계정·저장소·도메인은 임의 생성하거나 지정하지 않았습니다.

## 연결 절차

1. 개인 계정에 비공개 GitHub 저장소를 만들고 이 폴더 전체를 원격 저장소에 push합니다. `node_modules`, `dist`, `.env`, 원본 사진을 포함하지 않습니다.
2. Vercel에서 해당 저장소를 Import합니다. Framework는 Astro, 빌드 `pnpm build`, 출력 `dist`, Node.js 24를 사용합니다.
3. Production branch는 `main`으로 지정합니다. PR Preview에도 공개 승인된 콘텐츠만 넣습니다.
4. Preview에서 주요 화면, 라이트박스, 모바일 레이아웃을 확인한 후 승인된 변경을 main에 반영합니다.
5. 실제 `vercel.app` URL과 커스텀 도메인이 확정되면 Astro `site` 설정, canonical, sitemap 및 OG 이미지의 절대 URL을 추가합니다.

공식 근거: [Astro on Vercel](https://vercel.com/docs/frameworks/frontend/astro), [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/), [Tailwind / Astro](https://docs.astro.build/en/guides/styling/). 2026-10-25 접근 확인. 정적 사이트이므로 서버용 Vercel Adapter는 설치하지 않습니다.

## 롤백

문제 커밋을 `git revert`한 뒤 push하거나 Vercel의 검증된 이전 배포로 되돌립니다. 공개된 사진을 철회할 때는 Git 기록과 기존 배포에도 파일이 남을 수 있으므로 별도 삭제·접근 제한 처리가 필요합니다.
