import type { Error } from "./errors";

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
	error: Exclude<Error, Error.SUCCESS | Error.NO_SAVED_PASSWORDS>;
	/** A descriptive message providing more information about the response. */
	info: string;
}

/**
 * Represents a standard response structure with an error code and information message.
 * @interface
 */
export interface StandardResponse {
	/** The error code associated with the response. */
	error: Error;
	/** A descriptive message providing more information about the response. */
	info: string;
}

/**
 * Represents a response containing server information.
 * @typedef
 */
export type ServerInfoResponse =
	| {
			/** Indicates a successful operation with Error.SUCCESS. */
			error: Error.SUCCESS;
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
	  }
	| {
			/** Indicates an error occurred with an Error value other than SUCCESS. */
			error: Exclude<Error, Error.SUCCESS>;
			/** A descriptive message providing details about the error. */
			info: string;
	  };

/**
 * Represents a response containing server resource statistics.
 * @typedef
 */
export type ServerStatsResponse =
	| {
			/** Indicates a successful operation with Error.SUCCESS. */
			error: Error.SUCCESS;
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
	  }
	| {
			/** Indicates an error occurred with an Error value other than SUCCESS. */
			error: Exclude<Error, Error.SUCCESS>;
			/** A descriptive message providing details about the error. */
			info: string;
	  };

/**
 * Represents a response containing server activity reports.
 * @typedef
 */
export type ServerReportResponse =
	| {
			/** Indicates a successful operation with Error.SUCCESS. */
			error: Error.SUCCESS;
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
	  }
	| {
			/** Indicates an error occurred with an Error value other than SUCCESS. */
			error: Exclude<Error, Error.SUCCESS>;
			/** A descriptive message providing details about the error. */
			info: string;
	  };

/**
 * Represents a response containing account token and related information.
 * @typedef
 */
export type AccountTokenResponse =
	| {
			/** Indicates a successful operation with Error.SUCCESS. */
			error: Error.SUCCESS | Error.NO_SAVED_PASSWORDS;
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
	  }
	| {
			/** Indicates an error occurred with an Error value other than SUCCESS. */
			error: Exclude<Error, Error.SUCCESS | Error.NO_SAVED_PASSWORDS>;
			/** A descriptive message providing details about the error. */
			info: string;
	  };

/**
 * Represents a response containing account passwords.
 * @typedef
 */
export type AccountPasswordsResponse =
	| {
			/** Indicates a successful operation with Error.SUCCESS. */
			error: Error.SUCCESS | Error.NO_SAVED_PASSWORDS;
			/** A descriptive message providing details about the success. */
			info: string;
			/** A list of stored passwords. */
			passwords: Password[];
	  }
	| {
			/** Indicates an error occurred with an Error value other than SUCCESS. */
			error: Exclude<Error, Error.SUCCESS | Error.NO_SAVED_PASSWORDS>;
			/** A descriptive message providing details about the error. */
			info: string;
	  };

export type AccountEnable2FaResponse =
	| {
			/** Indicates a successful operation with Error.SUCCESS. */
			error: Error.SUCCESS;
			/** A descriptive message providing details about the success. */
			info: string;
			/** The secret key for 2FA. */
			secret: string;
			/** The QR code for setting up 2FA. */
			qrcode: string;
			/** Backup codes for 2FA. */
			codes: string;
	  }
	| {
			/** Indicates an error occurred with an Error value other than SUCCESS. */
			error: Exclude<Error, Error.SUCCESS>;
			/** A descriptive message providing details about the error. */
			info: string;
	  };

export type AccountAddYubiKeyResponse =
	| {
			/** Indicates a successful operation with Error.SUCCESS. */
			error: Error.SUCCESS;
			/** A descriptive message providing details about the success. */
			info: string;
			/** The Yubico keys associated with the account. */
			yubico: string;
			/** Backup codes for 2FA. */
			codes: string;
	  }
	| {
			/** Indicates an error occurred with an Error value other than SUCCESS. */
			error: Exclude<Error, Error.SUCCESS>;
			/** A descriptive message providing details about the error. */
			info: string;
	  };

export type AccountRemoveYubiKeyResponse =
	| {
			/** The error code associated with the response. */
			error: Error.SUCCESS;
			/** A descriptive message providing more information about the response. */
			info: string;
			/** The Yubico keys associated with the account. */
			yubico: string;
	  }
	| {
			/** The error code associated with the response. */
			error: Exclude<Error, Error.SUCCESS>;
			/** A descriptive message providing more information about the response. */
			info: string;
	  };

export type AccountUpgradeResponse =
	| {
			/** The error code associated with the response. */
			error: Error.SUCCESS;
			/** A descriptive message providing more information about the response. */
			info: string;
			/** The maximum number of passwords allowed after the upgrade. */
			max_passwords: number;
			/** The premium expiry date as a string. */
			premium_expires: string;
	  }
	| {
			/** The error code associated with the response. */
			error: Exclude<Error, Error.SUCCESS>;
			/** A descriptive message providing more information about the response. */
			info: string;
	  };

export type AccountImportPasswords =
	| {
			/** The error code associated with the response. */
			error: Error.SUCCESS;
			/** A descriptive message providing more information about the response. */
			info: string;
			/** The number of passwords successfully imported. */
			import_success: number;
			/** The number of passwords that failed to import. */
			import_error: number;
	  }
	| {
			/** The error code associated with the response. */
			error: Exclude<Error, Error.SUCCESS>;
			/** A descriptive message providing more information about the response. */
			info: string;
	  };
