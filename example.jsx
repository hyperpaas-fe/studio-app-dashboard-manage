import React from "react";
import ReactDOM from "react-dom/client";
import { useState } from "react";
import { Select } from "antd";

import { HYPER_REQUEST_CUSTOM_OPTIONS, registerPlugin } from "@hp-view/request";
import App from "./src/App";

const cookieValue =
  "XSRF-TOKEN=9b64c2a9-e36b-4bec-b6db-c03c2d5ce804; cookieUser=v1.eyJ2IjoidjEiLCJ1IjoiMTkzOGI0N2QtNDY2Mi00MjRiLTliMzktYjI0NTI3ZGU1NTAxIiwidCI6IjhhYjAxZjcwLWM3NDEtNGJjZC1iMmZmLTU2ZDMzYzY0NmFlNCIsInRzIjoxNjk2Njg0MTkyNDAzLCJlIjp7InAiOiJTVVBFUl9BRE1JTixTVVBFUl9BRE1JTl9NQU5BR0UsUExBVEZPUk1fQURNSU5fTUFOQUdFLFNUVURJT19BRE1JTl9NQU5BR0UsUExBVEZPUk1fTUFOQUdFLFNUVURJT19BUFBfQlVJTEQsU1RVRElPX0FQUF9BRE1JTl9NQU5BR0UsU1RVRElPX1VTRVJfTUFOQUdFLFdTX0FETUlOX01BTkFHRSxXU19BUFBfQURNSU5fTUFOQUdFLFdTX1VTRVJfTUFOQUdFLFdTX0ZJUlNUX0FQUF9NQU5BR0UsV1NfTUFOQUdFLEJVU0lORVNTX1BSSVZJTEVHRV9NQU5BR0UsQUNDT1VOVF9NQU5BR0UsVVNFUl9HUk9VUF9NQU5BR0UsQ09OVEFDVFNfTUFOQUdFIn19; JSESSIONID=E3638B3E297BC39D4B6E6BEEDDFBA14F; SESSION=28efd510-f79d-4eb9-82bd-cb85eefe8b37";

// 测试环境注入cookie
function testEnvInit(cookieValue) {
  try {
    cookieValue.split("; ").forEach((item) => {
      const [key, value] = item.split("=");
      if (key === "XSRF-TOKEN") {
        window.HYPER_XSRF_TOKEN = value;
      }
      document.cookie = item;
    });
    registerPlugin(HYPER_REQUEST_CUSTOM_OPTIONS, function (data) {
      if (data) {
        data.headers = data.headers || {};
      }
    });
  } catch (e) {
    console.log(e);
  }
}

// testEnvInit(cookieValue);

const appList = [
  {
    label: "内网测试-test",
    value: "da030e58-e2c0-46af-b13f-e50b468487c6",
  },
  {
    label: "校园管理系统",
    value: "380c670b-4d97-43ef-bcc2-a3b702b58613",
  },
  {
    label: "测试",
    value: "9b2bf493-2be9-4553-93b7-6df7d1bce28f",
  },
  {
    label: "小工单",
    value: "c3f5614d-735c-4af3-bc71-bc9fdc15c622",
  },
  {
    label: "meibiao",
    value: "12b8770f-5513-46ba-936b-2ce087ae0544",
  },
];

function RenderDemo() {
  const [selectedAppId, setSelectedAppId] = useState(appList[4].value);

  return (
    <div className="page-layout-wrapper">
      <div style={{ margin: 20, height: 30 }}>
        <Select
          style={{ width: 200 }}
          value={selectedAppId}
          options={appList}
          onChange={(val) => setSelectedAppId(val)}
        ></Select>
      </div>
      <div className="playground-wrapper">
        <App appId={selectedAppId} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(RenderDemo)
);
