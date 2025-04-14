✅ 1. Clone the repo (if you haven't yet)
bash
Copy
Edit
git clone https://github.com/fp-ts/fp-ts.git
cd fp-ts
✅ 2. Install dependencies
The project uses pnpm (not npm/yarn):

bash
Copy
Edit
pnpm install
If pnpm is not installed:

bash
Copy
Edit
npm install -g pnpm
✅ 3. Run all unit tests
bash
Copy
Edit
pnpm test
This runs vitest with the config in vitest.config.ts.

✅ 4. Run a single test file
You can run an individual test like this:

bash
Copy
Edit
pnpm vitest run test/Option.ts
Or use --ui for interactive mode:

bash
Copy
Edit
pnpm vitest --ui