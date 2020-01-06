import { expect } from 'chai';
import sinon from 'sinon';

import { NotFoundError, UserError, ErrorCode } from '../utils/errors';
import handleError from './handleError';

describe('middleware/handleError', () => {
  it('should invoke ctx.fail on user errors', async () => {
    const error = new UserError();
    const mockNext = sinon.fake.rejects(error);
    const mockCtx: any = {
      fail: sinon.fake(),
      error: sinon.fake(),
    };

    await handleError(mockCtx, mockNext);

    expect(mockCtx.error.callCount).to.equal(0);
    expect(mockCtx.fail.callCount).to.equal(1);
    expect(mockCtx.fail.firstCall.args[0]).to.equal(error);
  });

  it('should invoke ctx.error on server errors', async () => {
    const error = new Error();
    const mockNext = sinon.fake.rejects(error);
    const mockCtx: any = {
      fail: sinon.fake(),
      error: sinon.fake(),
    };

    await handleError(mockCtx, mockNext);

    expect(mockCtx.fail.callCount).to.equal(0);
    expect(mockCtx.error.callCount).to.equal(1);
    expect(mockCtx.error.firstCall.args[0]).to.equal(error);
  });

  it('should throw a NotFoundError when no valid route is hit', async () => {
    const mockNext = sinon.fake();
    const mockCtx: any = {
      fail: sinon.fake(),
      error: sinon.fake(),
      status: 404,
    };

    await handleError(mockCtx, mockNext);

    expect(mockCtx.fail.callCount).to.equal(1);
    expect(mockCtx.error.callCount).to.equal(0);
    expect(mockCtx.fail.firstCall.args[0]).to.be.an.instanceof(NotFoundError);
    expect(mockCtx.fail.firstCall.args[0]).to.have.property('errorCode', ErrorCode.E_40401);
  });
});
