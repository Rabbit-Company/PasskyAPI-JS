import XChaCha20 from '@rabbit-company/xchacha20';

export interface PasswordData {
	website: string;
	username: string;
	password: string;
	message: string;
}
export interface Password {
	id: number;
	website: string;
	username: string;
	password: string;
	message: string;
}
/**
 * Represents a standard response structure with an error code and information message.
 * @interface
 */
export interface ErrorResponse {
	/** The error code associated with the response. */
	error: Exclude<Error$1, Error$1.SUCCESS | Error$1.NO_SAVED_PASSWORDS>;
	/** A descriptive message providing more information about the response. */
	info: string;
}
/**
 * Represents a standard response structure with an error code and information message.
 * @interface
 */
export interface StandardResponse {
	/** The error code associated with the response. */
	error: Error$1;
	/** A descriptive message providing more information about the response. */
	info: string;
}
export type ServerInfoResponse = {
	/** Indicates a successful operation with Error.SUCCESS. */
	error: Error$1.SUCCESS;
	/** A descriptive message providing details about the success. */
	info: string;
	version: string;
	location: string;
	users: number;
	maxUsers: number;
	passwords: number;
	maxPasswords: number;
	hashingCost: number;
} | {
	/** Indicates an error occurred with an Error value other than SUCCESS. */
	error: Exclude<Error$1, Error$1.SUCCESS>;
	/** A descriptive message providing details about the error. */
	info: string;
};
export type ServerStatsResponse = {
	/** Indicates a successful operation with Error.SUCCESS. */
	error: Error$1.SUCCESS;
	/** A descriptive message providing details about the success. */
	info: string;
	cpu: number;
	cores: number;
	memoryUsed: number;
	memoryTotal: number;
	diskUsed: number;
	diskTotal: number;
} | {
	/** Indicates an error occurred with an Error value other than SUCCESS. */
	error: Exclude<Error$1, Error$1.SUCCESS>;
	/** A descriptive message providing details about the error. */
	info: string;
};
export type ServerReportResponse = {
	/** Indicates a successful operation with Error.SUCCESS. */
	error: Error$1.SUCCESS;
	/** A descriptive message providing details about the success. */
	info: string;
	activeUsers: number;
	results: {
		date: string;
		newcomers: number;
	}[];
} | {
	/** Indicates an error occurred with an Error value other than SUCCESS. */
	error: Exclude<Error$1, Error$1.SUCCESS>;
	/** A descriptive message providing details about the error. */
	info: string;
};
export type AccountTokenResponse = {
	/** Indicates a successful operation with Error.SUCCESS. */
	error: Error$1.SUCCESS | Error$1.NO_SAVED_PASSWORDS;
	/** A descriptive message providing details about the success. */
	info: string;
	token: string;
	auth: boolean;
	yubico: string;
	max_passwords: number;
	premium_expires: number;
	passwords: Password[];
} | {
	/** Indicates an error occurred with an Error value other than SUCCESS. */
	error: Exclude<Error$1, Error$1.SUCCESS | Error$1.NO_SAVED_PASSWORDS>;
	/** A descriptive message providing details about the error. */
	info: string;
};
export type AccountPasswordsResponse = {
	/** Indicates a successful operation with Error.SUCCESS. */
	error: Error$1.SUCCESS | Error$1.NO_SAVED_PASSWORDS;
	/** A descriptive message providing details about the success. */
	info: string;
	passwords: Password[];
} | {
	/** Indicates an error occurred with an Error value other than SUCCESS. */
	error: Exclude<Error$1, Error$1.SUCCESS | Error$1.NO_SAVED_PASSWORDS>;
	/** A descriptive message providing details about the error. */
	info: string;
};
export type AccountEnable2FaResponse = {
	/** Indicates a successful operation with Error.SUCCESS. */
	error: Error$1.SUCCESS;
	/** A descriptive message providing details about the success. */
	info: string;
	secret: string;
	qrcode: string;
	codes: string;
} | {
	/** Indicates an error occurred with an Error value other than SUCCESS. */
	error: Exclude<Error$1, Error$1.SUCCESS>;
	/** A descriptive message providing details about the error. */
	info: string;
};
export type AccountAddYubiKeyResponse = {
	/** Indicates a successful operation with Error.SUCCESS. */
	error: Error$1.SUCCESS;
	/** A descriptive message providing details about the success. */
	info: string;
	yubico: string;
	codes: string;
} | {
	/** Indicates an error occurred with an Error value other than SUCCESS. */
	error: Exclude<Error$1, Error$1.SUCCESS>;
	/** A descriptive message providing details about the error. */
	info: string;
};
export type AccountRemoveYubiKeyResponse = {
	/** The error code associated with the response. */
	error: Error$1.SUCCESS;
	/** A descriptive message providing more information about the response. */
	info: string;
	yubico: string;
} | {
	/** The error code associated with the response. */
	error: Exclude<Error$1, Error$1.SUCCESS>;
	/** A descriptive message providing more information about the response. */
	info: string;
};
export type AccountUpgradeResponse = {
	/** The error code associated with the response. */
	error: Error$1.SUCCESS;
	/** A descriptive message providing more information about the response. */
	info: string;
	max_passwords: number;
	premium_expires: string;
} | {
	/** The error code associated with the response. */
	error: Exclude<Error$1, Error$1.SUCCESS>;
	/** A descriptive message providing more information about the response. */
	info: string;
};
export type AccountImportPasswords = {
	/** The error code associated with the response. */
	error: Error$1.SUCCESS;
	/** A descriptive message providing more information about the response. */
	info: string;
	import_success: number;
	import_error: number;
} | {
	/** The error code associated with the response. */
	error: Exclude<Error$1, Error$1.SUCCESS>;
	/** A descriptive message providing more information about the response. */
	info: string;
};
/**
 * Enum representing various error codes used throughout the application.
 * Each error code corresponds to a specific error message.
 * @readonly
 * @enum {number}
 */
