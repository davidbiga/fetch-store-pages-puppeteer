import { log } from '../../logger/log';
import { createMiddleware } from './middleware';
import { PageTaskArgs } from '../../index';

export const withBrowserLogs = createMiddleware(
  async (args: PageTaskArgs<any>) => {
    const page = args.page;
    page.on('console', message => {
      if (message.type().substr(0, 3).toUpperCase() === 'LOG') {
        log.warn(message.text());
      }
    });
    return args;
  }
);