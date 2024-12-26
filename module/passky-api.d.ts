import Argon2id from '@rabbit-company/argon2id';
import Blake2b from '@rabbit-company/blake2b';
import XChaCha20 from '@rabbit-company/xchacha20';

/**
 * Represents data related to a stored password.
 * @interface
 */
export interface PasswordData {
	website: string;
	username: string;
	password: string;
	message: string;
}
/**
 * Represents a password entry with a unique ID.
 * @interface
 */
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
/**
 * Represents a response containing server information.
 * @typedef
 */
export type ServerInfoResponse = {
	/** Indicates a successful operation with Error.SUCCESS. */
	error: Error$1.SUCCESS;
	/** A descriptive message providing details about the success. */
	info: string;
	/** The current server version. */
	version: string;
	/** The server location. */
	location: string;
	/** The number of registered users. */
	users: number;
	/** The maximum allowed number of users. */
	maxUsers: number;
	/** The number of stored passwords. */
	passwords: number;
	/** The maximum allowed number of passwords. */
	maxPasswords: number;
	/** The hashing cost factor. */
	hashingCost: number;
} | {
	/** Indicates an error occurred with an Error value other than SUCCESS. */
	error: Exclude<Error$1, Error$1.SUCCESS>;
	/** A descriptive message providing details about the error. */
	info: string;
};
/**
 * Represents a response containing server resource statistics.
 * @typedef
 */
export type ServerStatsResponse = {
	/** Indicates a successful operation with Error.SUCCESS. */
	error: Error$1.SUCCESS;
	/** A descriptive message providing details about the success. */
	info: string;
	/** The CPU usage percentage. */
	cpu: number;
	/** The number of CPU cores available. */
	cores: number;
	/** The memory usage in bytes. */
	memoryUsed: number;
	/** The total memory available in bytes. */
	memoryTotal: number;
	/** The disk usage in bytes. */
	diskUsed: number;
	/** The total disk space available in bytes. */
	diskTotal: number;
} | {
	/** Indicates an error occurred with an Error value other than SUCCESS. */
	error: Exclude<Error$1, Error$1.SUCCESS>;
	/** A descriptive message providing details about the error. */
	info: string;
};
/**
 * Represents a response containing server activity reports.
 * @typedef
 */
export type ServerReportResponse = {
	/** Indicates a successful operation with Error.SUCCESS. */
	error: Error$1.SUCCESS;
	/** A descriptive message providing details about the success. */
	info: string;
	/** The number of active users on the server. */
	activeUsers: number;
	/** A list of report results containing date and newcomer information. */
	results: {
		/** The date of the report entry. */
		date: string;
		/** The number of newcomers on the given date. */
		newcomers: number;
	}[];
} | {
	/** Indicates an error occurred with an Error value other than SUCCESS. */
	error: Exclude<Error$1, Error$1.SUCCESS>;
	/** A descriptive message providing details about the error. */
	info: string;
};
/**
 * Represents a response containing account token and related information.
 * @typedef
 */
export type AccountTokenResponse = {
	/** Indicates a successful operation with Error.SUCCESS. */
	error: Error$1.SUCCESS | Error$1.NO_SAVED_PASSWORDS;
	/** A descriptive message providing details about the success. */
	info: string;
	/** The account token. */
	token: string;
	/** Indicates whether the account has 2FA enabled. */
	auth: boolean;
	/** The Yubico keys associated with the account. */
	yubico: string;
	/** The maximum number of passwords allowed. */
	max_passwords: number;
	/** The timestamp for premium expiry. */
	premium_expires: number;
	/** A list of stored passwords. */
	passwords: Password[];
} | {
	/** Indicates an error occurred with an Error value other than SUCCESS. */
	error: Exclude<Error$1, Error$1.SUCCESS | Error$1.NO_SAVED_PASSWORDS>;
	/** A descriptive message providing details about the error. */
	info: string;
};
/**
 * Represents a response containing account passwords.
 * @typedef
 */
