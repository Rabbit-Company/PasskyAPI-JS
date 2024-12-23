/**
 * The `Validate` namespace provides a collection of validation functions
 * used to verify the correctness of various input data types, such as
 * usernames, passwords, URLs, email addresses, and more. These utility
 * functions are useful for ensuring data integrity and security throughout
 * the application.
 */
namespace Validate {
	/**
	 * Validates master username based on specific rules.
	 * A valid master username:
	 * - Can contain lowercase letters, numbers, periods (.), and underscores (_).
	 * - Must be between 6 and 30 characters long.
	 *
	 * @param {string} username - The username to validate.
	 * @returns {boolean} True if the username is valid, otherwise false.
	 */
	export function masterUsername(username: string): boolean {
		return /^[a-z0-9._]{6,30}$/i.test(username);
	}

	/**
	 * Validates master password.
	 * A valid master password:
	 * - Must be at least 8 characters long.
	 *
	 * @param {string} password - The password to validate.
	 * @returns {boolean} True if the password is valid, otherwise false.
	 */
	export function masterPassword(password: string): boolean {
		return password.length >= 8;
	}

	/**
	 * Validates a hash.
	 * A valid hash:
	 * - Must be 128 characters long.
	 *
	 * @param {string} hash - The hash to validate.
	 * @returns {boolean} True if the hash is valid, otherwise false.
	 */
	export function hash(hash: string): boolean {
		return hash.length === 128;
	}

	/**
	 * Validates a URL.
	 *
	 * @param {string} url - The URL to validate.
	 * @returns {boolean} True if the URL is valid, otherwise false.
	 */
	export function url(url: string): boolean {
		return !/\s/.test(url);
	}

	/**
	 * Validates an email address.
	 *
	 * @param {string} email - The email address to validate.
	 * @returns {boolean} True if the email is valid, otherwise false.
	 */
	export function email(email: string): boolean {
		return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i.test(email);
	}

	/**
	 * Validates a One-Time Password (OTP).
	 * A valid OTP:
	 * - Must be null, empty, 6 characters long, or 44 characters long.
	 *
	 * @param {string | null} otp - The OTP to validate.
	 * @returns {boolean} True if the OTP is valid, otherwise false.
	 */
	export function otp(otp: string | null): boolean {
		if (otp == null) return false;
		return otp.length == 0 || otp.length == 6 || otp.length == 44;
	}

	/**
	 * Validates a token.
	 * A valid token:
	 * - Must be exactly 64 characters long.
	 * - Can include lowercase and uppercase letters and numbers.
	 *
	 * @param {string} token - The token to validate.
	 * @returns {boolean} True if the token is valid, otherwise false.
	 */
	export function token(token: string): boolean {
		return /^[a-z0-9]{64}$/i.test(token);
	}

	/**
	 * Validates a website name or URL for storing login credentials.
	 * A valid website:
	 * - Must be between 2 and 100 characters long.
	 *
	 * @param {string} website - The website to validate.
	 * @returns {boolean} True if the website is valid, otherwise false.
	 */
	export function website(website: string): boolean {
		return website.length >= 2 && website.length <= 100;
	}

	/**
	 * Validates a username for storing login credentials.
	 * A valid username:
	 * - Must be between 2 and 100 characters long.
	 *
	 * @param {string} username - The username to validate.
	 * @returns {boolean} True if the username is valid, otherwise false.
	 */
	export function username(username: string): boolean {
		return username.length >= 2 && username.length <= 100;
	}

	/**
	 * Validates a password for storing login credentials.
	 * A valid password:
	 * - Must be between 2 and 100 characters long.
	 *
	 * @param {string} password - The password to validate.
	 * @returns {boolean} True if the password is valid, otherwise false.
	 */
	export function password(password: string): boolean {
		return password.length >= 2 && password.length <= 100;
	}

	/**
	 * Validates a message for storing login credentials.
	 * A valid message:
	 * - Must be between 0 and 5000 characters long.
	 *
	 * @param {string} message - The message to validate.
	 * @returns {boolean} True if the message is valid, otherwise false.
	 */
	export function message(message: string): boolean {
		return message.length >= 0 && message.length <= 5000;
	}

	/**
	 * Validates if a value is a positive integer.
	 *
	 * @param {any} number - The value to check.
	 * @returns {boolean} True if the value is a positive integer, otherwise false.
	 */
	export function positiveInteger(number: any): boolean {
		if (typeof number == "undefined" || number == null) return false;
		return number >>> 0 === parseFloat(number);
	}

	/**
	 * Validates a YubiKey ID.
	 * A valid YubiKey ID is 44 characters long.
	 *
	 * @param {string} id - The YubiKey ID to validate.
	 * @returns {boolean} True if the ID is valid, otherwise false.
	 */
	export function yubiKey(id: string): boolean {
		return id.length == 44;
	}

	/**
	 * Validates a license key.
	 * A valid license key is 29 characters long.
	 *
	 * @param {string} license - The license key to validate.
	 * @returns {boolean} True if the license key is valid, otherwise false.
	 */
	export function license(license: string): boolean {
		return license.length == 29;
	}

	/**
	 * Checks if a string is a valid JSON string.
	 *
	 * @param {string} json - The string to validate as JSON.
	 * @returns {boolean} True if the string is valid JSON, otherwise false.
	 */
	export function json(json: any): boolean {
		try {
			JSON.parse(json);
			return true;
		} catch {}
		return false;
	}

	/**
	 * Validates a response object.
	 * A valid response has an 'error' property of type number and an 'info' property of type string.
	 *
	 * @param {any} response - The response object to validate.
	 * @returns {boolean} True if the response is valid, otherwise false.
	 */
	export function response(response: any): boolean {
		return typeof response.error === "number" && typeof response.info === "string";
	}
}

export default Validate;
