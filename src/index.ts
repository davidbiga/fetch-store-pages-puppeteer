import { createCluster } from './cluster/cluster';
import { Cluster } from 'puppeteer-cluster';
import { log } from './logger/log';
import { Page } from 'puppeteer';
import { pageGetter } from './crawlers/pageGetter';
import { TaskFunction } from 'puppeteer-cluster/dist/Cluster';
import { withBrowserLogs } from './crawlers/middleware/withBrowserLogs';
import { sites } from './lib/sites';
import _ from 'lodash';

export type QueueFunction = (data: any, taskFunction? : TaskFunction<any, any>) => Promise<void>;

export type PageTaskArgs<T = { url: string; }> = {
  page: Page,
  data: {
    queue: QueueFunction,
  } & T;
  worker: {
    id: number;
  };
};

async function queueSite(site: string, cluster: Cluster, queue: QueueFunction) {
   cluster.queue(
    { url: site, queue },
    withBrowserLogs(pageGetter)
  );
}

export async function queueAllSites(cluster: Cluster, queue: QueueFunction) {
  log.success('QUEUEING ALL SITES');
  let sitesStack = _.shuffle(sites) as string[] | string[][];
  log.success('SHUFFLED ALL SITES');
  sitesStack = _.chunk(sitesStack as string[], 10);
  log.success('CHUNKED ALL SITES');
  while (sitesStack.length > 0) {
    const sitesStackChunk = sitesStack.pop();
    if (sitesStackChunk) {

      sitesStackChunk.forEach((site) => {
        queueSite(`${site}`, cluster, queue);
      });
      log.success('QUEUED BATCH OF SITES');
    }
    await cluster.idle();
  }
  await cluster.idle();
  log.success('FINISHED QUEUEING ALL SITES');
  await cluster.close();
  return;
}

export const main = async () => {
  // Creates instance of cluster
  const cluster: Cluster = await createCluster({});

  // Errors are logged to console
  cluster.on('taskerror', (err: Error, willRetry: boolean) => {
    log.error('Task error', err);
    if (willRetry) {
      log.error('Retrying...');
    }
  });
  cluster.on('queue', (data: any) => {
    log.info('Queued', data.url);
  });

  const queue: QueueFunction = cluster.queue.bind(cluster);

  await queueAllSites(cluster, queue);
};

main();
