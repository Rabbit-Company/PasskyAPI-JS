import { expect, test, describe } from "bun:test";
import {
	Error,
	PasskyAPI,
	type AccountPasswordsResponse,
	type AccountTokenResponse,
	type ServerInfoResponse,
	type ServerReportResponse,
	type ServerStatsResponse,
	type StandardResponse,
} from "../src/passky-api";
import type { Password, PasswordData } from "../src/types";
import PasswordGenerator from "@rabbit-company/password-generator";

const server = "http://localhost:8080";
const username = "test123";
const password = PasswordGenerator.generate(30);
const email = "info@passky.org";
const otp = "";

const encryptedHash = (await PasskyAPI.generateEncryptionHash(username, password)) || "";
const authenticationHash = (await PasskyAPI.generateAuthenticationHash(username, password)) || "";

let token = "";
let passwords: Password[] = [];

describe("live server", () => {
	test("getInfo", async () => {
		const res: ServerInfoResponse = await PasskyAPI.getInfo(server);
		expect(res.error).toBe(Error.SUCCESS);
	});

	test("getStats", async () => {
		const res: ServerStatsResponse = await PasskyAPI.getStats(server);
		expect(res.error).toBe(Error.SUCCESS);
	});

	test("getReport", async () => {
		const res: ServerReportResponse = await PasskyAPI.getReport(server);
		expect(res.error).toBe(Error.SUCCESS);
	});

	test("createAccount", async () => {
		const res: StandardResponse = await PasskyAPI.createAccount(server, username, authenticationHash, email);
		expect([0, 4]).toContain(res.error);
	});

	test("getToken", async () => {
		const res: AccountTokenResponse = await PasskyAPI.getToken(server, username, authenticationHash, otp);
		if (res.error === Error.SUCCESS || res.error === Error.NO_SAVED_PASSWORDS) token = res.token;
		expect([0, 8]).toContain(res.error);
	});

	test("savePassword", async () => {
		const passwordData: PasswordData = {
			website: "passky.org",
			username: "test123",
			password: PasswordGenerator.generate(30),
			message: "",
		};
		const res: StandardResponse = await PasskyAPI.savePassword(server, username, token, encryptedHash, passwordData);
		expect(res.error).toBe(0);
	});

	test("getPasswords", async () => {
		const res: AccountPasswordsResponse = await PasskyAPI.getPasswords(server, username, token);
		if (res.error === Error.SUCCESS || res.error === Error.NO_SAVED_PASSWORDS) passwords = res.passwords;
		expect([0, 8]).toContain(res.error);
	});

	test("editPassword", async () => {
		const changedPassword = passwords[0];
		changedPassword.password = PasswordGenerator.generate(35);
		const res: StandardResponse = await PasskyAPI.editPassword(server, username, token, encryptedHash, changedPassword);
		expect(res.error).toBe(0);
	});

	test("deletePassword", async () => {
		const res: StandardResponse = await PasskyAPI.deletePassword(server, username, token, passwords[0].id);
		expect(res.error).toBe(0);
	});

	test("deletePasswords", async () => {
		const res: StandardResponse = await PasskyAPI.deletePasswords(server, username, token);
		expect(res.error).toBe(0);
	});

	test("deleteAccount", async () => {
		const res: StandardResponse = await PasskyAPI.deleteAccount(server, username, token);
		expect(res.error).toBe(0);
	});
});
