// metabase 服务地址
export const METABASE_SERVICE_ADDRESS = "https://metabase.hyperpaas-inc.com/";

// 拼接 host 和 path 和 uuid
export const generatePreviewPath = (path) => {
  if (typeof path !== "string") return null;

  return `${METABASE_SERVICE_ADDRESS}${trimSlash(path)}`;
};

// 去除字符串前后的 /
const trimSlash = (str) => {
  if (typeof str !== "string") return "";

  return str.replace(/^\/+|\/+$/g, "");
};
