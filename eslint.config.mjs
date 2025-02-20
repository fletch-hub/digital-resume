//eslint.config.mjs
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
export default [
	js.configs.recommended,
	eslintConfigPrettier,
	{ ignores: ["**/node_modules/", ".git/", "dist/", "vite.config.mjs"] },
	{
		files: ["**/*.js", "**/*.mjs"],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			globals: {
				...globals.browser,
			},
		},
		rules: {
			"prefer-arrow-callback": ["error", { allowNamedFunctions: false }],
			"func-style": ["error", "expression"],
			"arrow-body-style": ["error", "as-needed"],
			"object-shorthand": ["error", "always"],
			"prefer-const": "error",
			"no-unused-vars": ["warn"],
			"no-console": "warn",
		},
	},
];
