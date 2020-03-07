import Joi from '@hapi/joi';

import { ServiceArg, ServiceArgWithInput } from '../../types/service';
import { ErrorCode, UnauthorizedError, UserError } from '../../utils/errors';
import { Logger } from '../../utils/logger';
import userModel from '../user/model';
import { SerializedUser } from '../user/types';
import { serializeUser } from '../user/utils';
import { LoginInput } from './types';
import { comparePassword } from './utils';

export class AuthService {
  private logger = new Logger('AuthService');

  public async login({ input }: ServiceArgWithInput<LoginInput>): Promise<SerializedUser> {
    this.logger.verbose('login(', input, ')');

    await this.validateLogin({ input });

    const user = await userModel.getUserByEmail(input.email);
    const serializedUser = serializeUser(user);

    return serializedUser;
  }

  private async validateLogin({ input }: ServiceArgWithInput<LoginInput>) {
    try {
      Joi.assert(input, Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }), {
        abortEarly: false,
        errors: {
          label: false,
        },
      });
    } catch (error) {
      throw new UserError({ errorCode: ErrorCode.E_40002, message: 'Validation Error', data: error });
    }

    const { email, password } = input;

    const user = await userModel.getUserByEmail(email);
    if (!user) throw new UserError({ errorCode: ErrorCode.E_40003, message: 'Invalid auth credentials' });

    if (!await comparePassword(password, user.password)) {
      throw new UserError({ errorCode: ErrorCode.E_40004, message: 'Invalid auth credentials' });
    }
  }

  public getAuthenticated({ auth }: ServiceArg): SerializedUser {
    if (!auth) throw new UnauthorizedError();

    return serializeUser(auth);
  }
}

export default new AuthService();
