export function validateValueRequired(val, message = "") {
  if (val === void 0) {
    return Promise.reject({
      message,
    });
  }
  return Promise.resolve(true);
}

export function validateAppId(appId) {
  return validateValueRequired(appId, "appId is required");
}

export function validateChartId(chartId) {
  return validateValueRequired(chartId, "chartId is required");
}
