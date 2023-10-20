import handleRequest from "@hp-view/request";
import { validateAppId, validateChartId } from "./helpers";

// 用户对当前 App 开启BI能力
export function enableBi(appId) {
  return validateAppId(appId).then(() =>
    handleRequest(`/studio/app/${appId}/enableBi`, null, { method: "POST" })
  );
}

// 判断当前租户是否开启BI能力
export function isTenantEnableBi() {
  return handleRequest(`/studio/bi/isEnable`);
}

// 用户是否完成预先设置
export function isBiAvailableForUser(appId) {
  return validateAppId(appId).then(() =>
    handleRequest(`/studio/app/${appId}/isEnableBi`)
  );
}

// 创建卡片和仪表盘
export function createChart(payload) {
  return handleRequest(`/studio/bi`, { content: payload }, { method: "POST" });
}

// 编辑卡片和仪表盘
export function editChart(chartId, payload) {
  return validateChartId(chartId).then(() =>
    handleRequest(
      `/studio/bi/${chartId}`,
      { content: payload },
      { method: "PUT" }
    )
  );
}

// 获取卡片与仪表盘的预览地址
export function previewChart(chartId) {
  return validateChartId(chartId).then(() =>
    handleRequest(`/studio/bi/${chartId}/link`)
  );
}

// 获取应用下所有的图表信息
export function listCharts(appId) {
  return validateAppId(appId).then(() =>
    handleRequest(`/studio/app/${appId}/bis`)
  );
}

// 删除卡片或者仪表盘
export function deleteChart(chartId) {
  return validateChartId(chartId).then(() =>
    handleRequest(`/studio/bi/${chartId}`, {}, { method: "delete" })
  );
}

// 用户单点等于实现编辑跳转

// 查询应用下所有的模型
export function listModels(appId) {
  return validateAppId(appId).then(() =>
    handleRequest(`/studio/app/${appId}/models`)
  );
}