declare enum Error$1 {
	/** Action was executed successfully. */
	SUCCESS = 0,
	/** Username is invalid. */
	INVALID_USERNAME = 1,
	/** Password is incorrect. */
	INVALID_PASSWORD = 2,
	/** Error inserting data into the database. */
	DATABASE_INSERT_ERROR = 3,
	/** Username is already registered. */
	USERNAME_ALREADY_REGISTERED = 4,
	/** Password is too weak. */
	WEAK_PASSWORD = 5,
	/** Email is invalid. */
	INVALID_EMAIL = 6,
	/** Username does not exist. */
	USERNAME_NOT_FOUND = 7,
	/** No saved passwords available. */
	NO_SAVED_PASSWORDS = 8,
	/** Domain is invalid. */
	INVALID_DOMAIN = 9,
	/** User does not own this password. */
	PASSWORD_NOT_OWNED_BY_USER = 10,
	/** Error deleting data from the database. */
	DATABASE_DELETE_ERROR = 11,
	/** Username does not meet length or character requirements. */
	INVALID_USERNAME_FORMAT = 12,
	/** Error updating data in the database. */
	DATABASE_UPDATE_ERROR = 13,
	/** JSON data is invalid. */
	INVALID_JSON = 14,
	/** Server cannot accept more users. */
	SERVER_CAPACITY_REACHED = 15,
	/** Maximum password storage limit reached. */
	MAXIMUM_PASSWORD_LIMIT = 16,
	/** Account with this email does not exist. */
	EMAIL_NOT_FOUND = 17,
	/** Message exceeds allowed length. */
	MESSAGE_TOO_LONG = 18,
	/** OTP is incorrect. */
	INVALID_OTP = 19,
	/** Maximum number of Yubikeys linked. */
	MAX_YUBIKEYS_LINKED = 20,
	/** Yubikey is already linked to account. */
	YUBIKEY_ALREADY_LINKED = 21,
	/** Provided Yubikey OTP is invalid. */
	INVALID_YUBIKEY_OTP = 23,
	/** Yubikey ID is not linked to account. */
	YUBIKEY_NOT_LINKED = 24,
	/** Token is incorrect or expired. */
	INVALID_OR_EXPIRED_TOKEN = 25,
	/** Two-factor authentication is already enabled. */
	TWO_FACTOR_ALREADY_ENABLED = 26,
	/** Two-factor authentication is not enabled. */
	TWO_FACTOR_NOT_ENABLED = 27,
	/** Mail is not enabled on this server. */
	MAIL_NOT_ENABLED = 28,
	/** License key is invalid. */
	INVALID_LICENSE_KEY = 29,
	/** License key has already been used. */
	LICENSE_KEY_ALREADY_USED = 30,
	/** Website URL exceeds allowed length. */
	WEBSITE_TOO_LONG = 300,
	/** Username exceeds allowed length. */
	USERNAME_TOO_LONG = 301,
	/** Password exceeds allowed length. */
	PASSWORD_TOO_LONG = 302,
	/** Message exceeds allowed length. */
	MESSAGE_TOO_LONG_DUPLICATE = 303,
	/** Action was not provided in GET request. */
	ACTION_NOT_PROVIDED = 400,
	/** Provided action is invalid. */
	INVALID_ACTION = 401,
	/** Required values not provided in POST request. */
	MISSING_REQUIRED_POST_VALUES = 403,
	/** Unable to connect to API. */
	API_CONNECTION_ERROR = 404,
	/** Too many requests sent; action rate limit exceeded. */
	TOO_MANY_REQUESTS = 429,
	/** Database connection error. */
	DATABASE_CONNECTION_ERROR = 505,
	/** Mail server connection error. */
	MAIL_SERVER_CONNECTION_ERROR = 506,
	/** No permission to access this endpoint. */
	UNAUTHORIZED_ENDPOINT_ACCESS = 999,
	/** Server is unreachable. */
	SERVER_UNREACHABLE = 1000,
	/** Invalid response format received from server. */
	INVALID_RESPONSE_FORMAT = 1001,
	/** Invalid hash provided. */
	INVALID_HASH = 1002,
	/** Unknown error occurred. */
	UNKNOWN_ERROR = 1001
}
/**
 * Namespace containing error handling utilities.
 * Provides methods to retrieve error details and format error responses in JSON.
 * @namespace
 */
