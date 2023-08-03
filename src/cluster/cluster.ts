import { Cluster } from 'puppeteer-cluster';
import { log } from '../logger/log';
import puppeteer from './puppeteer';

export type ClusterCreateOptions = {
  mode?: 'development' | 'production';
  concurrency?: number;
};

export const defaultPuppeteerOptions = {
  headless: true,
  slowmo: 500,
  args: [
    `--window-size=1920,1080`,
    '--disable-dev-shm-usage'
  ],
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
};

/*
retryLimit <number> How often do you want to retry a job before marking it as failed. Ignored by tasks queued via Cluster.execute. Defaults to 0.
retryDelay <number> How much time should pass at minimum between the job execution and its retry. Ignored by tasks queued via Cluster.execute. Defaults to 0.
sameDomainDelay <number> How much time should pass at minimum between two requests to the same domain. If you use this field, the queued data must be your URL or data must be an object containing a field called url.
skipDuplicateUrls <boolean> If set to true, will skip URLs which were already crawled by the cluster. Defaults to false. If you use this field, the queued data must be your URL or data must be an object containing a field called url.
timeout <number> Specify a timeout for all tasks. Defaults to 30000 (30 seconds).
monitor <boolean> If set to true, will provide a small command line output to provide information about the crawling process. Defaults to false.
*/

export const defaultClusterOptions = {
  puppeteer: puppeteer,
  concurrency: Cluster.CONCURRENCY_CONTEXT,
  maxConcurrency: 1,
  workerCreationDelay: 2000,
  sameDomainDelay: 2000,
  retryLimit: 2,
  retryDelay: 5000,
  skipDuplicateUrls: true,
  timeout: 30000,
  monitor: false,
}

export async function createCluster(
  override?: Parameters<typeof Cluster.launch>[0],
): Promise<Cluster<any, any>> {
  return Cluster.launch({
    ...defaultClusterOptions,
    ...override,
    puppeteerOptions: {
      ...defaultPuppeteerOptions,
      ...(override ? override['puppeteerOptions'] : false),
    },
  }).then((cluster) => {
    log.info(`Created cluster with ${cluster} workers`);
    return cluster;
  }).catch((err) => {
    log.error(err);
    throw err;
  });
}
