// 完美世界电竞首页横幅净化
// 解析 getAppConfigs 接口，清空 banner 列表，保留其他配置。

let body = $response.body;
try {
  const data = JSON.parse(body);
  if (Array.isArray(data?.result)) {
    // 追踪是否有修改，避免不必要的序列化
    let modified = false;
    for (let i = 0; i < data.result.length; i++) {
      const section = data.result[i];
      if (section && Array.isArray(section.banner) && section.banner.length > 0) {
        section.banner = [];
        modified = true;
      }
    }
    // 只有在实际修改时才重新序列化
    $done({ body: modified ? JSON.stringify(data) : body });
  } else {
    $done({ body });
  }
} catch (err) {
  console.log("perfectworld_banner.js parse error", err);
  $done({ body });
}