export declare namespace Errors {
	/**
	 * A dictionary mapping error codes to their corresponding messages.
	 * Each error code is a unique numeric key associated with a specific error message.
	 * @type {{ [key: number]: string }}
	 */
	const list: {
		[key: number]: string;
	};
	/**
	 * Retrieves the error details for a given error code.
	 * @param {Error} id - The error code to retrieve details for.
	 * @returns {string} The error message associated with the given error code.
	 */
	function get(id: Error$1): string;
	/**
	 * Formats the error response as a JSON object.
	 * @param {Exclude<Error, Error.SUCCESS | Error.NO_SAVED_PASSWORDS>} id - The error code to format.
	 * @returns {ErrorResponse} A JSON object containing the error code and message.
	 */
	function getJson(id: Exclude<Error$1, Error$1.SUCCESS | Error$1.NO_SAVED_PASSWORDS>): ErrorResponse;
}
/**
 * The `Validate` namespace provides a collection of validation functions
 * used to verify the correctness of various input data types, such as
 * usernames, passwords, URLs, email addresses, and more. These utility
 * functions are useful for ensuring data integrity and security throughout
 * the application.
 */
export declare namespace Validate {
	/**
	 * Validates a username based on specific rules.
	 * A valid username:
	 * - Can contain lowercase letters, numbers, periods (.), and underscores (_).
	 * - Must be between 6 and 30 characters long.
	 *
	 * @param {string} username - The username to validate.
	 * @returns {boolean} True if the username is valid, otherwise false.
	 */
	function username(username: string): boolean;
	/**
	 * Validates a password.
	 * A valid password:
	 * - Must be at least 8 characters long.
	 *
	 * @param {string} password - The password to validate.
	 * @returns {boolean} True if the password is valid, otherwise false.
	 */
	function password(password: string): boolean;
	/**
	 * Validates a hash.
	 * A valid hash:
	 * - Must be 128 characters long.
	 *
	 * @param {string} hash - The hash to validate.
	 * @returns {boolean} True if the hash is valid, otherwise false.
	 */
	function hash(hash: string): boolean;
	/**
	 * Validates a URL.
	 *
	 * @param {string} url - The URL to validate.
	 * @returns {boolean} True if the URL is valid, otherwise false.
	 */
	function url(url: string): boolean;
	/**
	 * Validates an email address.
	 *
	 * @param {string} email - The email address to validate.
	 * @returns {boolean} True if the email is valid, otherwise false.
	 */
	function email(email: string): boolean;
	/**
	 * Validates a One-Time Password (OTP).
	 * A valid OTP:
	 * - Must be null, empty, 6 characters long, or 44 characters long.
	 *
	 * @param {string | null} otp - The OTP to validate.
	 * @returns {boolean} True if the OTP is valid, otherwise false.
	 */
	function otp(otp: string | null): boolean;
	/**
	 * Validates a token.
	 * A valid token:
	 * - Must be exactly 64 characters long.
	 * - Can include lowercase and uppercase letters and numbers.
	 *
	 * @param {string} token - The token to validate.
	 * @returns {boolean} True if the token is valid, otherwise false.
	 */
	function token(token: string): boolean;
	function passwordWebsite(website: string): boolean;
	function passwordUsername(username: string): boolean;
	function passwordPassword(password: string): boolean;
	function passwordMessage(message: string): boolean;
	/**
	 * Validates if a value is a positive integer.
	 *
	 * @param {any} number - The value to check.
	 * @returns {boolean} True if the value is a positive integer, otherwise false.
	 */
	function positiveInteger(number: any): boolean;
	/**
	 * Validates a YubiKey ID.
	 * A valid YubiKey ID is 44 characters long.
	 *
	 * @param {string} id - The YubiKey ID to validate.
	 * @returns {boolean} True if the ID is valid, otherwise false.
	 */
	function yubiKey(id: string): boolean;
	/**
	 * Validates a license key.
	 * A valid license key is 29 characters long.
	 *
	 * @param {string} license - The license key to validate.
	 * @returns {boolean} True if the license key is valid, otherwise false.
	 */
	function license(license: string): boolean;
	/**
	 * Checks if a string is a valid JSON string.
	 *
	 * @param {string} json - The string to validate as JSON.
	 * @returns {boolean} True if the string is valid JSON, otherwise false.
	 */
	function json(json: any): boolean;
	/**
	 * Validates a response object.
	 * A valid response has an 'error' property of type number and an 'info' property of type string.
	 *
	 * @param {any} response - The response object to validate.
	 * @returns {boolean} True if the response is valid, otherwise false.
	 */
	function response(response: any): boolean;
}
/**
 * Class for interacting with the Passky API.
 *
 * This class provides functions for managing accounts, passwords, and settings
 * via HTTP requests to the Passky server.
 */
