import { expect } from 'chai';
import request from 'supertest';

import api from '../../index.spec';
import { ErrorCode } from '../../utils/errors';
import { users } from '../../database/seeds/test/initial';
import { randomUser } from '../user/utils';
import { createAuthToken } from './utils';

describe('AuthController', () => {
  describe('.authenticate', () => {
    it('should return a JWT auth token', async () => {
      const user = users['AuthController.authenticate.1'];
      const res = await request(api)
        .post('/api/auth')
        .send({
          email: user.email,
          password: user.password,
        });
      const { status, data } = res.body;

      expect(res.status).to.equal(200);
      expect(status).to.equal('success');
      expect(data).to.be.a('string');
      expect(data).to.have.lengthOf.at.least(100);
    });

    it('should fail if no email is provided', async () => {
      const user = users['AuthController.authenticate.2'];
      const res = await request(api)
        .post('/api/auth')
        .send({
          password: user.password,
        });
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(400);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40002);
    });

    it('should fail if no password is provided', async () => {
      const user = users['AuthController.authenticate.2'];
      const res = await request(api)
        .post('/api/auth')
        .send({
          email: user.email,
        });
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(400);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40002);
    });

    it('should fail if the email provided is not a valid account', async () => {
      const user = users['AuthController.authenticate.2'];
      const res = await request(api)
        .post('/api/auth')
        .send({
          email: 'invalid@test.com',
          password: user.password,
        });
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(400);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40003);
    });

    it('should fail if the password does not match', async () => {
      const user = users['AuthController.authenticate.2'];
      const res = await request(api)
        .post('/api/auth')
        .send({
          email: user.email,
          password: 'unmatchingPassword',
        });
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(400);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40004);
    });
  });

  describe('.getAuthenticated', () => {
    it('should return the user for whom the auth token is assoicated with', async () => {
      const user = users['AuthController.getAuthenticated.1'];
      const res = await request(api)
        .get('/api/auth')
        .set('Authorization', `Bearer ${user.authToken}`);
      const { status, data } = res.body;

      expect(res.status).to.equal(200);
      expect(status).to.equal('success');
      expect(data).to.eql({
        email: user.email,
        name: user.name,
        id: user.id,
        status: 'active',
      });
    });

    it('should fail for unauthorized requests', async () => {
      const res = await request(api)
        .get('/api/auth');
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(401);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40101);
    });

    it('should fail for invalid tokens', async () => {
      const res = await request(api)
        .get('/api/auth')
        .set('Authorization', 'Bearer invalidtoken');
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(401);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40103);
    });

    it('should fail for invalid token format', async () => {
      const res = await request(api)
        .get('/api/auth')
        .set('Authorization', 'invalidtokenformat');
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(401);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40102);
    });

    it('should fail for invalid token Scheme', async () => {
      const res = await request(api)
        .get('/api/auth')
        .set('Authorization', 'InvalidScheme invalidToken');
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(401);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40102);
    });

    it('should fail if an invalid user is encoded', async () => {
      const user = randomUser();
      const authToken = createAuthToken(user);
      const res = await request(api)
        .get('/api/auth')
        .set('Authorization', `Bearer ${authToken}`);
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(401);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40104);
    });
  });
});
