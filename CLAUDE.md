# nestjs-rest-cqrs-example — Agent Guide

DDD + CQRS 기반 NestJS 예제. `account`, `notification` 두 도메인을 보유하며
`src/<domain>/{domain,application,interface,infrastructure}/` 4레이어 구조를 따른다.

**모든 설계·구현 결정은 외부 참조인 [backend-service-playbook](https://github.com/kyhsa93/backend-service-playbook)의 NestJS 구현(`implementations/nestjs`)을 따른다.**
이 파일은 playbook의 어떤 문서를 언제 읽어야 하는지를 알려주는 진입점이다.

---

## 1. Playbook 참조 방법

- 저장소: `https://github.com/kyhsa93/backend-service-playbook` (branch: `main`) — NestJS 문서는 `implementations/nestjs/`, 언어 무관 원칙은 루트 `docs/`
- 문서 raw URL 패턴:
  ```
  https://raw.githubusercontent.com/kyhsa93/backend-service-playbook/main/<path>
  ```
- 권장 접근 방식 (상황별):
  - `WebFetch`로 개별 문서 읽기 — 특정 주제만 확인할 때
  - `gh api repos/kyhsa93/backend-service-playbook/contents/<path> --jq .content | base64 -d` — 전체 파일 내용이 필요할 때
  - 깊은 작업 시 임시 clone: `git clone --depth 1 https://github.com/kyhsa93/backend-service-playbook.git /tmp/backend-service-playbook`

---

## 2. 작업 → 문서 인덱스

작업 전에 이 표에서 관련 문서를 먼저 식별하라. 경로는 backend-service-playbook 저장소 루트 기준.

### 설계 / 프로세스

| 작업 / 키워드 | 문서 |
|---|---|
| 설계, 요구사항 분석, 전술 설계, Vertical Slice 리팩토링 | `docs/development-process.md` |
| 설계 원칙 (framework 무의존 도메인, Aggregate 캡슐화, Repository 주입) | `implementations/nestjs/docs/architecture/design-principles.md` |
| 코딩 컨벤션, 파일명 규칙, import 순서, Conventional Commits | `implementations/nestjs/docs/conventions.md` |
| 새 도메인 추가, Order 템플릿 | `implementations/nestjs/docs/reference.md` |
| 작업 완료 후 자기 검토 | `implementations/nestjs/docs/checklist.md` |

### 레이어 · 구조

| 작업 / 키워드 | 문서 |
|---|---|
| 프로젝트 디렉토리 레이아웃 | `implementations/nestjs/docs/architecture/directory-structure.md` |
| 레이어 역할 (Domain / Application / Interface / Infrastructure) | `implementations/nestjs/docs/architecture/layer-architecture.md` |
| Repository 인터페이스 (`abstract class`) / 구현체 분리 | `implementations/nestjs/docs/architecture/repository-pattern.md` |
| Domain Service (여러 Aggregate 조율) | `docs/architecture/domain-service.md` |
| 크로스 도메인 호출, Adapter 패턴 | `implementations/nestjs/docs/architecture/cross-domain.md` |
| Aggregate ID 생성/전파 | `implementations/nestjs/docs/architecture/aggregate-id.md` |
| 공유 모듈 (`libs/`) | `implementations/nestjs/docs/architecture/shared-modules.md` |
| `@Module`, providers, DI 바인딩 | `implementations/nestjs/docs/architecture/module-pattern.md` |

### 데이터 / 트랜잭션

| 작업 / 키워드 | 문서 |
|---|---|
| TypeORM 사용법, QueryBuilder, TransactionManager | `implementations/nestjs/docs/architecture/persistence.md` |
| 마이그레이션, data-source | `implementations/nestjs/docs/architecture/persistence.md` |
| Domain Event, Outbox, OutboxPoller, OutboxConsumer, EventHandlerRegistry | `implementations/nestjs/docs/architecture/domain-events.md` |
| `@nestjs/cqrs` CommandBus/QueryBus/Handler | `implementations/nestjs/docs/architecture/cqrs-pattern.md` |

### API / Interface

| 작업 / 키워드 | 문서 |
|---|---|
| REST 엔드포인트, Controller, DTO | `implementations/nestjs/docs/architecture/module-pattern.md` |
| Swagger (`@ApiTags`, `@ApiProperty`, `@ApiOperation`) | `implementations/nestjs/docs/architecture/module-pattern.md` |
| Pagination, 공통 응답 포맷 | `implementations/nestjs/docs/architecture/api-response.md` |
| Rate Limiting / Throttler | `implementations/nestjs/docs/architecture/rate-limiting.md` |
| Auth Guard, JWT, Bearer 토큰 | `implementations/nestjs/docs/architecture/authentication.md` |
| Middleware / Guard / Interceptor / Pipe | `implementations/nestjs/docs/architecture/cross-cutting-concerns.md` |
| 에러 enum, `generateErrorResponse`, HttpException 매핑 | `implementations/nestjs/docs/architecture/error-handling.md` |
| Deprecated 엔드포인트 표시 | `implementations/nestjs/docs/conventions.md` (Deprecated 섹션) |

### 운영 / 인프라

| 작업 / 키워드 | 문서 |
|---|---|
| 환경 변수 검증, ConfigModule | `implementations/nestjs/docs/architecture/config.md` |
| Secret 관리 | `implementations/nestjs/docs/architecture/secret-manager.md` |
| `main.ts`, NestFactory, Swagger 부트스트랩 | `implementations/nestjs/docs/architecture/bootstrap.md` |
| Graceful Shutdown, 헬스체크 | `implementations/nestjs/docs/architecture/graceful-shutdown.md` |
| `docker-compose`, LocalStack, Postgres | `implementations/nestjs/docs/architecture/local-dev.md` |
| Dockerfile, 멀티스테이지 빌드 | `implementations/nestjs/docs/architecture/container.md` |
| 로깅, 구조화 로그, Observability | `implementations/nestjs/docs/architecture/observability.md` |

### 비동기 / Task Queue / Scheduling

| 작업 / 키워드 | 문서 |
|---|---|
| `@Cron`, `ScheduleModule`, Scheduler 레이어 | `implementations/nestjs/docs/architecture/scheduling.md` |
| Task Queue (`@TaskConsumer`, Task Controller) | `implementations/nestjs/docs/architecture/scheduling.md` |
| 멱등성 (ledger, 원자성) | `implementations/nestjs/docs/architecture/scheduling.md` |
| SQS FIFO, Deduplication, DLQ, VisibilityTimeout | `implementations/nestjs/docs/architecture/scheduling.md` |

### 품질 / 검증

| 작업 / 키워드 | 문서 |
|---|---|
| 단위/통합 테스트, jest 설정 | `implementations/nestjs/docs/architecture/testing.md` |
| 하네스 CLI, 규칙 목록 | `implementations/nestjs/harness/README.md` |

---

## 3. 핵심 규칙 요약 (필수 숙지)

playbook `implementations/nestjs/docs/architecture/design-principles.md`에서 발췌:

1. **도메인 우선 디렉토리** — `src/<domain>/` 하위 4레이어
2. **Domain 레이어는 프레임워크 무의존** — `@nestjs/*`, `typeorm` import 금지
3. **비즈니스 규칙은 Aggregate Root에 캡슐화** — Application Service는 조율만
4. **Aggregate Root 단위 Repository** — `abstract class` in domain/, 구현체 in infrastructure/
5. **DI로 Repository 주입** — `{ provide: AbstractClass, useClass: Impl }`
6. **Repository 조회는 `find<Noun>s` 하나만** — 단건은 `take: 1` 후 `.pop()`
7. **Repository에 update 메서드 금지** — Aggregate 메서드로 수정 후 `save<Noun>`
8. **Mapping Table은 양 도메인에서 접근** — orchestration은 Service가
9. **save/delete는 cascade 처리**
10. **Interface DTO = Application 객체의 thin wrapper** — 로직 없이 extends
11. **에러는 enum으로 타입화** — free-form 문자열 금지
12. **Controller에서 에러 타입 → HTTP 예외 변환** — `generateErrorResponse` 유틸
13. **Domain/Service에서 HttpException throw 금지** — plain Error

---

## 4. 프로젝트 현황 및 하네스 (2026-10-05 기준)

- CI 게이트: backend-service-playbook 에이전트 스킬, `adopt` 프로필, 커밋 SHA 고정 (`.github/workflows/main.yml`)
- 마지막 평가: **92점 / Grade A** (38 failures). `MIN_SCORE` 90
- 남은 high 규칙:
  - `local-dev.postgres-service-missing` — MySQL 저장소에 대한 오탐 (backend-service-playbook#461)

작업 시 새로 추가/수정하는 코드는 위 규칙을 **반드시** 준수한다. 기존 deviation은 관련 작업 맥락에서 정리하거나 별도 리팩토링 PR로 처리.

---

## 5. 하네스 실행 (자기 검증)

```bash
# 최초 1회 — 에이전트 스킬 설치 (.claude/skills 등 에이전트 디렉터리에 복사됨)
npx skills add kyhsa93/backend-service-playbook --skill nestjs-architecture-harness

# 평가 (의존성 설치된 상태에서, 저장소 루트)
bash <스킬 디렉터리>/scripts/run.sh . --out=/tmp/eval.json

# 실패 요약
jq '.failures | group_by(.ruleId) | map({ruleId: .[0].ruleId, count: length})' /tmp/eval.json
```

각 failure는 `ruleId`, `severity`, `docRef`(관련 playbook 문서 URL)를 포함한다. `docRef`를 먼저 열어 수정 방향을 확인할 것. CI와 같은 점수를 보려면 스킬을 CI의 `BSP_REF`와 같은 커밋으로 맞춘다.

---

## 6. 로컬 실행 / 개발 명령

- 빌드: `npm run build`
- 테스트: `npm test` (현재 46/46 통과)
- 린트: `npm run lint` (ESLint flat config)
- dev: `npm run start:dev`

---

## 7. 작업 흐름 권장 순서

1. 작업 시작 전 이 파일의 2번 표에서 관련 playbook 문서를 식별 → `WebFetch`로 조회
2. `implementations/nestjs/docs/conventions.md`의 파일명/import/commit 규칙 준수
3. 작업 완료 후 하네스(5번)로 자기 검증
4. `implementations/nestjs/docs/checklist.md`의 기계 검증 불가 항목을 수동 점검
5. 커밋 메시지는 Conventional Commits 형식, `Co-Authored-By` 트레일러 포함하지 않음
