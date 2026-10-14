# Conventional Comments Reference Specification

This reference defines the comment format, labeling conventions, and engagement rules enforced by the `/code-review` skill.

---

## 1. Syntax Format

Every review comment must follow the standard Conventional Comments syntax:

```text
**<label> [decorations]**: <subject>

[discussion / context]

[suggested fix / code snippet]
```

- **`label`** (Required): Defines the intention of the comment.
- **`decorations`** (Optional): Refines the label (e.g., `(blocking)`, `(non-blocking)`, `(security)`, `(test)`).
- **`subject`** (Required): A concise one-sentence statement of the issue or feedback.
- **`discussion`** (Required for issues/suggestions): The **Why** explaining the concrete impact, risk, or bug.
- **`suggested fix`** (Required for issues/suggestions): A runnable code diff or replacement snippet.

---

## 2. Standard Labels & Decorations

| Label | Decoration | Meaning | When to Use |
|---|---|---|---|
| `**issue**` | `(blocking)` | Critical blocker | Security flaws, data loss bugs, crash conditions, broken tests, contract regressions. **Merges must be blocked.** |
| `**issue**` | `(non-blocking)` | Important defect | Logic inconsistencies, unhandled non-fatal edge cases, missing test coverage for non-critical paths. |
| `**suggestion**` | `(performance)` / `(readability)` | Proposed enhancement | Cleaner abstractions, eliminating duplicate code, algorithmic efficiency, or adhering to idiomatic patterns. |
| `**question**` | `(clarification)` | Inquiry on intent | Ambiguous architecture, unclear requirements, unexplained workarounds, or undocumented side effects. |
| `**nitpick**` | `(non-blocking)` | Trivial polish | Variable naming, minor formatting preference, grammatical typo. Purely optional for author to address. |
| `**thought**` | `(non-blocking)` | Idea for future work | High-level architectural thoughts, out-of-scope opportunities, or technical debt notes. |
| `**chore**` | `(blocking)` or `(non-blocking)` | Process / Task | Missing changelog, uncommitted generated schema/migration, broken CI task. |
| `**praise**` | None | Evidence-backed recognition | Exceptionally clean refactoring, thorough deterministic tests, or clever architectural boundary. |

---

## 3. Strict Quality Guidelines (Zero AI Fluff)

To avoid superficial, low-value, or annoying AI comments:

1. **No Vague Criticisms**:
   - ❌ *"This code is confusing and could be improved."*
   - ✅ *"**suggestion (readability)**: Extract the nested ternary into a dedicated status resolver function. Deeply nested ternaries in JSX make null states hard to follow."*
2. **Always Provide the "Why"**:
   - ❌ *"Please use `useMemo` here."*
   - ✅ *"**suggestion (performance)**: Wrap `filteredCatalog` in `useMemo`. When the parent component re-renders on keystroke, re-filtering an array of 5,000 items on the main thread causes UI frame drops."*
3. **No Patronizing or Generic AI Praise**:
   - ❌ *"Great job implementing this feature! The code looks wonderful and well thought out!"*
   - ❌ *"LGTM! Clean code!"*
   - ✅ Only praise specific, observable engineering achievements:
     - `**praise**: Adding isolated unit tests for the leap-year edge cases in date calculation is great attention to detail.`
4. **Concrete, Runnable Code Suggestions**:
   Always provide the exact code diff. Do not leave the author guessing:
   ```markdown
   **issue (blocking)**: Unhandled promise rejection if S3 upload fails.
   - **Why**: An unhandled rejection in this route handler terminates the Node process on unhandledRejection events.
   - **Suggested Fix**:
   ```typescript
   try {
     await s3Client.send(command);
   } catch (error) {
     logger.error({ error, fileKey }, 'Failed to upload asset to S3');
     throw new FileStorageError('S3 upload failed', { cause: error });
   }
   ```
   ```

---

## 4. PR/MR Batching Template

When running in `--mode pr-comments`, format the output so it can be pasted directly into GitHub or GitLab review windows:

````markdown
### 📝 PR Review Comments Summary

**Target:** `feature/user-auth` -> `main`
**Verdict:** 🔴 Changes Requested (1 blocking issue, 2 suggestions)

---

#### 📍 `src/services/auth.ts:L45`
**issue (blocking)**: Insecure password comparison vulnerable to timing attacks.
- **Why**: Using standard string comparison `===` leaks character timing information.
- **Suggested Fix**:
```typescript
import { timingSafeEqual } from 'crypto';

// Replace:
if (storedHash === providedHash)

// With:
const storedBuffer = Buffer.from(storedHash, 'hex');
const providedBuffer = Buffer.from(providedHash, 'hex');
if (storedBuffer.length === providedBuffer.length && timingSafeEqual(storedBuffer, providedBuffer))
```

---

#### 📍 `src/controllers/userController.ts:L112`
**suggestion (readability)**: Consolidate duplicate permission checks into route middleware.
- **Why**: The same `canManageUser(req.user, targetId)` check is duplicated in 4 handler methods.
- **Suggested Fix**: Extract to `verifyUserManagementAccess` express middleware.

---

#### 📍 `tests/auth.test.ts:L30`
**praise**: High-value test case explicitly asserting timing-safe hash failure on mismatched buffer lengths.
````
