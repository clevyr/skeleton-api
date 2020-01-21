import { STATUS_CODES } from 'http';

export enum ErrorCode {
  E_40000 = 'E_40000',
  E_40001 = 'E_40001', // UserController.validateCreateUser - Joi Error
  E_40002 = 'E_40002', // AuthController.validateAuthenticate - Joi error
  E_40003 = 'E_40003', // AuthController.validateAuthenticate - Invalid email provided
  E_40004 = 'E_40004', // AuthController.validateAuthenticate - Password does not match
  E_40005 = 'E_40005', // UserController.validateUpdateUser - Joi Error
  E_40006 = 'E_40006', // NoteController.validateCreateNote - Joi Error
  E_40007 = 'E_40007', // NoteController.validateUpdateNote - Joi Error

  E_40100 = 'E_40100',
  E_40101 = 'E_40101', // middleware/isAuth - No auth header or cookie found
  E_40102 = 'E_40102', // middleware/isAuth - Invalid auth header format
  E_40103 = 'E_40103', // middleware/isAuth - Corrupted token
  E_40104 = 'E_40104', // middleware/isAuth - Invalid user ID in token
  E_40105 = 'E_40105', // middleware/isResolvedUserMe - User is not self
  E_40106 = 'E_40106', // middleware/isResolvedNoteMine - Note Author is not self

  E_40400 = 'E_40400',
  E_40401 = 'E_40401', // middleware/handleError - When invalid route is hit
  E_40402 = 'E_40402', // middleware/resolveUser - Invalid userId param
  E_40403 = 'E_40403', // middleware/resolveNote - Invalid noteId param

  E_40900 = 'E_40900',
  E_40901 = 'E_40901', // UserController.validateCreateUser - Email in use
  E_40902 = 'E_40902', // UserController.validateUpdateUser - Email in use

  // These are "just in case" error codes, they should only be thrown because of programmer error. Still good to have for debugging.
  E_50000 = 'E_50000',
  E_50001 = 'E_50001', // middleware/isResolvedUserMe - User not resolved
  E_50002 = 'E_50002', // middleware/isResolvedUserMe - Not authenticated
  E_50003 = 'E_50003', // middleware/isResolvedNoteMine - Note not resolved
  E_50004 = 'E_50004', // middleware/isResolvedNoteMine - Not authenticated
}

interface ErrorOpts {
  name?: string;
  message?: string;
  errorCode?: ErrorCode;
  httpStatus?: number;
  data?: any;
}

export class BaseError extends Error {
  constructor(opts?: ErrorOpts) {
    super(opts.message || STATUS_CODES[opts.httpStatus || 500]);
    Error.captureStackTrace(this, this.constructor);
    Object.assign(this, {
      name: 'BaseError',
      message: STATUS_CODES[opts.httpStatus || 500],
      errorCode: ErrorCode.E_50000,
      httpStatus: 500,
    }, opts);
  }
}

export class UserError extends BaseError {
  constructor(opts?: ErrorOpts) {
    super(Object.assign({
      name: 'UserError',
      errorCode: ErrorCode.E_40000,
      httpStatus: 400,
    }, opts));
  }
}

export class UnauthorizedError extends UserError {
  constructor(opts?: ErrorOpts) {
    super(Object.assign({
      name: 'UnauthorizedError',
      errorCode: ErrorCode.E_40100,
      httpStatus: 401,
    }, opts));
  }
}

export class NotFoundError extends UserError {
  constructor(opts?: ErrorOpts) {
    super(Object.assign({
      name: 'NotFoundError',
      errorCode: ErrorCode.E_40400,
      httpStatus: 404,
    }, opts));
  }
}

export class ConflictError extends UserError {
  constructor(opts?: ErrorOpts) {
    super(Object.assign({
      name: 'ConflictError',
      errorCode: ErrorCode.E_40900,
      httpStatus: 409,
    }, opts));
  }
}