export declare class PasskyAPI {
	server: string;
	username: string;
	password: string;
	token: string | null;
	authenticationHash: string | null;
	encryptionHash: string | null;
	/**
	 * Creates an instance of PasskyAPI.
	 *
	 * @constructor
	 * @param {string} server - The URL of the server to connect to.
	 * @param {string} username - The username for authentication.
	 * @param {string} password - The master password for authentication.
	 */
	constructor(server: string, username: string, password: string);
	static generateAuthenticationHash(username: string, password: string): Promise<string | null>;
	generateAuthenticationHash(): Promise<string | null>;
	static generateEncryptionHash(username: string, password: string): Promise<string | null>;
	generateEncryptionHash(): Promise<string | null>;
	static getInfo(server: string): Promise<ServerInfoResponse>;
	static getStats(server: string): Promise<ServerStatsResponse>;
	static getReport(server: string): Promise<ServerReportResponse>;
	static createAccount(server: string, username: string, authenticationHash: string, email: string): Promise<StandardResponse>;
	static getToken(server: string, username: string, authenticationHash: string, otp?: string): Promise<AccountTokenResponse>;
	getToken(otp?: string): Promise<AccountTokenResponse>;
	static getPasswords(server: string, username: string, token: string): Promise<AccountPasswordsResponse>;
	getPasswords(): Promise<AccountPasswordsResponse>;
	static savePassword(server: string, username: string, token: string, encryptionHash: string, passwordData: PasswordData): Promise<StandardResponse>;
	savePassword(passwordData: PasswordData): Promise<StandardResponse>;
	static editPassword(server: string, username: string, token: string, encryptionHash: string, passwordData: Password): Promise<StandardResponse>;
	editPassword(passwordData: Password): Promise<StandardResponse>;
	static deletePassword(server: string, username: string, token: string, passwordID: string | number): Promise<StandardResponse>;
	deletePassword(passwordID: string | number): Promise<StandardResponse>;
	static deletePasswords(server: string, username: string, token: string): Promise<StandardResponse>;
	deletePasswords(): Promise<StandardResponse>;
	static deleteAccount(server: string, username: string, token: string): Promise<StandardResponse>;
	deleteAccount(): Promise<StandardResponse>;
	static enable2FA(server: string, username: string, token: string): Promise<AccountEnable2FaResponse>;
	static disable2FA(server: string, username: string, token: string): Promise<StandardResponse>;
	static addYubiKey(server: string, username: string, token: string, yubiKeyOTP: string): Promise<AccountAddYubiKeyResponse>;
	static removeYubiKey(server: string, username: string, token: string, yubiKeyOTP: string): Promise<AccountRemoveYubiKeyResponse>;
	static forgotUsername(server: string, email: string): Promise<StandardResponse>;
	static upgradeAccount(server: string, username: string, token: string, license: string): Promise<AccountUpgradeResponse>;
	static importPasswords(server: string, username: string, token: string, encryptionHash: string, passwords: PasswordData[]): Promise<AccountImportPasswords>;
}

export {
	Error$1 as Error,
	XChaCha20,
};

export {};
