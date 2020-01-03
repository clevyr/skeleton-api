import { expect } from 'chai';
import request from 'supertest';

import api from '../../index.spec';
import { ErrorCode } from '../../utils/errors';

describe('UserController', () => {
  describe('.listUsers', () => {
    it('should fail if you are not authenticated', async () => {
      const { body, status } = await request(api)
        .get('/api/users');

      expect(status).to.equal(401);
      expect(body).to.have.property('status', 'fail');
      expect(body.errorCode).to.equal(ErrorCode.E_40101);;
    });
  });
});
