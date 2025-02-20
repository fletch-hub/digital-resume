export default {
	plugins: {
		"@tailwindcss/postcss": {},
		autoprefixer: {
			overrideBrowserslist: ["last 2 versions", "> 1%", "not dead"],
			grid: true,
		},
	},
};
