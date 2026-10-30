# Backend Architecture Guidelines (Node.js / TypeScript)

Purpose: backend single source of truth for architecture, implementation order, testing, and backend handover format.

## Stack Profile

- Runtime: Node.js 20+ LTS
- Language: TypeScript 5+ in `strict` mode
- Package manager: npm, pnpm, or yarn — use the one the lockfile in the repository already commits to
- Modules: ES modules with the project's configured path alias (for example `@/lib/...`); do not mix `require` into TypeScript sources

## Project Structure Expectations

- Keep entry points (route handlers, controllers, CLI scripts) thin: parse input, delegate, shape the response.
- Keep business logic in plain TypeScript modules that take data in and return data out.
- Keep persistence logic in dedicated data-access modules; nothing else opens a database connection or issues SQL.
- Keep shared request, response, and domain types in one types module per domain, and import them everywhere instead of re-declaring shapes inline.
- Do not perform I/O (database, filesystem, network, `Date.now()`, `process.env`) inside business-logic modules. Pass what they need as arguments — that is what makes them testable without a server.
- Follow the repository's existing folder layout and file naming; do not introduce a parallel structure.

## Code Quality

### Typing
- Keep `strict` enabled. Do not add `any`, `as unknown as`, or `@ts-expect-error` to silence a real type error.
- Give exported functions explicit parameter and return types.
- Model optional data as `T | null` or `T | undefined` deliberately, and handle both branches.
- Use named exports for shared modules; reserve default exports for framework-mandated files.

### Correctness
- Do not mutate function arguments. Build and return new objects.
- Never swallow an error with an empty `catch {}`. Handle it, convert it to a typed failure, or let it propagate.
- Await every promise, or explicitly handle its rejection — no floating promises.
- Validate and coerce external input (query strings, request bodies, environment variables) at the boundary before it reaches business logic. Treat `parseInt` results as possibly `NaN`.
- Keep behaviour deterministic: inject the current time as a parameter rather than calling `new Date()` deep inside logic.

### Tooling
- Run the project's type-check or build command and the linter before considering a change complete; both must pass with no errors.
- Use the formatter and lint configuration already committed to the repository; do not add a competing one.

## Security Rules

- Do not hardcode secrets, tokens, or passwords in source files.
- Do not log sensitive data.
- Wrap and handle errors consistently throughout the call chain.
- Handle cancellation and timeouts consistently across route handlers and the modules they call.
- Do not leak sensitive implementation details in client-facing responses.

## Persistence and Data Rules

- Never build SQL from untrusted input by string concatenation.
- Use migrations for schema changes.
- Keep transaction boundaries explicit in the data-access module.

## Testing Strategy

- Cover edge cases including invalid input, not found, and constraint violations.
- Tests should verify behavior, not private internals.
- Test names should clearly describe the behavior or test case.
- For complex business logic in domain modules, add unit tests with fixture data as needed.

## Required Workflow Contract (Backend)

Use this file as the source of truth for:
- backend plan format
- backend implementation checklist
- backend handover format

## Backend Plan Format

```markdown
## Feature Plan: [Feature Name]

### What we are building
[1 short paragraph in plain language]

### Backend scope
- New or changed endpoints: [list]
- Files to create/modify: [list]
- Data/storage changes: [yes/no and details]

### Frontend impact
- New or changed UI areas: [list]
- API calls required by frontend: [list]

### API Contract
| Method | Path | Auth Required | Request | Response | Error Codes |
|--------|------|---------------|---------|----------|-------------|
| POST | /api/example | No | { "name": "string" } | { "id": 1 } | 400, 500 |

### Testing plan
- Backend tests to add/update: [list — must follow Testing Strategy defaults; do not add route handler or data-access tests unless the user explicitly requested them]
- Integration points to verify: [list]

### Risks and unknowns
- [list]
```

## Backend Implementation Checklist

- [ ] Read this file before coding
- [ ] Types: create/update the request, response, and domain types in the shared types module
- [ ] Data access: create/update queries in the data-access module, using bound parameters only
- [ ] Domain logic: implement the rules in a plain module with no I/O, taking the current time as a parameter
- [ ] Route handler: parse and validate input, delegate to the domain module, return the project's standard response shape
- [ ] Tests: follow the Testing Strategy section; do not add route handler tests by default
- [ ] Run the project type-check/build command — it must pass with no TypeScript errors
- [ ] Run the project backend test command
- [ ] Verify no sensitive data exposure in logs/errors

## Backend Handover Format

```markdown
### Backend Handover

**Endpoints Created / Modified**
| Method | Path | Auth Required | Request Body | Response Body | Status Codes |
|--------|------|---------------|--------------|---------------|--------------|
| POST | /api/example | No | { "name": "string" } | { "id": 1 } | 201, 400, 500 |

**Data and Schema Changes**
- [none or list migrations/schema updates]

**Files Changed**
| File | Change |
|------|--------|
| app/api/example/route.ts | Created or Modified with short reason |

**Test Result**
- Status: PASS or FAIL
- Command: [exact command]
- Notes: [summary or failure excerpt]

**Notes for Frontend**
- [validation rules]
- [auth requirements]
- [pagination/sorting/filter behavior]

**Notes for Reviewer**
- [trade-offs]
- [known limitations]
```

