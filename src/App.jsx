import { useEffect, useState } from "react";
import { Result, message, Button } from "antd";

import { generatePreviewPath } from "@/const";
import RenderChartListSider from "@/module/sider";
import RenderChartDetail from "@/module/chartDetail";
import {
  getTenantEnableStatus,
  getBiAvaiableStatus,
  getChartPreviewLink,
  listCharts,
  updateAppBiStatus,
} from "@/services";
import "@/assets/style/index.less";

function App(props) {
  const { appId } = props || {};

  const [biStatus, setBiStatus] = useState(""); // TENANT_UNAVAILABLE | APP_UNAVAILABLE | AVAILABLE

  const [chartList, setChartList] = useState([]);
  const [selectedChartId, setSelectedChartId] = useState(null);
  const [selectedChartUrl, setSelectedChartUrl] = useState(null);

  const activeChartItem = chartList.find(
    (item) => item?.id === selectedChartId
  );

  const dispatch = (actionName, payload) => {
    switch (actionName) {
      case "SELECT_CHART":
        payload && setSelectedChartId(payload);
        break;
      case "REFRESH_CHART_LIST":
        refreshCharts();
        break;
      case "UPDATE_SELECTED_CHART_URL":
        getLatestChartUrl();
      default:
        break;
    }
  };

  const getLatestChartUrl = () => {
    selectedChartId &&
      getChartPreviewLink(selectedChartId).then((res) => {
        const path = res?.content?.url;
        const previewUrl = generatePreviewPath(path);
        try {
          const newUrl = new URL(previewUrl);
          newUrl.searchParams.set("GENERATE_TIME", Date.now());
          setSelectedChartUrl(newUrl.href);
        } catch (e) {
          console.log(e);
        }
      });
  };

  // 获取所有图表
  const refreshCharts = () => {
    appId &&
      listCharts(appId).then((res) => {
        const charts = res?.content || [];
        setChartList(charts);
      });
  };

  const validateBiAvailable = (appId) => {
    if (!appId) return false;

    getTenantEnableStatus().then((res) => {
      const { content } = res || {};

      if (content) {
        getBiAvaiableStatus(appId).then((res) => {
          const biAvailable = res?.content;

          if (biAvailable === true) {
            setBiStatus("AVAILABLE");
            refreshCharts();
          } else if (biAvailable === false) {
            setBiStatus("APP_UNAVAILABLE");
          } else {
            message.warning("获取应用信息失败");
          }
        });
      } else if (content === false) {
        return setBiStatus("TENANT_UNAVAILABLE");
      } else {
        message.warning("获取租户信息失败");
      }
    });
  };

  const handleEnableBi = () => {
    updateAppBiStatus(appId).then((res) => {
      const { content } = res || {};
      if (!content) {
        return message.warning("启用失败");
      }

      setBiStatus("AVAILABLE");
    });
  };

  useEffect(() => {
    appId && validateBiAvailable(appId);
  }, [appId]);

  useEffect(() => {
    selectedChartId && getLatestChartUrl();
  }, [selectedChartId]);

  if (biStatus === "AVAILABLE") {
    return (
      <div className="app-bi-wrapper">
        <div className="left-view-menu">
          <RenderChartListSider
            appId={appId}
            selectedChartId={selectedChartId}
            chartList={chartList}
            dispatch={dispatch}
          />
        </div>
        <div className="right-dashboard-pannel">
          <RenderChartDetail
            appId={appId}
            item={activeChartItem}
            chartPreviewUrl={selectedChartUrl}
            dispatch={dispatch}
          />
        </div>
      </div>
    );
  } else if (biStatus === "TENANT_UNAVAILABLE") {
    return (
      <div className="enable-bi-page-contanier">
        <Result
          title="当前租户尚未开启BI能力"
          subTitle="请至workspace管理页面开启~"
        />
      </div>
    );
  } else if (biStatus === "APP_UNAVAILABLE") {
    return (
      <div className="enable-bi-page-contanier">
        <Result
          title="当前应用尚未开启BI能力"
          extra={
            <Button type="primary" onClick={handleEnableBi}>
              启用 BI
            </Button>
          }
        />
      </div>
    );
  } else {
    return <div className="enable-bi-page-contanier"></div>;
  }
}

export default App;
