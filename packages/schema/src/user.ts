import gql from 'graphql-tag';
import { DocumentNode } from "graphql";

import { RestEndpoint } from "./wrappers/rest-endpoint";
import { ReadonlyDeep } from 'type-fest';
import { QueryContext } from './wrappers/database';

export enum UserType {
	USER = 0,
	ADMIN = 1,
	SERVICE = 2
}

export function userTypeToString(userType: UserType): string {
	switch (userType) {
		case UserType.USER:
			return "USER";
		case UserType.ADMIN:
			return "ADMIN";
		case UserType.SERVICE:
			return "SERVICE";
		default:
			throw new Error("Invalid user type");
	}
}

export function userTypeFromString(userType: string): UserType {
	switch (userType) {
		case "USER":
			return UserType.USER;
		case "ADMIN":
			return UserType.ADMIN;
		case "SERVICE":
			return UserType.SERVICE;
		default:
			throw new Error("Invalid user type");
	}
}

export interface UserRecord {
	id: number;
	uuid: string;
	username: string;
	name: string | null;
	email: string;
	passwordHash: string | null;
	created: Date;
}

/**
 * Version of {@link UserRecord} that the client will be exposed to.
 * 
 * ***Example:*** passwordHash should not be sent to any client ever.
 */
export type ClientUserRecord = Pick<UserRecord, 'username' | 'name' | 'email' | 'created'>;

export type UserRecordInsertRequiredFields = Pick<UserRecord, 'username' | 'email'>;
export type UserRecordInsertOptionalFields = Pick<UserRecord, 'name' | 'passwordHash'>;
export type UserRecordInsertFields = UserRecordInsertOptionalFields & Partial<UserRecordInsertRequiredFields>;

export const DEFAULT_USER_RECORD_FIELDS: UserRecordInsertOptionalFields = {
	name: null,
	passwordHash: null
}

export interface UserQueryFunctions {
	// Standard Queries
	getById: (context: ReadonlyDeep<QueryContext>, id: number) => Promise<UserRecord | null>;
	getByUsername: (context: ReadonlyDeep<QueryContext>, username: string) => Promise<UserRecord | null>;
	getByEmail: (context: ReadonlyDeep<QueryContext>, email: string) => Promise<UserRecord | null>;

	insert: (context: ReadonlyDeep<QueryContext>, userRecord: UserRecordInsertRequiredFields) => Promise<UserRecord>;
	update: (context: ReadonlyDeep<QueryContext>, userRecord: UserRecord) => Promise<UserRecord>;
	delete: (context: ReadonlyDeep<QueryContext>, id: number) => Promise<void>;
}



export const UserGQL: DocumentNode = gql`
`;



export module UserRestApi {
	/**
	 * [GET] /users/:uuid_or_username
	 */
	export type GetUser = RestEndpoint<{}, undefined, ClientUserRecord>;

	/**
	 * [POST] /users
	 */
	export type CreateUser = RestEndpoint<{}, Pick<UserRecordInsertFields, 'username' | 'email' | 'name'>, ClientUserRecord>;

	 /**
	 * [POST] /users/:id
	 */
	export type UpdateUser = RestEndpoint<{}, Pick<UserRecordInsertFields, 'name'>, ClientUserRecord>;

	/**
	 * [POST] /users/:id/password
	 */
	export type ChangeUserPassword = RestEndpoint<{}, {
		password: string;
	}, ClientUserRecord>;

	/**
	 * [POST] /users/:id/email
	 */
	export type ChangeUserEmail = RestEndpoint<{}, {
		password: string;
	}, ClientUserRecord>;
}
