import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';

const enabledEvasions = StealthPlugin().availableEvasions

enabledEvasions.delete('iframe.contentWindow');

const stealthPlugin = StealthPlugin();
puppeteer.use(stealthPlugin);

puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

export default puppeteer;
