import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
	...tseslint.configs.recommended,
	{
		files: ["**/*.{js,ts,jsx,tsx}"],
		rules: {
			"no-console": "warn",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
			"@next/next/no-img-element": "error",
			"react/jsx-no-leaked-render": [
				"error",
				{ validStrategies: ["ternary", "coerce"] },
			],
		},
	},
]);

export default eslintConfig;
