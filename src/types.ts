import type { Error } from "./errors";

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

export type ServerInfoResponse =
	| {
			/** Indicates a successful operation with Error.SUCCESS. */
			error: Error.SUCCESS;
			/** A descriptive message providing details about the success. */
			info: string;
			version: string;
			location: string;
			users: number;
			maxUsers: number;
			passwords: number;
			maxPasswords: number;
			hashingCost: number;
	  }
	| {
			/** Indicates an error occurred with an Error value other than SUCCESS. */
			error: Exclude<Error, Error.SUCCESS>;
			/** A descriptive message providing details about the error. */
			info: string;
	  };

export type ServerStatsResponse =
	| {
			/** Indicates a successful operation with Error.SUCCESS. */
			error: Error.SUCCESS;
			/** A descriptive message providing details about the success. */
			info: string;
			cpu: number;
			cores: number;
			memoryUsed: number;
			memoryTotal: number;
			diskUsed: number;
			diskTotal: number;
	  }
	| {
			/** Indicates an error occurred with an Error value other than SUCCESS. */
			error: Exclude<Error, Error.SUCCESS>;
			/** A descriptive message providing details about the error. */
			info: string;
	  };

export type ServerReportResponse =
	| {
			/** Indicates a successful operation with Error.SUCCESS. */
			error: Error.SUCCESS;
			/** A descriptive message providing details about the success. */
			info: string;
			activeUsers: number;
			results: {
				date: string;
				newcomers: number;
			}[];
	  }
	| {
			/** Indicates an error occurred with an Error value other than SUCCESS. */
			error: Exclude<Error, Error.SUCCESS>;
			/** A descriptive message providing details about the error. */
			info: string;
	  };

export type AccountTokenResponse =
	| {
			/** Indicates a successful operation with Error.SUCCESS. */
			error: Error.SUCCESS | Error.NO_SAVED_PASSWORDS;
			/** A descriptive message providing details about the success. */
			info: string;
			token: string;
			auth: boolean;
			yubico: string;
			max_passwords: number;
			premium_expires: number;
			passwords: Password[];
	  }
	| {
			/** Indicates an error occurred with an Error value other than SUCCESS. */
			error: Exclude<Error, Error.SUCCESS | Error.NO_SAVED_PASSWORDS>;
			/** A descriptive message providing details about the error. */
			info: string;
	  };

export type AccountPasswordsResponse =
	| {
			/** Indicates a successful operation with Error.SUCCESS. */
			error: Error.SUCCESS | Error.NO_SAVED_PASSWORDS;
			/** A descriptive message providing details about the success. */
			info: string;
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
			secret: string;
			qrcode: string;
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
			yubico: string;
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
			max_passwords: number;
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
			import_success: number;
			import_error: number;
	  }
	| {
			/** The error code associated with the response. */
			error: Exclude<Error, Error.SUCCESS>;
			/** A descriptive message providing more information about the response. */
			info: string;
	  };
