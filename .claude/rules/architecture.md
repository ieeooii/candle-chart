# Architecture Rules

1. **관심사 분리**: 컴포넌트는 UI만, 로직은 hooks, 서버 통신은 api 레이어로 분리한다.
2. **상태관리**: client 상태와 서버 상태를 이원화한다. 서버 상태는 TanStack Query, client 상태는 Jotai를 사용한다. `localStorage`/`sessionStorage`를 사용하지 않는다.
3. **스타일 방식**: vanilla-extract로 통일한다. TailwindCSS나 CSS-in-JS, 별도의 `.css` 파일을 사용하지 않는다.
4. **파일 네이밍**:
   - 컴포넌트: PascalCase
   - hooks: camelCase (`use` prefix)
   - 타입 파일: camelCase
   - TanStack Query hook: `use` prefix + `*Query` / `*SuspenseQuery` / `*Mutation` 등 suffix 유지
5. **단방향 의존**: FSD 패턴 계층 순서에 따라서만 의존한다. 역방향 의존을 금지한다.
