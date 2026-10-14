# Comprehensive Security & Vulnerability Audit Checklist

This reference outlines the security inspection checklist used during `/code-review` (especially in `--mode security`). It synthesizes the OWASP Top 10, enterprise cloud architectures, and API security guidelines.

---

## 1. Authentication & Session Security (OWASP A07 / A01)

- [ ] **Token Validation & Verification**:
  - Are JWTs/JWEs strictly cryptographically verified with expected algorithms (`algorithms: ['RS256']` / `['HS256']`) rather than blindly decoded via `jwt.decode()`?
  - Is the shared secret / public key retrieved securely from trusted environment variables and never hardcoded?
- [ ] **Broken Object-Level Authorization (BOLA / IDOR)**:
  - When fetching or updating resources (`/api/projects/:projectId`, `/api/users/:userId`), does the query verify that the authenticated requester owns or has explicit permission to access that specific `projectId`?
  - Are tenant boundaries strictly partitioned in multi-tenant schemas?
- [ ] **Role & Permission Gating**:
  - Are sensitive administrative or mutating endpoints guarded by role verification middleware (`protectByRole`, `canManageAssets`, `admin_chatbot`)?
  - Does the frontend UI permission check mirror backend enforcement? (Frontend gating alone is never sufficient).
- [ ] **Session & Cookie Security**:
  - Are authentication cookies set with `HttpOnly`, `Secure`, and `SameSite=Lax` or `Strict`?
  - When proxying API requests through BFF layers (e.g., Next.js API routes), are session headers and authorization bearer tokens forwarded securely without logging sensitive credentials?

---

## 2. Input Validation, Injection & Sanitization (OWASP A03)

- [ ] **SQL / ORM Injection**:
  - Are all database queries parameterized?
  - If raw SQL is used (e.g., Prisma `$queryRawUnsafe`, TypeORM `query()`), are variables passed as positional parameters rather than interpolated string templates (`${input}`)?
- [ ] **Cross-Site Scripting (XSS)**:
  - Are user-provided strings rendered into HTML safely?
  - If using markdown rendering or `dangerouslySetInnerHTML`, is input passed through a trusted sanitizer (e.g., `DOMPurify`, `rehype-sanitize`)?
  - Are markdown links validated to prevent `javascript:` pseudoprotocols?
- [ ] **Server-Side Request Forgery (SSRF)**:
  - When fetching external URLs or webhooks based on user input, is there a strict domain/IP allowlist?
  - Are private IP ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.1`, AWS metadata `169.254.169.254`) blocked?
- [ ] **Regular Expression Denial of Service (ReDoS)**:
  - Are regex patterns evaluated for polynomial or exponential catastrophic backtracking on untrusted user strings?

---

## 3. File Uploads & Object Storage Security (OWASP A04)

- [ ] **Server-Side MIME & Extension Allowlist**:
  - Is the uploaded file validated on the server side using file magic numbers / buffers (e.g. `file-type`), not merely relying on the client-supplied `Content-Type` header or extension?
- [ ] **Header & Filename Sanitization**:
  - When serving or proxying files, is the `Content-Disposition` header filename sanitized against header injection (CRLF `\r\n`) and path traversal (`../`)?
- [ ] **Storage Key Collision & Partitioning**:
  - Are uploaded files stored in S3/Blob storage with randomized, non-guessable keys (UUID prefixes) partitioned by tenant/project, avoiding direct overwriting of other users' files?
- [ ] **Lifecycle Integrity & Orphaned Assets**:
  - If a file is uploaded to cloud storage before database commit, is there compensation logic (deleting from storage) if the database transaction or validation fails?
  - When replacing an asset, are superseded cloud files explicitly scheduled for deletion or purged?

---

## 4. Cryptography & Secrets Management (OWASP A02)

- [ ] **Zero Hardcoded Secrets**:
  - Are API keys, AWS credentials, database passwords, or JWT secrets absent from code, comments, test fixtures, and Git history?
- [ ] **Frontend Secret Leakage**:
  - In frameworks like Next.js, Vite, or React, are server-only environment variables protected from accidental `NEXT_PUBLIC_` or `VITE_` prefixing?
- [ ] **Timing Attacks**:
  - Are hashes, signatures, and tokens compared using constant-time comparison algorithms (e.g., `crypto.timingSafeEqual`)?

---

## 5. Security Logging & Exception Sanitization (OWASP A09)

- [ ] **Sensitive Data Redaction**:
  - Do application logs exclude passwords, bearer tokens, credit cards, full NRICs, or confidential PII?
- [ ] **Error Message Information Disclosure**:
  - Do public API responses return generic error messages (`Internal Server Error`, `Invalid Credentials`) rather than exposing stack traces, raw database error schemas, or internal file paths?
