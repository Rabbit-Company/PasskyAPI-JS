import Errors, { Error } from "./errors";
import type {
	AccountAddYubiKeyResponse,
	AccountEnable2FaResponse,
	AccountImportPasswords,
	AccountPasswordsResponse,
	AccountRemoveYubiKeyResponse,
	AccountTokenResponse,
	AccountUpgradeResponse,
	Password,
	PasswordData,
	ServerInfoResponse,
	ServerReportResponse,
	ServerStatsResponse,
	StandardResponse,
} from "./types";
import Validate from "./validate";
import Blake2b from "@rabbit-company/blake2b";
import Argon2id from "@rabbit-company/argon2id";
import XChaCha20 from "@rabbit-company/xchacha20";

/**
 * Class for interacting with the Passky API.
 *
 * This class provides functions for managing accounts, passwords, and settings
 * via HTTP requests to the Passky server.
 */
class PasskyAPI {
	server: string;
	username: string;
	password: string;
	token: string | null = null;
	authenticationHash: string | null = null;
	encryptionHash: string | null = null;

	/**
	 * Creates an instance of PasskyAPI.
	 *
	 * @constructor
	 * @param {string} server - The URL of the server to connect to.
	 * @param {string} username - The username for authentication.
	 * @param {string} password - The master password for authentication.
	 */
	constructor(server: string, username: string, password: string) {
		this.server = server;
		this.username = username;
		this.password = password;
	}

	static async generateAuthenticationHash(username: string, password: string): Promise<string | null> {
		const authHash = Blake2b.hash(`passky2020-${password}-${username}`);
		const authSalt = Blake2b.hash(`passky2020-${username}`);

		try {
			return await Argon2id.hash(authHash, authSalt, 4, 16, 3, 64);
		} catch {
			return null;
		}
	}

	async generateAuthenticationHash(): Promise<string | null> {
		this.authenticationHash = await PasskyAPI.generateAuthenticationHash(this.username, this.password);
		return this.authenticationHash;
	}

	static async generateEncryptionHash(username: string, password: string): Promise<string | null> {
		const encHash = Blake2b.hash(`${username}-${password}-passky2020`);
		const encSalt = Blake2b.hash(`${username}-passky2020`);

		try {
			return await Argon2id.hash(encHash, encSalt, 4, 16, 3, 64);
		} catch {
			return null;
		}
	}

	async generateEncryptionHash(): Promise<string | null> {
		this.encryptionHash = await PasskyAPI.generateEncryptionHash(this.username, this.password);
		return this.encryptionHash;
	}

