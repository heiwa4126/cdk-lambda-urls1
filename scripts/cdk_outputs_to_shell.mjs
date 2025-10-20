#!/usr/bin/env node
import { existsSync } from "node:fs";
/**
 * Convert CDK outputs.json into a shell-friendly exports file.
 * Usage:
 *   node scripts/cdk_outputs_to_shell.mjs [inputJsonPath] [outputShellPath]
 * Defaults:
 *   input  = var/outputs.json
 *   output = var/outputs.sh
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

function escapeShellSingleQuotes(value) {
	// Wrap in single quotes; escape existing single quotes: ' => '\''
	return `'${String(value).replace(/'/g, "'\\''")}'`;
}

async function main() {
	const inputArg = process.argv[2];
	const outputArg = process.argv[3];
	const inputPath = resolve(process.cwd(), inputArg || "var/outputs.json");
	const outputPath = resolve(process.cwd(), outputArg || "var/outputs.sh");

	if (!existsSync(inputPath)) {
		console.error(`Input JSON not found: ${inputPath}`);
		process.exit(1);
	}

	let jsonRaw;
	try {
		jsonRaw = await readFile(inputPath, "utf8");
	} catch (e) {
		console.error(`Failed to read input: ${e.message}`);
		process.exit(1);
	}

	let data;
	try {
		data = JSON.parse(jsonRaw);
	} catch (e) {
		console.error(`Invalid JSON: ${e.message}`);
		process.exit(1);
	}

	if (typeof data !== "object" || data === null) {
		console.error("Unexpected JSON root structure (expected object).");
		process.exit(1);
	}

	const lines = [];
	lines.push("#!/usr/bin/env bash");
	lines.push("# Auto-generated from CDK outputs.json. Do not edit manually.");
	lines.push("# Source this file:");
	lines.push("#   source var/outputs.sh");
	lines.push("");

	for (const [stackName, outputs] of Object.entries(data)) {
		if (typeof outputs !== "object" || outputs === null) continue;
		for (const [key, value] of Object.entries(outputs)) {
			const varName = `CDK_${stackName}_${key}`.toUpperCase().replace(/[^A-Z0-9_]/g, "_");
			lines.push(`export ${varName}=${escapeShellSingleQuotes(value)}`);
		}
	}

	// (Removed convenience echo line as per request)

	try {
		await writeFile(outputPath, lines.join("\n"), { mode: 0o644 });
	} catch (e) {
		console.error(`Failed to write output: ${e.message}`);
		process.exit(1);
	}

	console.log(`Generated shell exports at: ${outputPath}`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
