# 결정과 진행 상태 — 2026-10-25 KST

## 파일 및 기존 상태

- 작업 시작 시 현재 폴더에는 빈 `outputs/`, `work/`만 있었고 Git 저장소나 연결된 Codex 프로젝트가 없었습니다.
- 다운로드의 `ELSEWHERE_Travel_Archive_Master_Spec_v1.0.md`를 발견해 이 프로젝트 루트에 복사했습니다. SHA-256: `FA588A30592D593C809B7A3843AEA25C32DFEC8A4A760D2C8B7299D46E22A27B`.
- 기존 파일을 덮어쓰지 않도록 새 `outputs/elsewhere`에 생성했습니다. iCloud 폴더에는 접근하지 않았습니다.
- 이 프로젝트 폴더에만 로컬 Git `main` 저장소를 초기화했습니다. 원격 설정과 커밋은 아직 없습니다.
- 이전 대화 조회에서는 첨부 파일과 답변 본문 대신 참조 표식만 반환됐으므로 다운로드에서 찾은 실제 명세를 기준으로 삼았습니다.

## 구현 결정

- 서체 미리보기 검토 후 사용자가 ③ 절제된 사진집 조합을 선택했습니다. Noto Serif KR / Pretendard / Manrope를 기본 공개 서체로 적용하고, 비교 도구의 현재 적용 표시도 ③으로 갱신했습니다.

- 후속 사용자 요청: 홈 첫 화면을 3D 지구본으로 교체하고 표면 클릭 시 해당 지점으로 확대. 지리 좌표 기반 예시 사진 마커를 추가했습니다. 상세 동작과 실제 사진 연결 방법은 `GLOBE.md` 참고.

- Phase 0/1을 우선하며 Phase 2의 배포 설정과 공개 검사도 준비합니다.
- Astro 5 안정 버전 계열, MDX 4, Tailwind 4 및 TypeScript. 정확한 설치 버전은 잠금 파일을 기준으로 합니다.
- 정적 페이지, native dialog 라이트박스. React/GSAP/외부 지도·AI는 도입하지 않습니다.
- 가족 사진 승인 전까지 직접 제작한 WebP 풍경 일러스트 4장과 명시적인 샘플 원고 2편을 사용합니다. 실제 사진 사이트의 최종 미감 완료로 간주하지 않습니다.
- 공개 상태 필터는 모든 목록·상세 경로에 공통 적용합니다. 비공개 원고를 소스에 두면 빌드 검사에서 거부합니다.
- 홈, Journal, 상세, Places, Archive, About, 404, 디자인 시스템 화면 구현.
- 새 콘텐츠 추가는 MDX/공개 이미지 파일만으로 가능. 필터는 URL/뒤로 가기 지원.
- 공개 검사에서는 일부 비밀키 패턴·금지 형식과 EXIF/XMP 마커를 탐지합니다. 완전한 개인정보 감사나 얼굴 검출을 대체하지 않습니다.

## 외부 연결 및 후속 작업

- GitHub 인증 후 main 업로드 완료. Vercel `burntbread/elsewhere-travel-archive` 연결 및 Production 배포 확인. 공개 주소: https://elsewhere-travel-archive.vercel.app/
- Linux 패키지 격리 환경에서 Sharp 누락이 드러나 직접 의존성으로 추가했고, GitHub Actions와 Vercel에서 모두 재검증 성공했습니다.

- 사용자가 `https://github.com/burntbread-jpg/elsewhere.git`를 지정하고 공개 저장소로 진행하도록 명시 승인했습니다. 명세의 비공개 저장소 기본값을 이 결정으로 대체합니다. 개인 원본·비공개 원고 제외 원칙은 유지합니다.

- 연결된 GitHub에서 접근 가능한 저장소 목록이 비어 있었습니다. 원격 저장소 URL·권한 및 Vercel 계정 연결은 미확정입니다.
- 실제 도메인 미정: canonical/sitemap/OG 이미지 절대 URL은 배포 시 설정합니다.
- 실제 개인 사진의 승인·웹 변환, iCloud 수집기, AI 편집기는 후속 Phase 3/4 범위입니다.
- Safari/iOS 실기기 검수 및 Lighthouse 실측은 별도로 필요합니다.

검증 결과는 `QA.md`에서 관리합니다.
