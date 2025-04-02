## 🔗 GitHub Repo:
https://github.com/vercel/next.js

### 📦 Setup Instructions:
```bash
git clone https://github.com/vercel/next.js.git
cd next.js
pnpm install
pnpm build
```
🔧 pnpm is required — Next.js uses pnpm workspaces heavily.

### 🧪 Run All Tests:
```bash
pnpm test
```
Or use:

```bash
pnpm turbo run test
```
Tests are distributed across packages/next/ and test/.

### 🧪 Run a Specific Test:
```bash
pnpm jest packages/next/src/server/lib/find-page-file.test.ts
```

### For my windows
use "$env:APPDATA\npm\pnpm.cmd" instead of pnpm