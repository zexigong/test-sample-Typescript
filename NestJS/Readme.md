## 🔗 GitHub Repo:
https://github.com/nestjs/nest

### 📦 Setup Instructions:
```bash
git clone https://github.com/nestjs/nest.git
cd nest
npm install
```
No build step needed — the repo is in TypeScript, but test files are run via Jest.

### 🧪 Run All Tests:
```bash
npm run test
```

### 🧪 Run a Specific Test File:
#### step 1

```bash
npm install --save-dev jest ts-jest @types/jest
```
#### step 2
✅ Step 2: Create or Update jest.config.js in packages/core/
NestJS repo doesn’t provide working per-package test configs out of the box, so we create one locally.

📄 packages/core/jest.config.js:

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['reflect-metadata'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
};
```

#### step 3
✅ Step 3: Add node to tsconfig.json's types
Make sure your tsconfig.json in packages/core/ includes:

```json
{
  "compilerOptions": {
    ...
    "types": ["jest", "node"]
  }
}
```
Now TypeScript and Jest will understand both:

Jest globals (describe, it, expect)

Node core modules (crypto, fs, path, etc.)

#### step 4 - run test
```bash
npx jest test/injector/compiler.spec.ts --config jest.config.js
```
Test files are located in /packages/**/ and follow .spec.ts naming.

#### other dependencies
npm install reflect-metadata

