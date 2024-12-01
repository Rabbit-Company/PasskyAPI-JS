import type { StandardResponse } from "./types";

/**
 * Enum representing various error codes used throughout the application.
 * Each error code corresponds to a specific error message.
 * @readonly
 * @enum {number}
 */
export enum Error {
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
	UNKNOWN_ERROR = 1001,
}

/**
 * Namespace containing error handling utilities.
 * Provides methods to retrieve error details and format error responses in JSON.
 * @namespace
 */
namespace Errors {
	/**
	 * A dictionary mapping error codes to their corresponding messages.
	 * Each error code is a unique numeric key associated with a specific error message.
	 * @type {{ [key: number]: string }}
	 */
	export const list: { [key: number]: string } = {
		0: "Successful",
		1: "Username is invalid!",
		2: "Password is incorrect!",
		3: "Something went wrong while inserting data to the database!",
		4: "Username is already registered!",
		5: "Your password is too weak!",
		6: "Email is invalid!",
		7: "Username does not exist!",
		8: "You don't have any saved passwords.",
		9: "Domain is invalid!",
		10: "User does not own this password!",
		11: "Something went wrong while deleting data from database!",
		12: "Username must be 6 to 30 characters long, and may only contain letters, numbers and dots!",
		13: "Something went wrong while updating data in database!",
		14: "Json is invalid!",
		15: "This server cannot accept more users!",
		16: "You have reached the maximum amount of stored passwords!",
		17: "Account with this email doesn't exist!",
		18: "Message is too long!",
		19: "OTP is incorrect!",
		20: "You can only link up to 5 Yubikeys!",
		21: "This Yubikey is already linked with your account.",
		23: "Provided Yubikey OTP is invalid!",
		24: "Yubikey with provided ID isn't linked to your account.",
		25: "The token is incorrect or it has expired. Please Sign in again.",
		26: "Two-factor authentication is already enabled.",
		27: "Two-factor authentication is not enabled.",
		28: "Mail is not enabled on this server.",
		29: "License key is invalid!",
		30: "This license key has already been used.",
		300: "Website is too long!",
		301: "Username is too long!",
		302: "Password is too long!",
		303: "Message is too long!",
		400: "Action was not provided in GET!",
		401: "Action is invalid!",
		403: "You didn't provide all required values in POST.",
		404: "Can't connect into API.",
		429: "You are sending too many requests! Please wait before executing this action again.",
		505: "Something went wrong while connecting to the database!",
		506: "Something went wrong while connecting to the mail server!",
		999: "You do NOT have permission to use this endpoint.",
		1000: "Server is unreachable!",
		1001: "Something went wrong while trying to perform this action. Please try again later.",
		1002: "Invalid hash provided!",
	};

	/**
	 * Retrieves the error details for a given error code.
	 * @param {Error} id - The error code to retrieve details for.
	 * @returns {string} The error message associated with the given error code.
	 */
	export function get(id: Error): string {
		return list[id];
	}

	/**
	 * Formats the error response as a JSON object.
	 * @param {Exclude<Error, Error.SUCCESS>} id - The error code to format.
	 * @returns {StandardResponse} A JSON object containing the error code and message.
	 */
	export function getJson(id: Exclude<Error, Error.SUCCESS>): StandardResponse {
		return { error: id, info: list[id] };
	}
}

export default Errors;
