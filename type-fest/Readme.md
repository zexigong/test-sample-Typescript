✅ 2. Install dependencies using pnpm
The project uses pnpm:

bash
Copy
Edit
pnpm install
If pnpm is not installed:

bash
Copy
Edit
npm install -g pnpm
✅ 3. Run all type tests
bash
Copy
Edit
pnpm test
This runs:

json
Copy
Edit
"test": "tsd"
Which validates all test files in the test-d/ directory.

✅ 4. Run a specific test file
Use the tsd CLI directly (requires tsd to be installed):

bash
Copy
Edit
pnpm exec tsd --test test-d/readonly-deep.ts
Replace the file name with any other file in test-d/ if needed.