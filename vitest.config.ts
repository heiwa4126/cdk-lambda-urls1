import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["test/**/*.test.ts"],
		environment: "node",
		clearMocks: true,
		coverage: {
			enabled: false,
		},
	},
});
