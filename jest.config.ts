import type {Config} from 'jest';

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/src", "<rootDir>/tests"],
	moduleFileExtensions: ["ts", "js", "json"],
	transform: {
		"^.+\\.ts$": "ts-jest"
	},
	collectCoverage: true,
	coverageDirectory: "coverage",
	testMatch: [
		"**/?(*.)+(spec|test).[tj]s"
	]
};

export default config;