// tailwind.config.mjs

export default {
	content: ["**/*.css", "**/*.html", "**/*.hbs", "!node_modules"],
	theme: {
		extend: {
			fontFamily: {
				icons: ["MWF-FLUENT-ICONS"],
				"caslon-regular": ["ACaslonPro-Regular", "serif"],
				"caslon-semibold": ["ACaslonPro-Semibold", "serif"],
				"caslon-bold": ["ACaslonPro-Bold", "serif"],
				"bodoni-regular": ["LibreBodoni-Regular", "serif"],
				"bodoni-medium": ["LibreBodoni-Medium", "serif"],
			},
			fontSize: {
				"7xl": "5.75rem",
				"6xl": "4.6rem",
				"5xl": "3.45rem",
				"4xl": "2.875rem",
				"3xl": "2.3rem",
				"2xl": "1.725rem",
				xl: "1.4375rem",
				lg: "1.15rem",
				base: "1.00625rem",
				sm: "0.8625rem",
				xs: "0.71875rem",
			},
			colors: {
				"rose-100": "#ffebec",
				"rose-1000": "#370311",
			},
		},
		//screens: breakpoints,
	},

	plugins: [require("tailwind-scrollbar"), require("@tailwindcss/container-queries")],
};
