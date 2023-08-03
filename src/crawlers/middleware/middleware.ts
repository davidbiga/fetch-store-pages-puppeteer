import { TaskFunction } from 'puppeteer-cluster/dist/Cluster';
import { PageTaskArgs } from '../../index';

export type Middleware<T> = (
  func: (args: PageTaskArgs<T>) => Promise<void>,
) => (args: PageTaskArgs<T>) => Promise<void>;

export type QueueFunction = (
  data: any,
  taskFunction?: TaskFunction<any, any>
) => Promise<void>;

export function createMiddleware<T>(
  transform?: (args: PageTaskArgs<T>) => Promise<PageTaskArgs<T>>,
): Middleware<T> {
  return (func) => {
    const newFunction = async (
      args: PageTaskArgs<T>,
    ) => {
      if (transform) {
        args = await transform(args);
      }
      return func(args);
    };
    return newFunction;
  }

}