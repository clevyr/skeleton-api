import 'mocha';

import { expect } from 'chai';
import config from 'config';
import sinon from 'sinon';

import { BaseError, ErrorCode, UserError } from '../utils/errors';
import jsend from './jsend';

describe('middleware/jsend', () => {
  it('should attach appropriate methods to ctx', async () => {
    const mockNext = sinon.fake();
    const mockCtx: any = {};
    await jsend(mockCtx, mockNext);

    expect(mockNext.callCount).to.equal(1);
    expect(mockCtx.success).to.be.a('function');
    expect(mockCtx.fail).to.be.a('function');
    expect(mockCtx.error).to.be.a('function');
  });

  describe('.success', () => {
    it('should format the response appropriately', async () => {
      const mockNext = sinon.fake();
      const mockCtx: any = {
        status: 404,
        body: {},
      };
      await jsend(mockCtx, mockNext);

      mockCtx.success({ httpStatus: 201, data: { test: 'test' } });
      expect(mockCtx.status).to.equal(201);
      expect(mockCtx.body).to.eql({
        status: 'success',
        data: {
          test: 'test',
        },
      });
    });

    it('should be fine if no properties are passed in', async () => {
      const mockNext = sinon.fake();
      const mockCtx: any = {
        status: 404,
        body: {},
      };
      await jsend(mockCtx, mockNext);

      mockCtx.success();

      expect(mockCtx.status).to.equal(200);
      expect(mockCtx.body).to.eql({
        status: 'success',
        data: undefined,
      });
    });
  });

  describe('.fail', () => {
    it('should format the response appropriately', async () => {
      const error = new UserError({ httpStatus: 401, message: 'Test User Error', errorCode: ErrorCode.E_40100, data: { test: 'test' } });
      const mockNext = sinon.fake();
      const mockCtx: any = {
        status: 404,
        body: {},
      };
      await jsend(mockCtx, mockNext);

      mockCtx.fail(error);
      expect(mockCtx.status).to.equal(401);
      expect(mockCtx.body).to.eql({
        status: 'fail',
        errorCode: ErrorCode.E_40100,
        message: 'Test User Error',
        stack: error.stack,
        data: {
          test: 'test',
        },
      });
    });

    it('should be fine if no properties are passed in', async () => {
      const mockNext = sinon.fake();
      const mockCtx: any = {
        status: 404,
        body: {},
      };
      await jsend(mockCtx, mockNext);

      mockCtx.fail();
      expect(mockCtx.status).to.equal(400);
      expect(mockCtx.body).to.eql({
        status: 'fail',
        message: 'Bad Request',
        errorCode: undefined,
        data: undefined,
      });
    });

    it('should hide appropriate information if config does not expose errors', async () => {
      const error = new UserError({ httpStatus: 401, message: 'Test User Error', errorCode: ErrorCode.E_40100, data: { test: 'test' } });
      const mockNext = sinon.fake();
      const mockCtx: any = {
        status: 404,
        body: {},
      };
      await jsend(mockCtx, mockNext);

      sinon.stub(config, 'get').returns(false);
      mockCtx.fail(error);
      (config.get as any).restore();

      expect(mockCtx.status).to.equal(401);
      expect(mockCtx.body).to.eql({
        status: 'fail',
        errorCode: ErrorCode.E_40100,
        message: 'Test User Error',
        data: {
          test: 'test',
        },
      });
    });
  });

  describe('.error', () => {
    it('should format the response appropriately', async () => {
      const error = new BaseError({ httpStatus: 500, message: 'Test Server Error', errorCode: ErrorCode.E_50000, data: { test: 'test' } });
      const mockNext = sinon.fake();
      const mockCtx: any = {
        status: 404,
        body: {},
      };
      await jsend(mockCtx, mockNext);

      mockCtx.error(error);
      expect(mockCtx.status).to.equal(500);
      expect(mockCtx.body).to.eql({
        status: 'error',
        errorCode: ErrorCode.E_50000,
        message: 'Test Server Error',
        stack: error.stack,
        data: {
          test: 'test',
        },
      });
    });

    it('should be fine if no properties are passed in', async () => {
      const mockNext = sinon.fake();
      const mockCtx: any = {
        status: 404,
        body: {},
      };
      await jsend(mockCtx, mockNext);

      mockCtx.error();
      expect(mockCtx.status).to.equal(500);
      expect(mockCtx.body).to.eql({
        status: 'error',
        message: 'Internal Server Error',
        stack: undefined,
        errorCode: undefined,
        data: undefined,
      });
    });

    it('should handle arbitrary errors', async () => {
      const error = new Error('Random Failure Message');
      const mockNext = sinon.fake();
      const mockCtx: any = {
        status: 404,
        body: {},
      };
      await jsend(mockCtx, mockNext);

      mockCtx.error(error);
      expect(mockCtx.status).to.equal(500);
      expect(mockCtx.body).to.eql({
        status: 'error',
        message: 'Random Failure Message',
        stack: error.stack,
        errorCode: undefined,
        data: undefined,
      });
    });

    it('should hide appropriate information if config does not expose errors', async () => {
      const error = new BaseError({ httpStatus: 501, message: 'Test Server Error', errorCode: ErrorCode.E_50000, data: { test: 'test' } });
      const mockNext = sinon.fake();
      const mockCtx: any = {
        status: 404,
        body: {},
      };
      await jsend(mockCtx, mockNext);

      sinon.stub(config, 'get').returns(false);
      mockCtx.error(error);
      (config.get as any).restore();

      expect(mockCtx.status).to.equal(500);
      expect(mockCtx.body).to.eql({
        status: 'error',
        errorCode: ErrorCode.E_50000,
        message: 'Internal Server Error',
      });
    });
  });
});
