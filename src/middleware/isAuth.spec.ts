import { expect } from 'chai';
import sinon from 'sinon';

import { ErrorCode, UnauthorizedError } from '../utils/errors';
import isAuth from './isAuth';
import { createAuthToken } from '../api/auth/utils';
import { randomUser } from '../api/user/utils';
import { users } from '../database/seeds/test/initial';

describe('middleware/isAuth', () => {
  it('should fail if there is no Authorization header', async () => {
    const mockNext = sinon.fake();
    const mockCtx: any = {
      status: 404,
      body: {},
      request: {
        header: {},
      },
    };

    try {
      await isAuth(mockCtx, mockNext);

      throw Error('Should have thrown');
    } catch (error) {
      expect(error).to.be.instanceOf(UnauthorizedError);
      expect(error.errorCode).to.equal(ErrorCode.E_40101);
    }
  });

  it('should fail if the Authorization header is formated incorrectly', async () => {
    const user = randomUser();
    const token = createAuthToken(user);
    const mockNext = sinon.fake();
    const mockCtx: any = {
      status: 404,
      body: {},
      request: {
        header: {
          authorization: `Bearer${token}`,
        },
      },
    };

    try {
      await isAuth(mockCtx, mockNext);

      throw Error('Should have thrown');
    } catch (error) {
      expect(error).to.be.instanceOf(UnauthorizedError);
      expect(error.errorCode).to.equal(ErrorCode.E_40102);
    }
  });

  it('should fail if the Authorization header is prefixed incorrectly', async () => {
    const user = randomUser();
    const token = createAuthToken(user);
    const mockNext = sinon.fake();
    const mockCtx: any = {
      status: 404,
      body: {},
      request: {
        header: {
          authorization: `JWT ${token}`,
        },
      },
    };

    try {
      await isAuth(mockCtx, mockNext);

      throw Error('Should have thrown');
    } catch (error) {
      expect(error).to.be.instanceOf(UnauthorizedError);
      expect(error.errorCode).to.equal(ErrorCode.E_40102);
    }
  });

  it('should fail if the token is invalid', async () => {
    const mockNext = sinon.fake();
    const mockCtx: any = {
      status: 404,
      body: {},
      request: {
        header: {
          authorization: 'Bearer Invalid',
        },
      },
    };

    try {
      await isAuth(mockCtx, mockNext);

      throw Error('Should have thrown');
    } catch (error) {
      expect(error).to.be.instanceOf(UnauthorizedError);
      expect(error.errorCode).to.equal(ErrorCode.E_40103);
    }
  });

  it('should fail if the token does not belong to a user in the system', async () => {
    const user = randomUser();
    const token = createAuthToken(user);
    const mockNext = sinon.fake();
    const mockCtx: any = {
      status: 404,
      body: {},
      request: {
        header: {
          authorization: `Bearer ${token}`,
        },
      },
    };

    try {
      await isAuth(mockCtx, mockNext);

      throw Error('Should have thrown');
    } catch (error) {
      expect(error).to.be.instanceOf(UnauthorizedError);
      expect(error.errorCode).to.equal(ErrorCode.E_40104);
    }
  });

  it('should attach the user to the context', async () => {
    const user = users['middleware.isAuth.1'];
    const token = createAuthToken(user);
    const mockNext = sinon.fake();
    const mockCtx: any = {
      status: 404,
      body: {},
      state: {},
      request: {
        header: {
          authorization: `Bearer ${token}`,
        },
      },
    };

    await isAuth(mockCtx, mockNext);

    expect(mockCtx.state.auth).to.exist;
    expect(mockCtx.state.auth.email).to.equal(user.email);
    expect(mockCtx.state.auth.id).to.equal(user.id);
  });
});
