// 完美世界电竞首页横幅净化
// 解析 getAppConfigs 接口，清空 banner 列表，保留其他配置。

let body = $response.body;
try {
  const data = JSON.parse(body);
  if (Array.isArray(data?.result)) {
    data.result.forEach((section) => {
      if (Array.isArray(section?.banner)) {
        section.banner = [];
      }
    });
    $done({ body: JSON.stringify(data) });
  } else {
    $done({ body });
  }
} catch (err) {
  console.log("perfectworld_banner.js parse error", err);
  $done({ body });
}
