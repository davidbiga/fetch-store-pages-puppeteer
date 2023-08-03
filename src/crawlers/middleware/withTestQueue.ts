
import { createMiddleware } from './middleware';
import { PageTaskArgs } from '../../index';

export const withTestQueue = createMiddleware(
  async (args: PageTaskArgs<any & { queueHandle: any[]; }>) => {
    args.data.queue = async (data: any, taskFunction: any) => {
      args.data.queueHandle.push({ data, function: taskFunction.name });
    }
    return args;
  }
);