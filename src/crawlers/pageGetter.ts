import { PageTaskArgs } from '../index';
import fs from 'fs'
import { log } from '../logger/log';

export const pageGetter = async ({
    data: { url },
    page
}: PageTaskArgs): Promise<void> => {
    log.info(`DataGetter: going to ${url}`);
    await page.goto(url, {
        waitUntil: 'domcontentloaded',
    });
    log.success(`DataGetter: ${url} ${page.url()}`);

    let source = await page.content();

    const hrefs = await page.$$eval('a', (El) => El.map((el) => el.getAttribute('href')))
    log.info(`DataGetter links found: ${hrefs.length}`)

    const images = await page.$$eval('img', (El) => El.map((el) => el.getAttribute('src')))
    log.info(`DataGetter images found: ${images.length}`)
    let domain = (new URL(url));
    await fs.writeFileSync(`./saved_sites/${domain.hostname}.html`, source);
    await page.screenshot({ path: `./saved_sites/${domain.hostname}.png` });

    log.info(`DataGetter last fetch: ${new Date}`)

    return;
}
