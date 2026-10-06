# engineer 백로그 큐 — nestjs-rest-cqrs-example

출처: business-plan `bizdev` 판정(2026-10-06, `opencore/phase1-queue.md`), 랭킹 축 G1 기여도 >
구현시간 > 선행관계. engineer는 이 파일의 **맨 위 항목 하나**만 받아 구현한다 — 우선순위를
다시 매기지 않는다. 완료되면 이 파일에서 해당 항목을 지운다(메인 세션 또는 group-cto가 확인
후 반영).

## 1. k8s-playbook 상호링크 추가

- **무엇을**: README.md의 "Related:" 절에 `backend-service-playbook` 링크는 이미 있다. 같은
  절에 `k8s-playbook`(배포 자동화·GitHub Marketplace Action — kyhsa93/k8s-playbook) 한
  문장만 추가한다.
- **왜**: G1 기여도 중(★873/fork159의 기존 트래픽을 신규 자산으로 돌림, backend-service-playbook
  링크가 이미 있어 증분 효과), 구현시간 매우 낮음(15분), 선행관계: k8s-playbook이 먼저
  릴리스(태그·Marketplace)된 뒤에 걸면 방문자 경험이 더 매끈하다 — k8s-playbook 큐의 1번이
  끝난 뒤 처리 권장.
