// wm_splash_skip.js
// 通用性脚本：尽量保守地移除可能的广告字段，不破坏其它字段
let body = $response && $response.body;
if (!body) { $done({}); }

try {
  let obj = JSON.parse(body);

  if (obj && typeof obj === 'object') {
    // 如果有 data，优先处理广告相关字段
    if (obj.data && typeof obj.data === 'object') {
      // 常见广告字段名
      delete obj.data.ad;
      delete obj.data.ads;
      delete obj.data.splash;
      delete obj.data.advert;
      delete obj.data.launchAd;
      delete obj.data.openAd;
      // 清空可能的数组
      if (Array.isArray(obj.data.items)) obj.data.items = [];
      if (Array.isArray(obj.data.list)) obj.data.list = [];
      if (Array.isArray(obj.data.modules)) {
        obj.data.modules = obj.data.modules.filter(m => {
          let t = (m && (m.type || m.module_type || m.name) || '').toString().toLowerCase();
          return !(t.includes('ad') || t.includes('splash') || t.includes('launch') || t.includes('open'));
        });
      }
      // 有时广告字段在 nested.fields 中，尝试删除常见键
      ['adsInfo','ad_list','launch_ad','banner','popup'].forEach(k => {
        if (obj.data[k]) delete obj.data[k];
      });
    }

    // 如果顶层直接包含广告信息，亦尝试清空
    ['ad','ads','splash','advert','adInfo'].forEach(k => {
      if (obj[k]) delete obj[k];
    });
  }

  $done({ body: JSON.stringify(obj) });
} catch (e) {
  // JSON 解析失败，直接放行原始响应
  $done({});
}
