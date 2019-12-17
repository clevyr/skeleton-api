import Router from 'koa-router';
import messageController from './controller';

export class MessageRouter {
  public router: Router = new Router({ prefix: '/messages' });

  constructor() {
    this.router
      .get(   '/',           messageController.getMessages.bind(messageController))
      .post(  '/',           messageController.createMessage.bind(messageController))
      .get(   '/:messageId', messageController.getMessage.bind(messageController))
      .put(   '/:messageId', messageController.updateMessage.bind(messageController))
      .delete('/:messageId', messageController.deleteMessage.bind(messageController));
  }
}

export default new MessageRouter();