	static async getInfo(server: string): Promise<ServerInfoResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);

		try {
			const result = await fetch(server + "?action=getInfo");

			const response: ServerInfoResponse = await result.json();
			if (Validate.response(response)) return response;

			return Errors.getJson(Error.UNKNOWN_ERROR);
		} catch (err) {
			return Errors.getJson(err instanceof SyntaxError ? Error.INVALID_RESPONSE_FORMAT : Error.SERVER_UNREACHABLE);
		}
	}

	static async getStats(server: string): Promise<ServerStatsResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);

		try {
			const result = await fetch(server + "?action=getStats");

			const response: ServerStatsResponse = await result.json();
			if (Validate.response(response)) return response;

			return Errors.getJson(Error.UNKNOWN_ERROR);
		} catch (err) {
			return Errors.getJson(err instanceof SyntaxError ? Error.INVALID_RESPONSE_FORMAT : Error.SERVER_UNREACHABLE);
		}
	}

	static async getReport(server: string): Promise<ServerReportResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);

		try {
			const result = await fetch(server + "?action=getReport");

			const response: ServerReportResponse = await result.json();
			if (Validate.response(response)) return response;

			return Errors.getJson(Error.UNKNOWN_ERROR);
		} catch (err) {
			return Errors.getJson(err instanceof SyntaxError ? Error.INVALID_RESPONSE_FORMAT : Error.SERVER_UNREACHABLE);
		}
	}

	static async createAccount(server: string, username: string, authenticationHash: string, email: string): Promise<StandardResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.email(email)) return Errors.getJson(Error.INVALID_EMAIL);
		if (!Validate.username(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
		if (!Validate.hash(authenticationHash)) return Errors.getJson(Error.INVALID_HASH);

		try {
			const data = new FormData();
			data.append("email", email);

			const headers = new Headers();
			headers.append("Authorization", "Basic " + btoa(username + ":" + authenticationHash));

			const result = await fetch(server + "?action=createAccount", {
				method: "POST",
				headers: headers,
				body: data,
			});

			const response: StandardResponse = await result.json();
			if (Validate.response(response)) return response;

			return Errors.getJson(Error.UNKNOWN_ERROR);
		} catch (err) {
			return Errors.getJson(err instanceof SyntaxError ? Error.INVALID_RESPONSE_FORMAT : Error.SERVER_UNREACHABLE);
		}
	}

	static async getToken(server: string, username: string, authenticationHash: string, otp: string = ""): Promise<AccountTokenResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.username(username)) return Errors.getJson(Error.INVALID_USERNAME);
		if (!Validate.hash(authenticationHash)) return Errors.getJson(Error.INVALID_HASH);
		if (!Validate.otp(otp)) return Errors.getJson(Error.INVALID_OTP);

		try {
			const data = new FormData();
			data.append("otp", otp);

			const headers = new Headers();
			headers.append("Authorization", "Basic " + btoa(username + ":" + authenticationHash));

			const result = await fetch(server + "?action=getToken", {
				method: "POST",
				headers: headers,
				body: data,
			});

			const response: AccountTokenResponse = await result.json();
			if (Validate.response(response)) return response;

			return Errors.getJson(Error.UNKNOWN_ERROR);
		} catch (err) {
			return Errors.getJson(err instanceof SyntaxError ? Error.INVALID_RESPONSE_FORMAT : Error.SERVER_UNREACHABLE);
		}
	}

	async getToken(otp: string = ""): Promise<AccountTokenResponse> {
		if (!this.authenticationHash) return Errors.getJson(Error.INVALID_HASH);
		const res = await PasskyAPI.getToken(this.server, this.username, this.authenticationHash, otp);
		if (!res.error) this.token = res.token;
		return res;
	}

	static async getPasswords(server: string, username: string, token: string): Promise<AccountPasswordsResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.username(username)) return Errors.getJson(Error.INVALID_USERNAME);
		if (!Validate.token(token)) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);

		try {
			const headers = new Headers();
			headers.append("Authorization", "Basic " + btoa(username + ":" + token));

			const result = await fetch(server + "?action=getPasswords", {
				method: "POST",
				headers: headers,
			});

			const response: AccountPasswordsResponse = await result.json();
			if (Validate.response(response)) return response;

			return Errors.getJson(Error.UNKNOWN_ERROR);
		} catch (err) {
			return Errors.getJson(err instanceof SyntaxError ? Error.INVALID_RESPONSE_FORMAT : Error.SERVER_UNREACHABLE);
		}
	}

	async getPasswords(): Promise<AccountPasswordsResponse> {
		if (!this.token) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		return await PasskyAPI.getPasswords(this.server, this.username, this.token);
	}

	static async savePassword(server: string, username: string, token: string, encryptionHash: string, passwordData: PasswordData): Promise<StandardResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.username(username)) return Errors.getJson(Error.INVALID_USERNAME);
		if (!Validate.token(token)) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		if (!Validate.hash(encryptionHash)) return Errors.getJson(Error.INVALID_HASH);

		if (!Validate.passwordWebsite(passwordData.website)) return Errors.getJson(Error.WEBSITE_TOO_LONG);
		if (!Validate.passwordUsername(passwordData.username)) return Errors.getJson(Error.USERNAME_TOO_LONG);
		if (!Validate.passwordPassword(passwordData.password)) return Errors.getJson(Error.PASSWORD_TOO_LONG);
		if (!Validate.passwordMessage(passwordData.message)) return Errors.getJson(Error.MESSAGE_TOO_LONG);

		passwordData.website = XChaCha20.encrypt(passwordData.website, encryptionHash);
		passwordData.username = XChaCha20.encrypt(passwordData.username, encryptionHash);
		passwordData.password = XChaCha20.encrypt(passwordData.password, encryptionHash);
		passwordData.message = XChaCha20.encrypt(passwordData.message, encryptionHash);

		if (passwordData.website.length > 255) return Errors.getJson(Error.WEBSITE_TOO_LONG);
		if (passwordData.username.length > 255) return Errors.getJson(Error.USERNAME_TOO_LONG);
		if (passwordData.password.length > 255) return Errors.getJson(Error.PASSWORD_TOO_LONG);
		if (passwordData.message.length > 10000) return Errors.getJson(Error.MESSAGE_TOO_LONG);

		try {
			const data = new FormData();
			data.append("website", passwordData.website);
			data.append("username", passwordData.username);
			data.append("password", passwordData.password);
			data.append("message", passwordData.message);

			const headers = new Headers();
			headers.append("Authorization", "Basic " + btoa(username + ":" + token));

			const result = await fetch(server + "?action=savePassword", {
				method: "POST",
				headers: headers,
				body: data,
			});

			const response: StandardResponse = await result.json();
			if (Validate.response(response)) return response;

			return Errors.getJson(Error.UNKNOWN_ERROR);
		} catch (err) {
			return Errors.getJson(err instanceof SyntaxError ? Error.INVALID_RESPONSE_FORMAT : Error.SERVER_UNREACHABLE);
		}
	}

	async savePassword(passwordData: PasswordData): Promise<StandardResponse> {
		if (!this.token) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		if (!this.encryptionHash) return Errors.getJson(Error.INVALID_HASH);
		return await PasskyAPI.savePassword(this.server, this.username, this.token, this.encryptionHash, passwordData);
	}

	static async editPassword(server: string, username: string, token: string, encryptionHash: string, passwordData: Password): Promise<StandardResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.username(username)) return Errors.getJson(Error.INVALID_USERNAME);
		if (!Validate.token(token)) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		if (!Validate.hash(encryptionHash)) return Errors.getJson(Error.INVALID_HASH);

		if (!Validate.positiveInteger(passwordData.id)) return Errors.getJson(Error.PASSWORD_NOT_OWNED_BY_USER);
		if (!Validate.passwordWebsite(passwordData.website)) return Errors.getJson(Error.WEBSITE_TOO_LONG);
		if (!Validate.passwordUsername(passwordData.username)) return Errors.getJson(Error.USERNAME_TOO_LONG);
		if (!Validate.passwordPassword(passwordData.password)) return Errors.getJson(Error.PASSWORD_TOO_LONG);
		if (!Validate.passwordMessage(passwordData.message)) return Errors.getJson(Error.MESSAGE_TOO_LONG);

		passwordData.website = XChaCha20.encrypt(passwordData.website, encryptionHash);
		passwordData.username = XChaCha20.encrypt(passwordData.username, encryptionHash);
		passwordData.password = XChaCha20.encrypt(passwordData.password, encryptionHash);
		passwordData.message = XChaCha20.encrypt(passwordData.message, encryptionHash);

		if (passwordData.website.length > 255) return Errors.getJson(Error.WEBSITE_TOO_LONG);
		if (passwordData.username.length > 255) return Errors.getJson(Error.USERNAME_TOO_LONG);
		if (passwordData.password.length > 255) return Errors.getJson(Error.PASSWORD_TOO_LONG);
		if (passwordData.message.length > 10000) return Errors.getJson(Error.MESSAGE_TOO_LONG);

		try {
			const data = new FormData();
			data.append("password_id", passwordData.id.toString());
			data.append("website", passwordData.website);
			data.append("username", passwordData.username);
			data.append("password", passwordData.password);
			data.append("message", passwordData.message);

			const headers = new Headers();
			headers.append("Authorization", "Basic " + btoa(username + ":" + token));

			const result = await fetch(server + "?action=editPassword", {
				method: "POST",
				headers: headers,
				body: data,
			});

			const response: StandardResponse = await result.json();
			if (Validate.response(response)) return response;

			return Errors.getJson(Error.UNKNOWN_ERROR);
		} catch (err) {
			return Errors.getJson(err instanceof SyntaxError ? Error.INVALID_RESPONSE_FORMAT : Error.SERVER_UNREACHABLE);
		}
	}

	async editPassword(passwordData: Password): Promise<StandardResponse> {
		if (!this.token) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		if (!this.encryptionHash) return Errors.getJson(Error.INVALID_HASH);
		return await PasskyAPI.editPassword(this.server, this.username, this.token, this.encryptionHash, passwordData);
	}

	static async deletePassword(server: string, username: string, token: string, passwordID: string | number) {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.username(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
		if (!Validate.token(token)) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		if (!Validate.positiveInteger(passwordID)) return Errors.getJson(Error.PASSWORD_NOT_OWNED_BY_USER);

		try {
			const headers = new Headers();
			headers.append("Authorization", "Basic " + btoa(username + ":" + token));

			const data = new FormData();
			data.append("password_id", passwordID.toString());

			const result = await fetch(server + "?action=deletePassword", {
				method: "POST",
				headers: headers,
				body: data,
			});

			const response: StandardResponse = await result.json();
			if (Validate.response(response)) return response;

			return Errors.getJson(Error.UNKNOWN_ERROR);
		} catch (err) {
			return Errors.getJson(err instanceof SyntaxError ? Error.INVALID_RESPONSE_FORMAT : Error.SERVER_UNREACHABLE);
		}
	}

	async deletePassword(passwordID: string | number): Promise<StandardResponse> {
		if (!this.token) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		return await PasskyAPI.deletePassword(this.server, this.username, this.token, passwordID);
	}

	static async deletePasswords(server: string, username: string, token: string) {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.username(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
		if (!Validate.token(token)) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);

		try {
			const headers = new Headers();
			headers.append("Authorization", "Basic " + btoa(username + ":" + token));

			const result = await fetch(server + "?action=deletePasswords", {
				method: "POST",
				headers: headers,
			});

			const response: StandardResponse = await result.json();
			if (Validate.response(response)) return response;

			return Errors.getJson(Error.UNKNOWN_ERROR);
		} catch (err) {
			return Errors.getJson(err instanceof SyntaxError ? Error.INVALID_RESPONSE_FORMAT : Error.SERVER_UNREACHABLE);
		}
	}

	async deletePasswords(): Promise<StandardResponse> {
		if (!this.token) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		return await PasskyAPI.deletePasswords(this.server, this.username, this.token);
	}

	static async deleteAccount(server: string, username: string, token: string) {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.username(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
		if (!Validate.token(token)) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);

		try {
			const headers = new Headers();
			headers.append("Authorization", "Basic " + btoa(username + ":" + token));

			const result = await fetch(server + "?action=deleteAccount", {
				method: "POST",
				headers: headers,
			});

			const response: StandardResponse = await result.json();
			if (Validate.response(response)) return response;

			return Errors.getJson(Error.UNKNOWN_ERROR);
		} catch (err) {
			return Errors.getJson(err instanceof SyntaxError ? Error.INVALID_RESPONSE_FORMAT : Error.SERVER_UNREACHABLE);
		}
	}

	async deleteAccount(): Promise<StandardResponse> {
		if (!this.token) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		return await PasskyAPI.deleteAccount(this.server, this.username, this.token);
	}

	static async enable2FA(server: string, username: string, token: string) {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.username(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
		if (!Validate.token(token)) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);

		try {
			const headers = new Headers();
			headers.append("Authorization", "Basic " + btoa(username + ":" + token));

			const result = await fetch(server + "?action=enable2fa", {
				method: "POST",
				headers: headers,
			});

			const response: AccountEnable2FaResponse = await result.json();
			if (Validate.response(response)) return response;

			return Errors.getJson(Error.UNKNOWN_ERROR);
		} catch (err) {
			return Errors.getJson(err instanceof SyntaxError ? Error.INVALID_RESPONSE_FORMAT : Error.SERVER_UNREACHABLE);
		}
	}

	static async disable2FA(server: string, username: string, token: string) {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.username(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
		if (!Validate.token(token)) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);

		try {
			const headers = new Headers();
			headers.append("Authorization", "Basic " + btoa(username + ":" + token));

			const result = await fetch(server + "?action=disable2fa", {
				method: "POST",
				headers: headers,
			});

			const response: StandardResponse = await result.json();
			if (Validate.response(response)) return response;

			return Errors.getJson(Error.UNKNOWN_ERROR);
		} catch (err) {
			return Errors.getJson(err instanceof SyntaxError ? Error.INVALID_RESPONSE_FORMAT : Error.SERVER_UNREACHABLE);
		}
	}

	static async addYubiKey(server: string, username: string, token: string, yubiKeyOTP: string) {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.username(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
		if (!Validate.token(token)) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		if (!Validate.yubiKey(yubiKeyOTP)) return Errors.getJson(Error.INVALID_YUBIKEY_OTP);

		try {
			const headers = new Headers();
			headers.append("Authorization", "Basic " + btoa(username + ":" + token));

			const data = new FormData();
			data.append("id", yubiKeyOTP);

			const result = await fetch(server + "?action=addYubiKey", {
				method: "POST",
				headers: headers,
				body: data,
			});

			const response: AccountAddYubiKeyResponse = await result.json();
			if (Validate.response(response)) return response;

			return Errors.getJson(Error.UNKNOWN_ERROR);
		} catch (err) {
			return Errors.getJson(err instanceof SyntaxError ? Error.INVALID_RESPONSE_FORMAT : Error.SERVER_UNREACHABLE);
		}
	}

	static async removeYubiKey(server: string, username: string, token: string, yubiKeyOTP: string) {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.username(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
		if (!Validate.token(token)) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		if (!Validate.yubiKey(yubiKeyOTP)) return Errors.getJson(Error.INVALID_YUBIKEY_OTP);

		try {
			const headers = new Headers();
			headers.append("Authorization", "Basic " + btoa(username + ":" + token));

			const data = new FormData();
			data.append("id", yubiKeyOTP);

			const result = await fetch(server + "?action=removeYubiKey", {
				method: "POST",
				headers: headers,
				body: data,
			});

			const response: AccountRemoveYubiKeyResponse = await result.json();
			if (Validate.response(response)) return response;

			return Errors.getJson(Error.UNKNOWN_ERROR);
		} catch (err) {
			return Errors.getJson(err instanceof SyntaxError ? Error.INVALID_RESPONSE_FORMAT : Error.SERVER_UNREACHABLE);
		}
	}

	static async forgotUsername(server: string, email: string) {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.email(email)) return Errors.getJson(Error.INVALID_EMAIL);

		try {
			const data = new FormData();
			data.append("email", email);

			const result = await fetch(server + "?action=forgotUsername", {
				method: "POST",
				body: data,
			});

			const response: StandardResponse = await result.json();
			if (Validate.response(response)) return response;

			return Errors.getJson(Error.UNKNOWN_ERROR);
		} catch (err) {
			return Errors.getJson(err instanceof SyntaxError ? Error.INVALID_RESPONSE_FORMAT : Error.SERVER_UNREACHABLE);
		}
	}

	static async upgradeAccount(server: string, username: string, token: string, license: string) {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.username(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
		if (!Validate.token(token)) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		if (!Validate.license(license)) return Errors.getJson(Error.INVALID_LICENSE_KEY);

		try {
			const headers = new Headers();
			headers.append("Authorization", "Basic " + btoa(username + ":" + token));

			const data = new FormData();
			data.append("license", license);

			const result = await fetch(server + "?action=upgradeAccount", {
				method: "POST",
				headers: headers,
				body: data,
			});

			const response: AccountUpgradeResponse = await result.json();
			if (Validate.response(response)) return response;

			return Errors.getJson(Error.UNKNOWN_ERROR);
		} catch (err) {
			return Errors.getJson(err instanceof SyntaxError ? Error.INVALID_RESPONSE_FORMAT : Error.SERVER_UNREACHABLE);
		}
	}

	static async importPasswords(
		server: string,
		username: string,
		token: string,
		encryptionHash: string,
		passwords: PasswordData[]
	): Promise<AccountImportPasswords> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.username(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
		if (!Validate.token(token)) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		if (!Validate.hash(encryptionHash)) return Errors.getJson(Error.INVALID_HASH);

		passwords.forEach((passwordData) => {
			passwordData.website = XChaCha20.encrypt(passwordData.website, encryptionHash);
			passwordData.username = XChaCha20.encrypt(passwordData.username, encryptionHash);
			passwordData.password = XChaCha20.encrypt(passwordData.password, encryptionHash);
			passwordData.message = XChaCha20.encrypt(passwordData.message, encryptionHash);
		});

		const importPasswords: PasswordData[] = [];

		passwords.forEach((passwordData) => {
			if (passwordData.website.length > 255) return;
			if (passwordData.username.length > 255) return;
			if (passwordData.password.length > 255) return;
			if (passwordData.message.length > 10000) return;

			importPasswords.push(passwordData);
		});

		if (importPasswords.length === 0) return { error: 0, info: "success", import_success: 0, import_error: passwords.length };

		try {
			const headers = new Headers();
			headers.append("Authorization", "Basic " + btoa(username + ":" + token));
			headers.append("Content-Type", "application/json");

			const data = JSON.stringify(importPasswords);

			const result = await fetch(server + "?action=importPasswords", {
				method: "POST",
				headers: headers,
				body: data,
			});

			const response: AccountImportPasswords = await result.json();
			if (Validate.response(response)) return response;

			return Errors.getJson(Error.UNKNOWN_ERROR);
		} catch (err) {
			return Errors.getJson(err instanceof SyntaxError ? Error.INVALID_RESPONSE_FORMAT : Error.SERVER_UNREACHABLE);
		}
	}
}

export type {
	AccountAddYubiKeyResponse,
	AccountEnable2FaResponse,
	AccountPasswordsResponse,
	AccountRemoveYubiKeyResponse,
	AccountTokenResponse,
	AccountUpgradeResponse,
	ServerInfoResponse,
	ServerReportResponse,
	ServerStatsResponse,
	StandardResponse,
};

export { PasskyAPI, XChaCha20, Error, Errors, Validate };
