import { User } from '../api/user/types';

export type ServiceArg = {
  auth?: User;
}

export type ServiceArgWithInput<Input> = {
  input?: Input;
} & ServiceArg;

export type ServiceArgWithResource<Resource> = {
  resource?: Resource;
} & ServiceArg;

export type ServiceArgWithBoth<Input, Resource> = ServiceArgWithInput<Input> | ServiceArgWithResource<Resource>;
