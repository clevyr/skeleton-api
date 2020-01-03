import { expect } from 'chai';
import request from 'supertest';

import api from '../../index.spec';
import { ErrorCode } from '../../utils/errors';
import { users } from '../../database/seeds/test/initial';
import { User } from './model';
import { randomUser } from './utils';

describe('UserController', () => {
  describe('.listUsers', () => {
    it('should fail if you are not authenticated', async () => {
      const { body, status } = await request(api)
        .get('/api/users');

      expect(status).to.equal(401);
      expect(body).to.have.property('status', 'fail');
      expect(body.errorCode).to.equal(ErrorCode.E_40101);;
    });

    it('should return a list of users', async () => {
      const user = users['UserController.listUsers.1'];
      const { body, status } = await request(api)
        .get('/api/users')
        .set('Authorization', `Bearer ${user.authToken}`);

      expect(status).to.equal(200);
      expect(body).to.have.property('status', 'success');
      expect(body.data.filter((u: User) => u.email === user.email)).to.have.lengthOf(1);
    });

    it('should not return private information about each user', async () => {
      const user = users['UserController.listUsers.1'];
      const { body, status } = await request(api)
        .get('/api/users')
        .set('Authorization', `Bearer ${user.authToken}`);

      expect(status).to.equal(200);
      expect(body).to.have.property('status', 'success');
      body.data.forEach((u: User) => {
        expect(u).to.not.have.any.keys('password');
      });
    });

    it('should return the appropriate information about each user', async () => {
      const user = users['UserController.listUsers.1'];
      const { body, status } = await request(api)
        .get('/api/users')
        .set('Authorization', `Bearer ${user.authToken}`);

      expect(status).to.equal(200);
      expect(body).to.have.property('status', 'success');
      body.data.forEach((u: User) => {
        expect(u).to.have.all.keys('id', 'name', 'email', 'status');
      });
    });
  });

  describe('.createUser', () => {
    it('should create a user', async () => {
      const user = randomUser();
      const res = await request(api)
        .post('/api/users')
        .send({
          name: user.name,
          email: user.email,
          password: user.password,
        });

      const { status, data } = res.body;

      expect(res.status).to.equal(201);
      expect(status).to.equal('success');
      expect(data).to.have.all.keys(['id', 'name', 'email', 'status']);
      expect(data.name).to.equal(user.name);
      expect(data.email).to.equal(user.email);
    });

    it('should fail if no email is provided', async () => {
      const user = randomUser();
      const res = await request(api)
        .post('/api/users')
        .send({
          name: user.name,
          password: user.password,
        });
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(400);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40001);
    });

    it('should fail if no password is provided', async () => {
      const user = randomUser();
      const res = await request(api)
        .post('/api/users')
        .send({
          name: user.name,
          email: user.email,
        });
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(400);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40001);
    });

    it('should fail if the email is not an email format', async () => {
      const user = randomUser();
      const res = await request(api)
        .post('/api/users')
        .send({
          name: user.name,
          email: 'invalid',
          password: user.password,
        });
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(400);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40001);
    });

    it('should fail if the password is too short', async () => {
      const user = randomUser();
      const res = await request(api)
        .post('/api/users')
        .send({
          name: user.name,
          email: user.email,
          password: 's',
        });
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(400);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40001);
    });

    it('should fail if the email is already in use', async () => {
      const user = randomUser();
      const res = await request(api)
        .post('/api/users')
        .send({
          name: user.name,
          email: users['UserController.createUser.1'].email,
          password: user.password,
        });
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(409);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40901);
    });

    it('should fail if you specify any other properties', async () => {
      const user = randomUser();
      const res = await request(api)
        .post('/api/users')
        .send({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        });
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(400);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40001);
    });

    it('should not return any private information about the created user', async () => {
      const user = randomUser();
      const { body, status } = await request(api)
        .post('/api/users')
        .send({
          name: user.name,
          email: user.email,
          password: user.password,
        });

      expect(status).to.equal(201);
      expect(body).to.have.property('status', 'success');
      expect(body.data).to.not.have.any.keys('password');
    });
  });
});
