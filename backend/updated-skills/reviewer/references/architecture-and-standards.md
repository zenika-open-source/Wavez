# Architecture, Clean Code & Quality Standards Reference

This reference outlines architectural principles, design patterns, testing standards, and language-specific quality rules checked during code review.

---

## 1. Core Architectural & Clean Code Principles

### The SOLID Principles
- **Single Responsibility Principle (SRP)**:
  - A class, module, or function should have only one reason to change.
  - Break down monster functions (>20 lines) and giant UI components (>300-500 lines) into focused subroutines or composable child components.
- **Open/Closed Principle (OCP)**:
  - Software entities should be open for extension, but closed for modification.
  - Prefer strategy patterns, plugin hooks, or lookup maps over growing chains of `if-else` or giant `switch` statements.
- **Liskov Substitution Principle (LSP)**:
  - Subtypes must be substitutable for their base types without altering correctness.
- **Interface Segregation Principle (ISP)**:
  - Clients should not be forced to depend on methods they do not use. Prefer small, focused interfaces over monolithic contract types.
- **Dependency Inversion Principle (DIP)**:
  - High-level modules should not depend on low-level modules; both should depend on abstractions. Prefer dependency injection for data access and external API clients.

### Layering & Separation of Concerns
- **UI Layer**: Handles view rendering, user input capture, and accessible markup. Should contain zero database queries, raw network orchestration, or business calculations.
- **Service / Domain Layer**: Contains pure business rules, validation logic, calculation models, and state transitions. Free of UI framework dependencies.
- **Data / Infrastructure Layer**: Encapsulates ORM queries, database connections, cloud storage calls, and external REST/gRPC clients.

---

## 2. Language-Specific Quality Standards

### TypeScript & JavaScript
- **Strict Typing (Zero `any`)**:
  - Never allow `any` in production code. Use `unknown` with type guards, generics, or explicit interfaces.
  - Use `type` for unions, intersections, and primitives; use `interface` for object structures and public API contracts.
- **Exhaustive Type Checks**:
  - For discriminated unions, use `never` in default branches to enforce compile-time exhaustiveness:
    ```typescript
    default: {
      const _exhaustiveCheck: never = action;
      throw new Error(`Unhandled action: ${_exhaustiveCheck}`);
    }
    ```
- **Immutability & Const Assertions**:
  - Use `as const` on static lookup tables, status codes, and configuration arrays.
  - Avoid mutating function parameter objects; return new cloned objects or tuples.
- **Logging Hygiene**:
  - Prohibit `console.log`, `console.error`, and `debugger` in production code. Use the project's structured logger (e.g. Pino, Winston).

### Python
- **Type Annotations**:
  - All public function arguments and return types must be explicitly typed (`def process(user_id: UUID) -> UserResponse:`).
- **Resource Management**:
  - File handles, network sessions, and database connections must use context managers (`with` / `async with`).
- **Data Structures**:
  - Use Pydantic models or dataclasses for structured data instead of unstructured dictionaries (`dict[str, Any]`).
- **Error Handling**:
  - Catch specific exceptions (`ValueError`, `HTTPException`) rather than bare `except:`.

---

## 3. Performance & Resource Safety

- **N+1 Query Detection**:
  - Watch for database queries or API requests executed inside loops:
    ```typescript
    // ❌ Anti-pattern: N+1
    for (const project of projects) {
      project.owner = await fetchUser(project.ownerId);
    }

    // ✅ Batched pattern:
    const ownerIds = projects.map(p => p.ownerId);
    const users = await fetchUsersByIds(ownerIds);
    ```
- **Unbounded Memory & Collections**:
  - Ensure database queries include explicit limits and pagination (`limit: 50, skip: 0`).
  - Flag large in-memory array filtering on client devices; prefer server-side query filters.
- **Unmounted Lifecycles & Event Listeners**:
  - In React/Vue/Node, ensure `useEffect` cleanup functions remove event listeners, abort `AbortController` fetch requests, and clear `setInterval`/`setTimeout`.

---

## 4. Testing Rules & Determinism

*(Derived from repository testing governance)*

- **AAA Structure**: Every test must clearly follow Arrange → Act → Assert.
- **Deterministic Test Data**:
  - Use fixed mock identifiers: `'11111111-1111-1111-1111-111111111111'`, `'user-test-001'`.
  - Use fixed UTC dates: `new Date('2024-01-01T00:00:00Z')`.
  - 🛑 **Forbidden in Test Data**: `Date.now()`, `Math.random()`, or random `uuid.v4()`. Non-deterministic test data causes flaky CI builds.
- **Mock Boundaries Correctly**:
  - Mock external dependencies (HTTP calls, DB pools, file systems).
  - Never mock the unit under test.
- **Observable Behavior**:
  - Assert public return values, state changes, and thrown domain exceptions. Never test private implementation details.
