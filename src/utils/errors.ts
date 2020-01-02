import { STATUS_CODES } from 'http';

/*
  40000 UserError
    40001 UserController.validateCreateUser - Joi error
    40002 UserController.validateUpdateUser - Joi error
    40003 AuthController.validateAuthenticate - Joi error
    40004 AuthController.validateAuthenticate - Invalid email provided
    40005 AuthController.validateAuthenticate - Password does not match
    40006 SupportController.validateSendFeedback - Joi error
    40007 SupportController.validateSendSupport - Joi error
    40008 DocumentController.validateCreateDocument - Joi error
    40009 DocumentController.validateUpdateDocument - Joi error
    40010 UserController.validateConfirmUserEmail - Joi error
    40011 UserController.validateConfirmUserEmail - Key expired
    40012 UserController.validateConfirmUserEmail - User not pending
    40013 UserController.validateRequestForgotPasswordKey - Joi error
    40014 UserController.validateResetPasswordWithKey - Joi error
    40015 UserController.validateResetPasswordWithKey - Key expired
    40016 UserController.validateConfirmUserEmail - Invalid Key type
    40017 UserController.validateResetPasswordWithKey - Invalid Key type

  40100 UnauthorizedError
   40101 middleware/isAuth - No auth header found
   40102 middleware/isAuth - Invalid auth header format
   40103 middleware/isAuth - Corrupted token
   40104 middleware/isAuth - Invalid user ID in token
   40105 UserController.validateUpdateUser - User is not self
   40106 DocumentController.validateGetDocument - User doesn't have permission
   40107 DocumentController.validateUpdateDocument - User doesn't have permission
   40108 DocumentController.validateDestroyDocument - User doesn't have permission

  40400 NotFoundError
    40401 middleware/handleError - When invalid route is hit
    40402 UserController.validateUpdateUser - Invalid userId param
    40403 DocumentController.validateGetDocument - Invalid documentId param
    40404 DocumentController.validateUpdateDocument - Invalid documentId param
    40405 DocumentController.validateDestroyDocument - Invalid documentId param
    40406 UserController.validateConfirmUserEmail - Invalid tempKey
    40407 UserController.validateRequestForgotPasswordKey - Invalid user email
    40408 UserController.validateResetPasswordWithKey - Invalid tempKey

  40900 ConflictError
    40901 UserController.validateCreateUser - Email in use
    40902 UserController.validateCreateUser - Username in use
    40903 UserController.validateUpdateUser - Email in use
    40904 UserController.validateUpdateUser - Username in use

  50000 BaseError
*/

interface ErrorOpts {
  name?: string;
  message?: string;
  errorCode?: number;
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
      errorCode: 50000,
      httpStatus: 500,
    }, opts);
  }
}

export class UserError extends BaseError {
  constructor(opts?: ErrorOpts) {
    super(Object.assign({
      name: 'UserError',
      errorCode: 40000,
      httpStatus: 400,
    }, opts));
  }
}

export class UnauthorizedError extends UserError {
  constructor(opts?: ErrorOpts) {
    super(Object.assign({
      name: 'UnauthorizedError',
      errorCode: 40100,
      httpStatus: 401,
    }, opts));
  }
}

export class NotFoundError extends UserError {
  constructor(opts?: ErrorOpts) {
    super(Object.assign({
      name: 'NotFoundError',
      errorCode: 40400,
      httpStatus: 404,
    }, opts));
  }
}

export class ConflictError extends UserError {
  constructor(opts?: ErrorOpts) {
    super(Object.assign({
      name: 'ConflictError',
      errorCode: 40900,
      httpStatus: 409,
    }, opts));
  }
}