export type AccountPasswordsResponse = {
	/** Indicates a successful operation with Error.SUCCESS. */
	error: Error$1.SUCCESS | Error$1.NO_SAVED_PASSWORDS;
	/** A descriptive message providing details about the success. */
	info: string;
	/** A list of stored passwords. */
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
	/** The secret key for 2FA. */
	secret: string;
	/** The QR code for setting up 2FA. */
	qrcode: string;
	/** Backup codes for 2FA. */
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
	/** The Yubico keys associated with the account. */
	yubico: string;
	/** Backup codes for 2FA. */
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
	/** The Yubico keys associated with the account. */
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
	/** The maximum number of passwords allowed after the upgrade. */
	max_passwords: number;
	/** The premium expiry date as a string. */
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
	/** The number of passwords successfully imported. */
	import_success: number;
	/** The number of passwords that failed to import. */
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
	 * Validates master username based on specific rules.
	 * A valid master username:
	 * - Can contain lowercase letters, numbers, periods (.), and underscores (_).
	 * - Must be between 6 and 30 characters long.
	 *
	 * @param {string} username - The username to validate.
	 * @returns {boolean} True if the username is valid, otherwise false.
	 */
	function masterUsername(username: string): boolean;
	/**
	 * Validates master password.
	 * A valid master password:
	 * - Must be at least 8 characters long.
	 *
	 * @param {string} password - The password to validate.
	 * @returns {boolean} True if the password is valid, otherwise false.
	 */
	function masterPassword(password: string): boolean;
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
	/**
	 * Validates a website name or URL for storing login credentials.
	 * A valid website:
	 * - Must be between 2 and 100 characters long.
	 *
	 * @param {string} website - The website to validate.
	 * @returns {boolean} True if the website is valid, otherwise false.
	 */
	function website(website: string): boolean;
	/**
	 * Validates a username for storing login credentials.
	 * A valid username:
	 * - Must be between 2 and 100 characters long.
	 *
	 * @param {string} username - The username to validate.
	 * @returns {boolean} True if the username is valid, otherwise false.
	 */
	function username(username: string): boolean;
	/**
	 * Validates a password for storing login credentials.
	 * A valid password:
	 * - Must be between 2 and 100 characters long.
	 *
	 * @param {string} password - The password to validate.
	 * @returns {boolean} True if the password is valid, otherwise false.
	 */
	function password(password: string): boolean;
	/**
	 * Validates a message for storing login credentials.
	 * A valid message:
	 * - Must be between 0 and 5000 characters long.
	 *
	 * @param {string} message - The message to validate.
	 * @returns {boolean} True if the message is valid, otherwise false.
	 */
	function message(message: string): boolean;
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
	/**
	 * Generates an authentication hash for a given username and password.
	 *
	 * @static
	 * @param {string} username - The username to generate the hash for.
	 * @param {string} password - The password to generate the hash for.
	 * @returns {Promise<string | null>} A promise resolving to the authentication hash, or null if an error occurs.
	 */
	static generateAuthenticationHash(username: string, password: string): Promise<string | null>;
	/**
	 * Generates and sets the authentication hash for the current instance.
	 *
	 * @returns {Promise<string | null>} A promise resolving to the generated authentication hash, or null if an error occurs.
	 */
	generateAuthenticationHash(): Promise<string | null>;
	/**
	 * Generates an encryption hash for a given username and password.
	 *
	 * @static
	 * @param {string} username - The username to generate the hash for.
	 * @param {string} password - The password to generate the hash for.
	 * @returns {Promise<string | null>} A promise resolving to the encryption hash, or null if an error occurs.
	 */
	static generateEncryptionHash(username: string, password: string): Promise<string | null>;
	/**
	 * Generates and sets the encryption hash for the current instance.
	 *
	 * @returns {Promise<string | null>} A promise resolving to the generated encryption hash, or null if an error occurs.
	 */
	generateEncryptionHash(): Promise<string | null>;
	/**
	 * Fetches server information from the specified server URL.
	 *
	 * @static
	 * @param {string} server - The server URL to fetch the information from.
	 * @returns {Promise<ServerInfoResponse>} A promise resolving to the server information response.
	 */
	static getInfo(server: string): Promise<ServerInfoResponse>;
	/**
	 * Fetches server statistics from the specified server URL.
	 *
	 * @static
	 * @param {string} server - The server URL to fetch the statistics from.
	 * @returns {Promise<ServerStatsResponse>} A promise resolving to the server statistics response.
	 */
	static getStats(server: string): Promise<ServerStatsResponse>;
	/**
	 * Fetches a server activity report from the specified server URL.
	 *
	 * @static
	 * @param {string} server - The server URL to fetch the report from.
	 * @returns {Promise<ServerReportResponse>} A promise resolving to the server activity report response.
	 */
	static getReport(server: string): Promise<ServerReportResponse>;
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
	static createAccount(server: string, username: string, authenticationHash: string, email: string): Promise<StandardResponse>;
	/**
	 * Creates a new account using the current instance's details.
	 *
	 * @param {string} email - The email address for the new account.
	 * @returns {Promise<StandardResponse>} A promise resolving to the response of the account creation operation.
	 */
	createAccount(email: string): Promise<StandardResponse>;
	/**
	 * Fetches an authentication token from the specified server.
	 *
	 * @static
	 * @param {string} server - The server URL to fetch the token from.
	 * @param {string} username - The username for authentication.
	 * @param {string} authenticationHash - The hash generated for authentication.
	 * @param {string | null} encryptionHash - The hash used for password decryption.
	 * @param {string} [otp=""] - An optional one-time password (OTP) for 2FA.
	 * @returns {Promise<AccountTokenResponse>} A promise resolving to the token response.
	 */
	static getToken(server: string, username: string, authenticationHash: string, encryptionHash: string | null, otp?: string): Promise<AccountTokenResponse>;
	/**
	 * Fetches and sets an authentication token using the current instance's details.
	 *
	 * @param {string} [otp=""] - An optional one-time password (OTP) for 2FA.
	 * @returns {Promise<AccountTokenResponse>} A promise resolving to the token response.
	 */
	getToken(otp?: string): Promise<AccountTokenResponse>;
	/**
	 * Fetches the user's passwords from the server.
	 *
	 * @static
	 * @param {string} server - The URL of the server.
	 * @param {string} username - The username for authentication.
	 * @param {string} token - The authentication token.
	 * @param {string | null} encryptionHash - The hash used for password decryption.
	 * @returns {Promise<AccountPasswordsResponse>} A promise resolving to the response containing the passwords.
	 */
	static getPasswords(server: string, username: string, token: string, encryptionHash: string | null): Promise<AccountPasswordsResponse>;
	/**
	 * Fetches the user's passwords using the instance's server, username, and token.
	 *
	 * @returns {Promise<AccountPasswordsResponse>} A promise resolving to the response containing the passwords.
	 */
	getPasswords(): Promise<AccountPasswordsResponse>;
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
	static savePassword(server: string, username: string, token: string, encryptionHash: string, passwordData: PasswordData): Promise<StandardResponse>;
	/**
	 * Saves a new password using the instance's server, username, token, and encryption hash.
	 *
	 * @param {PasswordData} passwordData - The password data to save.
	 * @returns {Promise<StandardResponse>} A promise resolving to the response status.
	 */
	savePassword(passwordData: PasswordData): Promise<StandardResponse>;
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
	static editPassword(server: string, username: string, token: string, encryptionHash: string, passwordData: Password): Promise<StandardResponse>;
	/**
	 * Edits an existing password using the instance's server, username, token, and encryption hash.
	 *
	 * @param {Password} passwordData - The updated password data.
	 * @returns {Promise<StandardResponse>} A promise resolving to the response status.
	 */
	editPassword(passwordData: Password): Promise<StandardResponse>;
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
	static deletePassword(server: string, username: string, token: string, passwordID: string | number): Promise<StandardResponse>;
	/**
	 * Deletes a specific password using the instance's server, username, and token.
	 *
	 * @param {string | number} passwordID - The ID of the password to delete.
	 * @returns {Promise<StandardResponse>} A promise resolving to the response status.
	 */
	deletePassword(passwordID: string | number): Promise<StandardResponse>;
	/**
	 * Deletes all passwords for the user on the server.
	 *
	 * @static
	 * @param {string} server - The URL of the server.
	 * @param {string} username - The username for authentication.
	 * @param {string} token - The authentication token.
	 * @returns {Promise<StandardResponse>} A promise resolving to the response status.
	 */
	static deletePasswords(server: string, username: string, token: string): Promise<StandardResponse>;
	/**
	 * Deletes all passwords for the user using the instance's server, username, and token.
	 *
	 * @returns {Promise<StandardResponse>} A promise resolving to the response status.
	 */
	deletePasswords(): Promise<StandardResponse>;
	/**
	 * Deletes the user's account from the server.
	 * @param {string} server - The server URL.
	 * @param {string} username - The user's username.
	 * @param {string} token - The user's authentication token.
	 * @returns {Promise<StandardResponse>} - A promise resolving to the server's response.
	 */
	static deleteAccount(server: string, username: string, token: string): Promise<StandardResponse>;
	/**
	 * Deletes the current user's account.
	 * @returns {Promise<StandardResponse>} - A promise resolving to the server's response.
	 */
	deleteAccount(): Promise<StandardResponse>;
	/**
	 * Enables two-factor authentication for the user's account.
	 * @param {string} server - The server URL.
	 * @param {string} username - The user's username.
	 * @param {string} token - The user's authentication token.
	 * @returns {Promise<AccountEnable2FaResponse>} - A promise resolving to the server's response.
	 */
	static enable2FA(server: string, username: string, token: string): Promise<AccountEnable2FaResponse>;
	/**
	 * Enables two-factor authentication for the current user.
	 * @returns {Promise<AccountEnable2FaResponse>} - A promise resolving to the server's response.
	 */
	enable2FA(): Promise<AccountEnable2FaResponse>;
	/**
	 * Disables two-factor authentication for the user's account.
	 * @param {string} server - The server URL.
	 * @param {string} username - The user's username.
	 * @param {string} token - The user's authentication token.
	 * @returns {Promise<StandardResponse>} - A promise resolving to the server's response.
	 */
	static disable2FA(server: string, username: string, token: string): Promise<StandardResponse>;
	/**
	 * Disables two-factor authentication for the current user.
	 * @returns {Promise<StandardResponse>} - A promise resolving to the server's response.
	 */
	disable2FA(): Promise<StandardResponse>;
	/**
	 * Adds a YubiKey to the user's account.
	 * @param {string} server - The server URL.
	 * @param {string} username - The user's username.
	 * @param {string} token - The user's authentication token.
	 * @param {string} yubiKeyOTP - The one-time password generated by the YubiKey.
	 * @returns {Promise<AccountAddYubiKeyResponse>} - A promise resolving to the server's response.
	 */
	static addYubiKey(server: string, username: string, token: string, yubiKeyOTP: string): Promise<AccountAddYubiKeyResponse>;
	/**
	 * Adds a YubiKey to the current user's account.
	 * @param {string} yubiKeyOTP - The one-time password generated by the YubiKey.
	 * @returns {Promise<AccountAddYubiKeyResponse>} - A promise resolving to the server's response.
	 */
	addYubiKey(yubiKeyOTP: string): Promise<AccountAddYubiKeyResponse>;
	/**
	 * Removes a YubiKey from the user's account.
	 * @param {string} server - The server URL.
	 * @param {string} username - The user's username.
	 * @param {string} token - The user's authentication token.
	 * @param {string} yubiKeyOTP - The YubiKey OTP to remove.
	 * @returns {Promise<AccountRemoveYubiKeyResponse>} The response from the server.
	 */
	static removeYubiKey(server: string, username: string, token: string, yubiKeyOTP: string): Promise<AccountRemoveYubiKeyResponse>;
	/**
	 * Removes a YubiKey from the current account.
	 * @param {string} yubiKeyOTP - The YubiKey OTP to remove.
	 * @returns {Promise<AccountRemoveYubiKeyResponse>} The response from the server.
	 */
	removeYubiKey(yubiKeyOTP: string): Promise<AccountRemoveYubiKeyResponse>;
	/**
	 * Sends the username associated with a provided email.
	 * @param {string} server - The server URL.
	 * @param {string} email - The user's email address.
	 * @returns {Promise<StandardResponse>} The response from the server.
	 */
	static forgotUsername(server: string, email: string): Promise<StandardResponse>;
	/**
	 * Upgrades the user's account using a license key.
	 * @param {string} server - The server URL.
	 * @param {string} username - The user's username.
	 * @param {string} token - The user's authentication token.
	 * @param {string} license - The license key for upgrading the account.
	 * @returns {Promise<AccountUpgradeResponse>} The response from the server.
	 */
	static upgradeAccount(server: string, username: string, token: string, license: string): Promise<AccountUpgradeResponse>;
	/**
	 * Upgrades the current account using a license key.
	 * @param {string} license - The license key for upgrading the account.
	 * @returns {Promise<AccountUpgradeResponse>} The response from the server.
	 */
	upgradeAccount(license: string): Promise<AccountUpgradeResponse>;
	/**
	 * Imports a list of passwords to the user's account.
	 * @param {string} server - The server URL.
	 * @param {string} username - The user's username.
	 * @param {string} token - The user's authentication token.
	 * @param {string} encryptionHash - The encryption hash for securing the passwords.
	 * @param {PasswordData[]} passwords - The list of passwords to import.
	 * @returns {Promise<AccountImportPasswords>} The response from the server.
	 */
	static importPasswords(server: string, username: string, token: string, encryptionHash: string, passwords: PasswordData[]): Promise<AccountImportPasswords>;
	/**
	 * Imports a list of passwords to the current account.
	 * @param {PasswordData[]} passwords - The list of passwords to import.
	 * @returns {Promise<AccountImportPasswords>} The response from the server.
	 */
	importPasswords(passwords: PasswordData[]): Promise<AccountImportPasswords>;
}

export {
	Argon2id,
	Blake2b,
	Error$1 as Error,
	XChaCha20,
};

export {};