## Framework: Next.js (App Router)

- Framework: Next.js 14+ with the App Router
- Backend surface: Route Handlers under `app/api/`, plus any server-only modules they call
- Data: the project's existing client (SQLite via `better-sqlite3`, Prisma, Drizzle, or project standard)

This file governs the **server side** of the Next.js application. When a frontend
architecture guideline is also installed, it governs pages, components, and hooks;
this file governs route handlers, domain logic, and data access. Where both could
apply, the frontend guideline wins for rendering concerns and this one wins for
request handling and persistence.

## Project Structure Expectations (Next.js backend)

- Put each endpoint in `app/api/<segment>/route.ts` and export the HTTP verb functions it supports (`GET`, `POST`, `PATCH`, `DELETE`).
- Keep domain logic in `lib/` (or the project's equivalent); route handlers import it, never inline it.
- Keep database schema, connection, and queries in a single data-access module (for example `lib/db.ts`); no other file may import the database driver.
- Keep shared types in `lib/types.ts` (or the project's equivalent) and import them from both route handlers and UI code.
- Expose public URL aliases through `rewrites()` in `next.config.mjs` rather than duplicating a handler under a second path.

## API and Validation Conventions

- Use `NextRequest`/`NextResponse` and read query parameters from `request.nextUrl.searchParams`.
- Parse every query parameter explicitly: provide a default, coerce the type, and reject or clamp out-of-range values. Guard `parseInt` against `NaN` and negative values before using them for `limit`/`offset`.
- Accept boolean flags in one documented form and parse them in one helper; do not scatter ad-hoc `=== 'true' || === '1'` comparisons across handlers.
- Validate request bodies before any business logic runs, and return `400` with a stable error shape on failure. Use a schema validator (Zod or project standard) when the project already has one.
- Return a consistent success envelope across endpoints (for example `{ total, items }` for collections) and a consistent error envelope (for example `{ error: { code, message } }`).
- Set status codes explicitly with `NextResponse.json(body, { status })`: `201` on create, `400` on validation failure, `404` when the resource does not exist, `500` for unexpected failures.
- Never return a raw exception message or stack trace to the client. Log the detail server-side, return a safe message.
- Add `export const dynamic = 'force-dynamic'` to handlers that must run per request (reading search params, cookies, or live database state); leave it off handlers that are safe to cache, and say which one applies in the plan.
- Route handlers must not write into the project directory at request time. Build an in-memory payload and return it, or write under an OS temporary directory or a configured output path.
- Declare native or server-only dependencies in `next.config.mjs` (`serverExternalPackages`, or `experimental.serverComponentsExternalPackages` on Next.js 14) so they are not bundled for the client.

## Persistence and Data Rules (Next.js)

- Use prepared statements with bound parameters for every query. Never build SQL by concatenating request values.
- Filter, sort, and paginate in the query when the dataset can grow; do not load the whole table and slice it in JavaScript.
- Keep schema changes in versioned migration files. A development seed script is not a migration.
- Open and close connections consistently with the pattern already used in the data-access module, and wrap multi-statement writes in a transaction.
- Read the database location from an environment variable with a sane default; do not hardcode an absolute path.

## Implementation Order (Mandatory)

Implement backend changes in this order unless the approved plan explicitly says otherwise:

1. Types (shared request/response/domain types)
2. Data access (schema, migration, queries)
3. Domain logic (pure modules in `lib/`)
4. Route handler (`app/api/.../route.ts`)
5. Tests

This keeps the data contract and the business rules stable before an HTTP surface is exposed, and it keeps the logic testable without starting a server.

## Testing Strategy (Next.js-specific)

- Test runner: Vitest (or the runner already configured in the project). Use the project's existing test command; do not introduce a second runner.
- Prefer direct unit tests of the domain modules in `lib/`: call the exported function with fixture rows and an injected `now`, and assert on the returned data. This is the default verification layer.
- Assert on observable results — the returned order, scores, counts, and filtering — not on internal helpers.
- Pass a fixed reference time into every test that depends on dates. A test that reads the machine clock is a failing test waiting to happen.
- Do not create route handler tests by default. Add them only when the handler itself holds meaningful logic (parameter parsing, status-code selection, error mapping), or when the user explicitly requested them or the approved plan requires them.
- Do not create data-access tests by default. Add them only when custom SQL exists, or when explicitly requested by the user or required by the approved plan.
- When tests reset or reseed a shared database file, keep the suite serial (for example `fileParallelism: false`) so the runs cannot interleave.

**Planning constraint:** When generating a feature plan, do not include route handler tests or data-access tests in the testing plan unless the user explicitly requested them. The "required by the approved plan" clause applies only during implementation — it does not allow the planner to self-approve excluded test types.
