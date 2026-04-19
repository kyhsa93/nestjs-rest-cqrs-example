# nestjs-rest-cqrs-example — Agent Guide

DDD + CQRS 기반 NestJS 예제. `account`, `notification` 두 도메인을 보유하며
`src/<domain>/{domain,application,interface,infrastructure}/` 4레이어 구조를 따른다.

**모든 설계·구현 결정은 외부 참조인 [nestjs-playbook](https://github.com/kyhsa93/nestjs-playbook)을 따른다.**
이 파일은 playbook의 어떤 문서를 언제 읽어야 하는지를 알려주는 진입점이다.

---

## 1. Playbook 참조 방법

- 저장소: `https://github.com/kyhsa93/nestjs-playbook` (branch: `main`)
- 문서 raw URL 패턴:
  ```
  https://raw.githubusercontent.com/kyhsa93/nestjs-playbook/main/<path>
  ```
- 권장 접근 방식 (상황별):
  - `WebFetch`로 개별 문서 읽기 — 특정 주제만 확인할 때
  - `gh api repos/kyhsa93/nestjs-playbook/contents/<path> --jq .content | base64 -d` — 전체 파일 내용이 필요할 때
  - 깊은 작업 시 임시 clone: `git clone --depth 1 https://github.com/kyhsa93/nestjs-playbook.git /tmp/nestjs-playbook`

---

## 2. 작업 → 문서 인덱스

작업 전에 이 표에서 관련 문서를 먼저 식별하라. 경로는 playbook 저장소 기준.

### 설계 / 프로세스

| 작업 / 키워드 | 문서 |
|---|---|
| 설계, 요구사항 분석, 전술 설계, Vertical Slice 리팩토링 | `docs/development-process.md` |
| 설계 원칙 (framework 무의존 도메인, Aggregate 캡슐화, Repository 주입) | `docs/architecture/design-principles.md` |
| 코딩 컨벤션, 파일명 규칙, import 순서, Conventional Commits | `docs/conventions.md` |
| 새 도메인 추가, Order 템플릿 | `docs/reference.md` |
| 작업 완료 후 자기 검토 | `docs/checklist.md` |

### 레이어 · 구조

| 작업 / 키워드 | 문서 |
|---|---|
| 프로젝트 디렉토리 레이아웃 | `docs/architecture/directory-structure.md` |
| 레이어 역할 (Domain / Application / Interface / Infrastructure) | `docs/architecture/layer-architecture.md` |
| Repository 인터페이스 (`abstract class`) / 구현체 분리 | `docs/architecture/repository-pattern.md` |
| Domain Service (여러 Aggregate 조율) | `docs/architecture/domain-service.md` |
| 크로스 도메인 호출, Adapter 패턴 | `docs/architecture/cross-domain.md` |
| Aggregate ID 생성/전파 | `docs/architecture/aggregate-id.md` |
| 공유 모듈 (`libs/`) | `docs/architecture/shared-modules.md` |
| `@Module`, providers, DI 바인딩 | `docs/architecture/module-pattern.md` |

### 데이터 / 트랜잭션

| 작업 / 키워드 | 문서 |
|---|---|
| TypeORM 사용법, QueryBuilder, TransactionManager | `docs/architecture/database-queries.md` |
| 마이그레이션, data-source | `docs/architecture/database-queries.md` |
| Domain Event, Outbox, OutboxRelay, EventConsumer | `docs/architecture/domain-events.md` |
| `@nestjs/cqrs` CommandBus/QueryBus/Handler | `docs/architecture/cqrs-pattern.md` |

### API / Interface

| 작업 / 키워드 | 문서 |
|---|---|
| REST 엔드포인트, Controller, DTO | `docs/architecture/module-pattern.md` |
| Swagger (`@ApiTags`, `@ApiProperty`, `@ApiOperation`) | `docs/architecture/module-pattern.md` |
| Pagination, 공통 응답 포맷 | `docs/architecture/pagination.md` |
| Rate Limiting / Throttler | `docs/architecture/rate-limiting.md` |
| Auth Guard, JWT, Bearer 토큰 | `docs/architecture/authentication.md` |
| Middleware / Guard / Interceptor / Pipe | `docs/architecture/middleware-interceptor.md` |
| 에러 enum, `generateErrorResponse`, HttpException 매핑 | `docs/architecture/error-handling.md` |
| Deprecated 엔드포인트 표시 | `docs/conventions.md` (Deprecated 섹션) |

### 운영 / 인프라

| 작업 / 키워드 | 문서 |
|---|---|
| 환경 변수 검증, ConfigModule | `docs/architecture/config.md` |
| Secret 관리 | `docs/architecture/secret-manager.md` |
| `main.ts`, NestFactory, Swagger 부트스트랩 | `docs/architecture/bootstrap.md` |
| Graceful Shutdown, 헬스체크 | `docs/architecture/graceful-shutdown.md` |
| `docker-compose`, LocalStack, Postgres | `docs/architecture/local-dev.md` |
| Dockerfile, 멀티스테이지 빌드 | `docs/architecture/dockerfile.md` |
| 로깅, 구조화 로그, Observability | `docs/architecture/logging.md` |

### 비동기 / Task Queue / Scheduling

| 작업 / 키워드 | 문서 |
|---|---|
| `@Cron`, `ScheduleModule`, Scheduler 레이어 | `docs/architecture/scheduling.md` |
| Task Queue (`@TaskConsumer`, Task Controller) | `docs/architecture/scheduling.md` |
| 멱등성 (ledger, 원자성) | `docs/architecture/scheduling.md` |
| SQS FIFO, Deduplication, DLQ, VisibilityTimeout | `docs/architecture/scheduling.md` |

### 품질 / 검증

| 작업 / 키워드 | 문서 |
|---|---|
| 단위/통합 테스트, jest 설정 | `docs/architecture/testing.md` |
| 하네스 CLI, 규칙 목록 | `harness/README.md` |

---

## 3. 핵심 규칙 요약 (필수 숙지)

playbook `docs/architecture/design-principles.md`에서 발췌:

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

## 4. 프로젝트 현황 및 하네스 (2026-04-19 기준)

- 마지막 평가: **85점 / Grade B** (29 failures, 24 high)
- 주요 미충족 규칙:
  - `layer.domain.no-framework` × 10 — 도메인에서 `AggregateRoot` (@nestjs/cqrs), `HttpException` (@nestjs/common) 사용 중
  - `repository.no-direct-instantiation` × 12 — Application 핸들러에서 `throw new NotFoundException(...)` 등 HttpException 사용
  - `scheduler.*` × 5 — `@Cron`이 `AppService.ts`, `AccountsModule.ts`에 위치 (infrastructure/ 밖), 파일명이 `*-scheduler.ts` 아님, try-catch 부재

작업 시 새로 추가/수정하는 코드는 위 규칙을 **반드시** 준수한다. 기존 deviation은 관련 작업 맥락에서 정리하거나 별도 리팩토링 PR로 처리.

---

## 5. 하네스 실행 (자기 검증)

```bash
# 최초 1회
git clone --depth 1 https://github.com/kyhsa93/nestjs-playbook.git /tmp/nestjs-playbook
cd /tmp/nestjs-playbook/harness && npm install

# 평가
npm run evaluate -- /Users/hoon/yh/nestjs-rest-cqrs-example --out=/tmp/eval.json

# 실패 요약
jq '.failures | group_by(.ruleId) | map({ruleId: .[0].ruleId, count: length})' /tmp/eval.json
```

각 failure는 `ruleId`, `severity`, `docRef`(관련 playbook 문서)를 포함한다. `docRef`를 먼저 열어 수정 방향을 확인할 것.

---

## 6. 로컬 실행 / 개발 명령

- 빌드: `npm run build`
- 테스트: `npm test` (현재 23/23 통과)
- 린트: `npm run lint` (ESLint flat config)
- dev: `npm run start:dev`

---

## 7. 작업 흐름 권장 순서

1. 작업 시작 전 이 파일의 2번 표에서 관련 playbook 문서를 식별 → `WebFetch`로 조회
2. `docs/conventions.md`의 파일명/import/commit 규칙 준수
3. 작업 완료 후 하네스(5번)로 자기 검증
4. `docs/checklist.md`의 기계 검증 불가 항목을 수동 점검
5. 커밋 메시지는 Conventional Commits 형식, `Co-Authored-By` 트레일러 포함하지 않음
