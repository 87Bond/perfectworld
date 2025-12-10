// wm_splash_skip.js
// 通用性脚本：尽量保守地移除可能的广告字段，不破坏其它字段
let body = $response && $response.body;
if (!body) { $done({}); }

try {
  let obj = JSON.parse(body);

  if (obj && typeof obj === 'object') {
    // 如果有 data，优先处理广告相关字段
    if (obj.data && typeof obj.data === 'object') {
      // 常见广告字段名 - 批量删除以减少属性访问
      const adFields = ['ad', 'ads', 'splash', 'advert', 'launchAd', 'openAd', 'adsInfo', 'ad_list', 'launch_ad', 'banner', 'popup'];
      for (let i = 0; i < adFields.length; i++) {
        delete obj.data[adFields[i]];
      }
      
      // 清空可能的数组
      if (Array.isArray(obj.data.items)) obj.data.items = [];
      if (Array.isArray(obj.data.list)) obj.data.list = [];
      
      // 优化模块过滤 - 缓存字符串操作结果
      if (Array.isArray(obj.data.modules)) {
        obj.data.modules = obj.data.modules.filter(m => {
          if (!m) return true;
          const typeStr = (m.type || m.module_type || m.name || '').toString().toLowerCase();
          return !(typeStr.includes('ad') || typeStr.includes('splash') || typeStr.includes('launch') || typeStr.includes('open'));
        });
      }
    }

    // 如果顶层直接包含广告信息，亦尝试清空
    const topAdFields = ['ad', 'ads', 'splash', 'advert', 'adInfo'];
    for (let i = 0; i < topAdFields.length; i++) {
      delete obj[topAdFields[i]];
    }
  }

  $done({ body: JSON.stringify(obj) });
} catch (e) {
  // JSON 解析失败，直接放行原始响应
  $done({});
}
