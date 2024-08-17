import axios from 'axios';
import { NoProxyError } from '../errors.js';
import { HttpsProxyAgent } from 'https-proxy-agent';

class ProxyService {
  constructor() {
    this.apiUrl = process.env.PROXY_LIST_URL;
    this.activeProxy = {};
    this.proxyList = [];
  }

  async refreshProxyList() {
    if (!this.apiUrl) return;
    try {
      const response = await axios.get(this.apiUrl);
      let proxyList = response.data.split('\r\n');
      this.proxyList.pop();
      this.proxyList = proxyList.map(proxy => this.parseProxy(proxy));
    } catch (error) {
      console.error('Failed to refresh proxy list.');
    }
  }

  async setProxy() {
    if (!this.apiUrl) return;
    const proxy = await this._getProxy();
    process.env.http_proxy = `http://${proxy.host}:${proxy.port}`;
  }

  parseProxy(proxy) {
    if (!this.apiUrl) return;
    proxy = proxy.replace('http://', '');
    const [host, port] = proxy.split(':');
    return { host: host, port: +port };
  }

  unsetProxy() {
    if (!this.apiUrl) return;
    process.env.http_proxy = '';
  }

  markActiveProxyBad() {
    if (!this.apiUrl) return;
    this._markProxyBad(this.activeProxy);
    this.activeProxy = {};
  }

  async _testProxy(proxy) {
    if (!this.apiUrl) return;
    const testUrl = 'https://httpbin.org/ip';
    try {
      console.log('Testing proxy:', proxy);
      const agent = new HttpsProxyAgent(`http://${proxy.host}:${proxy.port}`);
      await axios.get(testUrl, {
        agent,
        timeout: 5000
      });
      console.log('Proxy passed test');
      return true;
    } catch (error) {
      console.error('Proxy failed test:', error);
      return false;
    }
  }

  async _getProxy(raise = false) {
    if (!this.apiUrl) return;
    if (this.activeProxy.host && (await this._testProxy(this.activeProxy))) {
      return this.activeProxy;
    }

    let failedAttempts = 0;
    let max = this.proxyList.length;
    while (failedAttempts < max) {
      const randomIndex = Math.floor(Math.random() * this.proxyList.length);
      const randomProxy = this.proxyList[randomIndex];
      if (await this._testProxy(randomProxy)) {
        this.activeProxy = randomProxy;
        return randomProxy;
      } else {
        this._markProxyBad(randomProxy);
        failedAttempts++;
      }
    }

    if (raise) {
      // throw a special error if we couldn't find a working proxy to end the program
      throw new NoProxyError('No working proxies found');
    }

    await this.refreshProxyList();
    return this._getProxy(true);
  }

  _markProxyBad(proxy) {
    if (!this.apiUrl) return;
    this.proxyList = this.proxyList.filter(p => p !== proxy);
  }
}

export default new ProxyService();
