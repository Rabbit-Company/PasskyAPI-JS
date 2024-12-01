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
import type { AccountEnable2FaResponse, AccountImportPasswords, Password, PasswordData } from "../src/types";
import PasswordGenerator from "@rabbit-company/password-generator";

const server = "http://localhost:8080";
const username = PasswordGenerator.generate(10, false, true, false);
const password = PasswordGenerator.generate(30);
const email = "info@passky.org";
const otp = "";

const importPasswords: PasswordData[] = [
	{
		website: "passky.org",
		username: PasswordGenerator.generate(10, false, true, false),
		password: PasswordGenerator.generate(30),
		message: "",
	},
	{
		website: "rabbit-company.com",
		username: PasswordGenerator.generate(20, false, true, false),
		password: PasswordGenerator.generate(40),
		message: "",
	},
	{
		website: "vault.passky.org",
		username: PasswordGenerator.generate(30, false, true, false),
		password: PasswordGenerator.generate(50),
		message: "",
	},
];

const account = new PasskyAPI(server, username, password);

await account.generateAuthenticationHash();
await account.generateEncryptionHash();

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
		const res: StandardResponse = await account.createAccount(email);
		expect([0, 4]).toContain(res.error);
	});

	test("getToken", async () => {
		const res: AccountTokenResponse = await account.getToken(otp);
		expect([0, 8]).toContain(res.error);
	});

	test("savePassword", async () => {
		const passwordData: PasswordData = {
			website: "passky.org",
			username: "test123",
			password: PasswordGenerator.generate(30),
			message: "",
		};
		const res: StandardResponse = await account.savePassword(passwordData);
		expect(res.error).toBe(0);
	});

	test("getPasswords", async () => {
		const res: AccountPasswordsResponse = await account.getPasswords();
		if (res.error === Error.SUCCESS || res.error === Error.NO_SAVED_PASSWORDS) passwords = res.passwords;
		expect([0, 8]).toContain(res.error);
	});

	test("editPassword", async () => {
		const changedPassword = passwords[0];
		changedPassword.password = PasswordGenerator.generate(35);
		const res: StandardResponse = await account.editPassword(changedPassword);
		expect(res.error).toBe(0);
	});

	test("deletePassword", async () => {
		const res: StandardResponse = await account.deletePassword(passwords[0].id);
		expect(res.error).toBe(0);
	});

	test("importPasswords", async () => {
		const res: AccountImportPasswords = await account.importPasswords(importPasswords);
		expect(res.error).toBe(0);
	});

	test("enable2FA", async () => {
		const res: AccountEnable2FaResponse = await account.enable2FA();
		expect(res.error).toBe(0);
	});

	test("disable2FA", async () => {
		const res: StandardResponse = await account.disable2FA();
		expect(res.error).toBe(0);
	});

	test("deletePasswords", async () => {
		const res: StandardResponse = await account.deletePasswords();
		expect(res.error).toBe(0);
	});

	test("deleteAccount", async () => {
		const res: StandardResponse = await account.deleteAccount();
		expect(res.error).toBe(0);
	});
});
