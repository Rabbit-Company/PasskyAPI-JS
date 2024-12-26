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

	/**
	 * Generates an authentication hash for a given username and password.
	 *
	 * @static
	 * @param {string} username - The username to generate the hash for.
	 * @param {string} password - The password to generate the hash for.
	 * @returns {Promise<string | null>} A promise resolving to the authentication hash, or null if an error occurs.
	 */
	static async generateAuthenticationHash(username: string, password: string): Promise<string | null> {
		const authHash = Blake2b.hash(`passky2020-${password}-${username}`);
		const authSalt = Blake2b.hash(`passky2020-${username}`);

		try {
			return await Argon2id.hash(authHash, authSalt, 4, 16, 3, 64);
		} catch {
			return null;
		}
	}

	/**
	 * Generates and sets the authentication hash for the current instance.
	 *
	 * @returns {Promise<string | null>} A promise resolving to the generated authentication hash, or null if an error occurs.
	 */
	async generateAuthenticationHash(): Promise<string | null> {
		this.authenticationHash = await PasskyAPI.generateAuthenticationHash(this.username, this.password);
		return this.authenticationHash;
	}

	/**
	 * Generates an encryption hash for a given username and password.
	 *
	 * @static
	 * @param {string} username - The username to generate the hash for.
	 * @param {string} password - The password to generate the hash for.
	 * @returns {Promise<string | null>} A promise resolving to the encryption hash, or null if an error occurs.
	 */
	static async generateEncryptionHash(username: string, password: string): Promise<string | null> {
		const encHash = Blake2b.hash(`${username}-${password}-passky2020`);
		const encSalt = Blake2b.hash(`${username}-passky2020`);

		try {
			return await Argon2id.hash(encHash, encSalt, 4, 16, 3, 64);
		} catch {
			return null;
		}
	}

	/**
	 * Generates and sets the encryption hash for the current instance.
	 *
	 * @returns {Promise<string | null>} A promise resolving to the generated encryption hash, or null if an error occurs.
	 */
	async generateEncryptionHash(): Promise<string | null> {
		this.encryptionHash = await PasskyAPI.generateEncryptionHash(this.username, this.password);
		return this.encryptionHash;
	}

	/**
	 * Decrypts a single encrypted password object using the provided encryption hash.
	 *
	 * @static
	 * @param {Password} passwordData - The encrypted password object.
	 * @param {string} encryptionHash - The encryption hash used to decrypt the password fields.
	 * @returns {Password} The decrypted password object.
	 */
	static decryptPassword(passwordData: Password, encryptionHash: string): Password {
		return {
			id: passwordData.id,
			website: XChaCha20.decrypt(passwordData.website, encryptionHash),
			username: XChaCha20.decrypt(passwordData.username, encryptionHash),
			password: XChaCha20.decrypt(passwordData.password, encryptionHash),
			message: XChaCha20.decrypt(passwordData.message, encryptionHash),
		};
	}

	/**
	 * Decrypts a single encrypted password object using the class's encryption hash.
	 * Returns `null` if the encryption hash is not set.
	 *
	 * @param {Password} passwordData - The encrypted password object to decrypt.
	 * @returns {Password | null} The decrypted password object, or `null` if the encryption hash is not available.
	 */
	decryptPassword(passwordData: Password): Password | null {
		if (!this.encryptionHash) return null;
		return PasskyAPI.decryptPassword(passwordData, this.encryptionHash);
	}

	/**
	 * Decrypts an array of encrypted passwords using the provided encryption hash.
	 *
	 * @static
	 * @param {Password[]} passwords - The array of encrypted password objects.
	 * @param {string} encryptionHash - The encryption hash used to decrypt the password fields.
	 * @returns {Password[]} The array of decrypted password objects.
	 */
	static decryptPasswords(passwords: Password[], encryptionHash: string): Password[] {
		const decryptedPasswords: Password[] = [];

		passwords.forEach((passwordData) => {
			decryptedPasswords.push({
				id: passwordData.id,
				website: XChaCha20.decrypt(passwordData.website, encryptionHash),
				username: XChaCha20.decrypt(passwordData.username, encryptionHash),
				password: XChaCha20.decrypt(passwordData.password, encryptionHash),
				message: XChaCha20.decrypt(passwordData.message, encryptionHash),
			});
		});

		return decryptedPasswords;
	}

	/**
	 * Decrypts an array of encrypted password objects using the class's encryption hash.
	 * Returns `null` if the encryption hash is not set.
	 *
	 * @param {Password[]} passwords - The array of encrypted password objects to decrypt.
	 * @returns {Password[] | null} The array of decrypted password objects, or `null` if the encryption hash is not available.
	 */
	decryptPasswords(passwords: Password[]): Password[] | null {
		if (!this.encryptionHash) return null;
		return PasskyAPI.decryptPasswords(passwords, this.encryptionHash);
	}

	/**
	 * Fetches server information from the specified server URL.
	 *
	 * @static
	 * @param {string} server - The server URL to fetch the information from.
	 * @returns {Promise<ServerInfoResponse>} A promise resolving to the server information response.
	 */
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

	/**
	 * Fetches server statistics from the specified server URL.
	 *
	 * @static
	 * @param {string} server - The server URL to fetch the statistics from.
	 * @returns {Promise<ServerStatsResponse>} A promise resolving to the server statistics response.
	 */
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

	/**
	 * Fetches a server activity report from the specified server URL.
	 *
	 * @static
	 * @param {string} server - The server URL to fetch the report from.
	 * @returns {Promise<ServerReportResponse>} A promise resolving to the server activity report response.
	 */
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

	/**
	 * Creates a new account on the specified server.
	 *
	 * @static
	 * @param {string} server - The server URL where the account should be created.
	 * @param {string} username - The username for the new account.
	 * @param {string} authenticationHash - The hash generated for authentication.
	 * @param {string} email - The email address for the new account.
	 * @returns {Promise<StandardResponse>} A promise resolving to the response of the account creation operation.
	 */
	static async createAccount(server: string, username: string, authenticationHash: string, email: string): Promise<StandardResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.email(email)) return Errors.getJson(Error.INVALID_EMAIL);
		if (!Validate.masterUsername(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
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

	/**
	 * Creates a new account using the current instance's details.
	 *
	 * @param {string} email - The email address for the new account.
	 * @returns {Promise<StandardResponse>} A promise resolving to the response of the account creation operation.
	 */
	async createAccount(email: string): Promise<StandardResponse> {
		if (!this.authenticationHash) return Errors.getJson(Error.INVALID_HASH);
		return await PasskyAPI.createAccount(this.server, this.username, this.authenticationHash, email);
	}

	/**
	 * Fetches an authentication token from the specified server.
	 *
	 * @static
	 * @param {string} server - The server URL to fetch the token from.
	 * @param {string} username - The username for authentication.
	 * @param {string} authenticationHash - The hash generated for authentication.
	 * @param {string} [otp=""] - An optional one-time password (OTP) for 2FA.
	 * @returns {Promise<AccountTokenResponse>} A promise resolving to the token response.
	 */
	static async getToken(server: string, username: string, authenticationHash: string, otp: string = ""): Promise<AccountTokenResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.masterUsername(username)) return Errors.getJson(Error.INVALID_USERNAME);
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

	/**
	 * Fetches and sets an authentication token using the current instance's details.
	 *
	 * @param {string} [otp=""] - An optional one-time password (OTP) for 2FA.
	 * @returns {Promise<AccountTokenResponse>} A promise resolving to the token response.
	 */
	async getToken(otp: string = ""): Promise<AccountTokenResponse> {
		if (!this.authenticationHash) return Errors.getJson(Error.INVALID_HASH);
		const res = await PasskyAPI.getToken(this.server, this.username, this.authenticationHash, otp);
		if (res.error === Error.SUCCESS || res.error === Error.NO_SAVED_PASSWORDS) this.token = res.token;
		return res;
	}

	/**
	 * Fetches the user's passwords from the server.
	 *
	 * @static
	 * @param {string} server - The URL of the server.
	 * @param {string} username - The username for authentication.
	 * @param {string} token - The authentication token.
	 * @returns {Promise<AccountPasswordsResponse>} A promise resolving to the response containing the passwords.
	 */
	static async getPasswords(server: string, username: string, token: string): Promise<AccountPasswordsResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.masterUsername(username)) return Errors.getJson(Error.INVALID_USERNAME);
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

	/**
	 * Fetches the user's passwords using the instance's server, username, and token.
	 *
	 * @returns {Promise<AccountPasswordsResponse>} A promise resolving to the response containing the passwords.
	 */
	async getPasswords(): Promise<AccountPasswordsResponse> {
		if (!this.token) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		return await PasskyAPI.getPasswords(this.server, this.username, this.token);
	}

	/**
	 * Saves a new password to the server.
	 *
	 * @static
	 * @param {string} server - The URL of the server.
	 * @param {string} username - The username for authentication.
	 * @param {string} token - The authentication token.
	 * @param {string} encryptionHash - The hash used for encrypting password data.
	 * @param {PasswordData} passwordData - The password data to save.
	 * @returns {Promise<StandardResponse>} A promise resolving to the response status.
	 */
	static async savePassword(server: string, username: string, token: string, encryptionHash: string, passwordData: PasswordData): Promise<StandardResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.masterUsername(username)) return Errors.getJson(Error.INVALID_USERNAME);
		if (!Validate.token(token)) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		if (!Validate.hash(encryptionHash)) return Errors.getJson(Error.INVALID_HASH);

		if (!Validate.website(passwordData.website)) return Errors.getJson(Error.WEBSITE_TOO_LONG);
		if (!Validate.username(passwordData.username)) return Errors.getJson(Error.USERNAME_TOO_LONG);
		if (!Validate.password(passwordData.password)) return Errors.getJson(Error.PASSWORD_TOO_LONG);
		if (!Validate.message(passwordData.message)) return Errors.getJson(Error.MESSAGE_TOO_LONG);

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

	/**
	 * Saves a new password using the instance's server, username, token, and encryption hash.
	 *
	 * @param {PasswordData} passwordData - The password data to save.
	 * @returns {Promise<StandardResponse>} A promise resolving to the response status.
	 */
	async savePassword(passwordData: PasswordData): Promise<StandardResponse> {
		if (!this.token) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		if (!this.encryptionHash) return Errors.getJson(Error.INVALID_HASH);
		return await PasskyAPI.savePassword(this.server, this.username, this.token, this.encryptionHash, passwordData);
	}

	/**
	 * Edits an existing password on the server.
	 *
	 * @static
	 * @param {string} server - The URL of the server.
	 * @param {string} username - The username for authentication.
	 * @param {string} token - The authentication token.
	 * @param {string} encryptionHash - The hash used for encrypting password data.
	 * @param {Password} passwordData - The updated password data.
	 * @returns {Promise<StandardResponse>} A promise resolving to the response status.
	 */
	static async editPassword(server: string, username: string, token: string, encryptionHash: string, passwordData: Password): Promise<StandardResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.masterUsername(username)) return Errors.getJson(Error.INVALID_USERNAME);
		if (!Validate.token(token)) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		if (!Validate.hash(encryptionHash)) return Errors.getJson(Error.INVALID_HASH);

		if (!Validate.positiveInteger(passwordData.id)) return Errors.getJson(Error.PASSWORD_NOT_OWNED_BY_USER);
		if (!Validate.website(passwordData.website)) return Errors.getJson(Error.WEBSITE_TOO_LONG);
		if (!Validate.username(passwordData.username)) return Errors.getJson(Error.USERNAME_TOO_LONG);
		if (!Validate.password(passwordData.password)) return Errors.getJson(Error.PASSWORD_TOO_LONG);
		if (!Validate.message(passwordData.message)) return Errors.getJson(Error.MESSAGE_TOO_LONG);

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

	/**
	 * Edits an existing password using the instance's server, username, token, and encryption hash.
	 *
	 * @param {Password} passwordData - The updated password data.
	 * @returns {Promise<StandardResponse>} A promise resolving to the response status.
	 */
	async editPassword(passwordData: Password): Promise<StandardResponse> {
		if (!this.token) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		if (!this.encryptionHash) return Errors.getJson(Error.INVALID_HASH);
		return await PasskyAPI.editPassword(this.server, this.username, this.token, this.encryptionHash, passwordData);
	}

	/**
	 * Deletes a specific password from the server.
	 *
	 * @static
	 * @param {string} server - The URL of the server.
	 * @param {string} username - The username for authentication.
	 * @param {string} token - The authentication token.
	 * @param {string | number} passwordID - The ID of the password to delete.
	 * @returns {Promise<StandardResponse>} A promise resolving to the response status.
	 */
	static async deletePassword(server: string, username: string, token: string, passwordID: string | number): Promise<StandardResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.masterUsername(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
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

	/**
	 * Deletes a specific password using the instance's server, username, and token.
	 *
	 * @param {string | number} passwordID - The ID of the password to delete.
	 * @returns {Promise<StandardResponse>} A promise resolving to the response status.
	 */
	async deletePassword(passwordID: string | number): Promise<StandardResponse> {
		if (!this.token) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		return await PasskyAPI.deletePassword(this.server, this.username, this.token, passwordID);
	}

	/**
	 * Deletes all passwords for the user on the server.
	 *
	 * @static
	 * @param {string} server - The URL of the server.
	 * @param {string} username - The username for authentication.
	 * @param {string} token - The authentication token.
	 * @returns {Promise<StandardResponse>} A promise resolving to the response status.
	 */
	static async deletePasswords(server: string, username: string, token: string): Promise<StandardResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.masterUsername(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
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

	/**
	 * Deletes all passwords for the user using the instance's server, username, and token.
	 *
	 * @returns {Promise<StandardResponse>} A promise resolving to the response status.
	 */
	async deletePasswords(): Promise<StandardResponse> {
		if (!this.token) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		return await PasskyAPI.deletePasswords(this.server, this.username, this.token);
	}

	/**
	 * Deletes the user's account from the server.
	 * @param {string} server - The server URL.
	 * @param {string} username - The user's username.
	 * @param {string} token - The user's authentication token.
	 * @returns {Promise<StandardResponse>} - A promise resolving to the server's response.
	 */
	static async deleteAccount(server: string, username: string, token: string): Promise<StandardResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.masterUsername(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
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

	/**
	 * Deletes the current user's account.
	 * @returns {Promise<StandardResponse>} - A promise resolving to the server's response.
	 */
	async deleteAccount(): Promise<StandardResponse> {
		if (!this.token) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		return await PasskyAPI.deleteAccount(this.server, this.username, this.token);
	}

	/**
	 * Enables two-factor authentication for the user's account.
	 * @param {string} server - The server URL.
	 * @param {string} username - The user's username.
	 * @param {string} token - The user's authentication token.
	 * @returns {Promise<AccountEnable2FaResponse>} - A promise resolving to the server's response.
	 */
	static async enable2FA(server: string, username: string, token: string): Promise<AccountEnable2FaResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.masterUsername(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
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

	/**
	 * Enables two-factor authentication for the current user.
	 * @returns {Promise<AccountEnable2FaResponse>} - A promise resolving to the server's response.
	 */
	async enable2FA(): Promise<AccountEnable2FaResponse> {
		if (!this.token) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		return await PasskyAPI.enable2FA(this.server, this.username, this.token);
	}

	/**
	 * Disables two-factor authentication for the user's account.
	 * @param {string} server - The server URL.
	 * @param {string} username - The user's username.
	 * @param {string} token - The user's authentication token.
	 * @returns {Promise<StandardResponse>} - A promise resolving to the server's response.
	 */
	static async disable2FA(server: string, username: string, token: string): Promise<StandardResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.masterUsername(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
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

	/**
	 * Disables two-factor authentication for the current user.
	 * @returns {Promise<StandardResponse>} - A promise resolving to the server's response.
	 */
	async disable2FA(): Promise<StandardResponse> {
		if (!this.token) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		return await PasskyAPI.disable2FA(this.server, this.username, this.token);
	}

	/**
	 * Adds a YubiKey to the user's account.
	 * @param {string} server - The server URL.
	 * @param {string} username - The user's username.
	 * @param {string} token - The user's authentication token.
	 * @param {string} yubiKeyOTP - The one-time password generated by the YubiKey.
	 * @returns {Promise<AccountAddYubiKeyResponse>} - A promise resolving to the server's response.
	 */
	static async addYubiKey(server: string, username: string, token: string, yubiKeyOTP: string): Promise<AccountAddYubiKeyResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.masterUsername(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
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

	/**
	 * Adds a YubiKey to the current user's account.
	 * @param {string} yubiKeyOTP - The one-time password generated by the YubiKey.
	 * @returns {Promise<AccountAddYubiKeyResponse>} - A promise resolving to the server's response.
	 */
	async addYubiKey(yubiKeyOTP: string): Promise<AccountAddYubiKeyResponse> {
		if (!this.token) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		return await PasskyAPI.addYubiKey(this.server, this.username, this.token, yubiKeyOTP);
	}

	/**
	 * Removes a YubiKey from the user's account.
	 * @param {string} server - The server URL.
	 * @param {string} username - The user's username.
	 * @param {string} token - The user's authentication token.
	 * @param {string} yubiKeyOTP - The YubiKey OTP to remove.
	 * @returns {Promise<AccountRemoveYubiKeyResponse>} The response from the server.
	 */
	static async removeYubiKey(server: string, username: string, token: string, yubiKeyOTP: string): Promise<AccountRemoveYubiKeyResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.masterUsername(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
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

	/**
	 * Removes a YubiKey from the current account.
	 * @param {string} yubiKeyOTP - The YubiKey OTP to remove.
	 * @returns {Promise<AccountRemoveYubiKeyResponse>} The response from the server.
	 */
	async removeYubiKey(yubiKeyOTP: string): Promise<AccountRemoveYubiKeyResponse> {
		if (!this.token) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		return await PasskyAPI.removeYubiKey(this.server, this.username, this.token, yubiKeyOTP);
	}

	/**
	 * Sends the username associated with a provided email.
	 * @param {string} server - The server URL.
	 * @param {string} email - The user's email address.
	 * @returns {Promise<StandardResponse>} The response from the server.
	 */
	static async forgotUsername(server: string, email: string): Promise<StandardResponse> {
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

	/**
	 * Upgrades the user's account using a license key.
	 * @param {string} server - The server URL.
	 * @param {string} username - The user's username.
	 * @param {string} token - The user's authentication token.
	 * @param {string} license - The license key for upgrading the account.
	 * @returns {Promise<AccountUpgradeResponse>} The response from the server.
	 */
	static async upgradeAccount(server: string, username: string, token: string, license: string): Promise<AccountUpgradeResponse> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.masterUsername(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
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

	/**
	 * Upgrades the current account using a license key.
	 * @param {string} license - The license key for upgrading the account.
	 * @returns {Promise<AccountUpgradeResponse>} The response from the server.
	 */
	async upgradeAccount(license: string): Promise<AccountUpgradeResponse> {
		if (!this.token) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		return await PasskyAPI.upgradeAccount(this.server, this.username, this.token, license);
	}

	/**
	 * Imports a list of passwords to the user's account.
	 * @param {string} server - The server URL.
	 * @param {string} username - The user's username.
	 * @param {string} token - The user's authentication token.
	 * @param {string} encryptionHash - The encryption hash for securing the passwords.
	 * @param {PasswordData[]} passwords - The list of passwords to import.
	 * @returns {Promise<AccountImportPasswords>} The response from the server.
	 */
	static async importPasswords(
		server: string,
		username: string,
		token: string,
		encryptionHash: string,
		passwords: PasswordData[]
	): Promise<AccountImportPasswords> {
		if (!Validate.url(server)) return Errors.getJson(Error.SERVER_UNREACHABLE);
		if (!Validate.masterUsername(username)) return Errors.getJson(Error.INVALID_USERNAME_FORMAT);
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

	/**
	 * Imports a list of passwords to the current account.
	 * @param {PasswordData[]} passwords - The list of passwords to import.
	 * @returns {Promise<AccountImportPasswords>} The response from the server.
	 */
	async importPasswords(passwords: PasswordData[]): Promise<AccountImportPasswords> {
		if (!this.token) return Errors.getJson(Error.INVALID_OR_EXPIRED_TOKEN);
		if (!this.encryptionHash) return Errors.getJson(Error.INVALID_HASH);
		return await PasskyAPI.importPasswords(this.server, this.username, this.token, this.encryptionHash, passwords);
	}
}

export type {
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
};

export { PasskyAPI, Blake2b, Argon2id, XChaCha20, Error, Errors, Validate };
