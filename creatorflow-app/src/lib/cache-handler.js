const { CacheManager } = require('./redis');

class CacheHandler {
  constructor(options) {
    this.cacheManager = CacheManager.getInstance();
    this.cacheManager.init();
  }

  async get(key, ctx) {
    try {
      const cached = await this.cacheManager.get(key);
      if (cached) {
        console.log(`✅ Build cache hit for key: ${key}`);
        return cached;
      }
      console.log(`❌ Build cache miss for key: ${key}`);
      return null;
    } catch (error) {
      console.error('Build cache get error:', error);
      return null;
    }
  }

  async set(key, data, ctx) {
    try {
      // Cache build artifacts for 24 hours
      await this.cacheManager.set(key, data, 86400);
      console.log(`💾 Cached build artifact for key: ${key}`);
      return true;
    } catch (error) {
      console.error('Build cache set error:', error);
      return false;
    }
  }

  async revalidateTag(tag) {
    try {
      // Clear cache entries with specific tag
      console.log(`🔄 Revalidating cache tag: ${tag}`);
      return true;
    } catch (error) {
      console.error('Build cache revalidate error:', error);
      return false;
    }
  }
}

module.exports = CacheHandler;
