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
        .get('/users');

      expect(status).to.equal(401);
      expect(body).to.have.property('status', 'fail');
      expect(body.errorCode).to.equal(ErrorCode.E_40101);;
    });

    it('should return a list of users', async () => {
      const user = users['UserController.listUsers.1'];
      const { body, status } = await request(api)
        .get('/users')
        .set('Authorization', `Bearer ${user.authToken}`);

      expect(status).to.equal(200);
      expect(body).to.have.property('status', 'success');
      expect(body.data.filter((u: User) => u.email === user.email)).to.have.lengthOf(1);
    });

    it('should not return private information about each user', async () => {
      const user = users['UserController.listUsers.1'];
      const { body, status } = await request(api)
        .get('/users')
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
        .get('/users')
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
        .post('/users')
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
        .post('/users')
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
        .post('/users')
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
        .post('/users')
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
        .post('/users')
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
        .post('/users')
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
        .post('/users')
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
        .post('/users')
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

  describe('.getUser', () => {
    it('should return a users information', async () => {
      const user = users['UserController.getUser.1'];
      const res = await request(api)
        .get(`/users/${user.id}`)
        .set('Authorization', `Bearer ${user.authToken}`);
      const { status, data } = res.body;

      expect(res.status).to.equal(200);
      expect(status).to.equal('success');
      expect(data).to.eql({
        id: user.id,
        email: user.email,
        name: user.name,
        status: user.status,
      });
    });

    it('should fail if an invalid user is specified', async () => {
      const user = users['UserController.getUser.1'];
      const invalidUser = randomUser();
      const res = await request(api)
        .get(`/users/${invalidUser.id}`)
        .set('Authorization', `Bearer ${user.authToken}`);
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(404);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40402);
    });

    it('should fail if the user is not authenticated', async () => {
      const user1 = users['UserController.getUser.1'];
      const res = await request(api)
        .get(`/users/${user1.id}`);
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(401);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40101);
    });

    it('should fail if the user is not the one authenticated', async () => {
      const user1 = users['UserController.getUser.1'];
      const user2 = users['UserController.getUser.2'];
      const res = await request(api)
        .get(`/users/${user1.id}`)
        .set('Authorization', `Bearer ${user2.authToken}`);
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(401);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40105);
    });
  });

  describe('.updateUser', () => {
    it('should update a user\'s information', async () => {
      const newProps = randomUser();
      const user = users['UserController.updateUser.1'];
      const res = await request(api)
        .put(`/users/${user.id}`)
        .send({
          name: newProps.name,
        })
        .set('Authorization', `Bearer ${user.authToken}`);
      const { status, data } = res.body;

      expect(res.status).to.equal(200);
      expect(status).to.equal('success');
      expect(data).to.eql({
        id: user.id,
        name: newProps.name,
        email: user.email,
        status: 'active',
      });
    });

    it('should make a user pending if they input a new email', async () => {
      const newProps = randomUser();
      const user = users['UserController.updateUser.5'];
      const res = await request(api)
        .put(`/users/${user.id}`)
        .send({
          email: newProps.email,
        })
        .set('Authorization', `Bearer ${user.authToken}`);
      const { status, data } = res.body;

      expect(res.status).to.equal(200);
      expect(status).to.equal('success');
      expect(data).to.eql({
        id: user.id,
        name: user.name,
        email: newProps.email,
        status: 'pending',
      });
    });

    it('should not make a user pending if they input the same email', async () => {
      const user = users['UserController.updateUser.6'];
      const res = await request(api)
        .put(`/users/${user.id}`)
        .send({
          email: user.email,
        })
        .set('Authorization', `Bearer ${user.authToken}`);
      const { status, data } = res.body;

      expect(res.status).to.equal(200);
      expect(status).to.equal('success');
      expect(data).to.eql({
        id: user.id,
        name: user.name,
        email: user.email,
        status: 'active',
      });
    });

    it('should fail if an invalid user is specified', async () => {
      const user = users['UserController.updateUser.1'];
      const newProps = randomUser();
      const res = await request(api)
        .put(`/users/${newProps.id}`)
        .send({
          name: newProps.name,
        })
        .set('Authorization', `Bearer ${user.authToken}`);
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(404);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40402);
    });

    it('should fail if the user is not authenticated', async () => {
      const user1 = users['UserController.updateUser.1'];
      const newProps = randomUser();
      const res = await request(api)
        .put(`/users/${user1.id}`)
        .send({
          name: newProps.name,
        });
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(401);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40101);
    });

    it('should fail if the user being changed is not the one authenticated', async () => {
      const user1 = users['UserController.updateUser.1'];
      const user2 = users['UserController.updateUser.2'];
      const newProps = randomUser();
      const res = await request(api)
        .put(`/users/${user1.id}`)
        .send({
          name: newProps.name,
        })
        .set('Authorization', `Bearer ${user2.authToken}`);
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(401);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40105);
    });

    it('should fail if the email is not an email format', async () => {
      const user = users['UserController.updateUser.2'];
      const res = await request(api)
        .put(`/users/${user.id}`)
        .send({
          email: 'invalid',
        })
        .set('Authorization', `Bearer ${user.authToken}`);
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(400);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40005);
    });

    it('should fail if the password is too short', async () => {
      const user = users['UserController.updateUser.2'];
      const res = await request(api)
        .put(`/users/${user.id}`)
        .send({
          password: 'short',
        })
        .set('Authorization', `Bearer ${user.authToken}`);
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(400);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40005);
    });

    it('should fail if the email is already in use', async () => {
      const user = users['UserController.updateUser.2'];
      const res = await request(api)
        .put(`/users/${user.id}`)
        .send({
          email: users['UserController.updateUser.3'].email,
        })
        .set('Authorization', `Bearer ${user.authToken}`);
      const { status, errorCode } = res.body;

      expect(res.status).to.equal(409);
      expect(status).to.equal('fail');
      expect(errorCode).to.equal(ErrorCode.E_40902);
    });

    it('should be fine if the user\'s existing properties are passed in', async () => {
      const user = users['UserController.updateUser.2'];
      const res = await request(api)
        .put(`/users/${user.id}`)
        .send({
          name: user.name,
          email: user.email,
          password: user.password,
        })
        .set('Authorization', `Bearer ${user.authToken}`);
      const { status, data } = res.body;

      expect(res.status).to.equal(200);
      expect(status).to.equal('success');
      expect(data).to.eql({
        id: user.id,
        name: user.name,
        email: user.email,
        status: 'active',
      });
    });

    it('should rehash the password so that they can successfully reauthenticate', async () => {
      const user = users['UserController.updateUser.4'];
      const newProps = randomUser();
      const res1 = await request(api)
        .put(`/users/${user.id}`)
        .send({
          password: newProps.password,
        })
        .set('Authorization', `Bearer ${user.authToken}`);

      expect(res1.status).to.equal(200);
      expect(res1.body.status).to.equal('success');

      const res2 = await request(api)
        .post('/auth')
        .send({
          email: user.email,
          password: newProps.password,
        });

      expect(res2.status).to.equal(200);
      expect(res2.body.status).to.equal('success');
    });
  });

  describe('.deleteUser', () => {
    it('should fail because it is not implemented', async () => {
      const user = users['UserController.deleteUser.1'];
      const res = await request(api)
        .delete(`/users/${user.id}`)
        .set('Authorization', `Bearer ${user.authToken}`);
      const { status } = res.body;

      expect(res.status).to.equal(500);
      expect(status).to.equal('error');
    });
  });
});
