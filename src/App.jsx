import { useEffect, useState } from "react";
import { generatePreviewPath } from "@/const";
import RenderChartListSider from "@/module/sider";
import RenderChartDetail from "@/module/chartDetail";
import {
  isTenantEnableBi,
  isCompletedPreset,
  previewChart,
  listCharts,
  enableBi,
} from "@/services";
import "@/assets/style/index.less";
import { Result, message, Button } from "antd";

function App(props) {
  const { appId } = props || {};

  const [chartList, setChartList] = useState([]);
  const [selectedChartId, setSelectedChartId] = useState(null);
  const [selectedChartUrl, setSelectedChartUrl] = useState(null);
  const [biAvailable, setBiAvailable] = useState(null);

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
      previewChart(selectedChartId).then((res) => {
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

    isTenantEnableBi().then((res) => {
      if (!res?.content === true) {
        return message.warning({
          content: "当前租户未开启BI能力,请至工作台点击开启~",
          duration: 3,
        });
      }

      isCompletedPreset(appId).then((res) => {
        setBiAvailable(res?.content);
        typeof dispatch === "function" && dispatch("REFRESH_CHART_LIST");
      });
    });
  };

  const handleEnableBi = () => {
    enableBi(appId).then((res) => {
      const { content } = res || {};
      if (!content) {
        return message.error("启用失败");
      }

      setBiAvailable(content);
    });
  };

  useEffect(() => {
    appId && validateBiAvailable(appId);
  }, [appId]);

  useEffect(() => {
    selectedChartId && getLatestChartUrl();
  }, [selectedChartId]);

  if (biAvailable === false) {
    return (
      <div className="enable-bi-page-contanier ">
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
  }

  return (
    <div className="app-bi-wrapper">
      <div className="left-view-menu">
        <RenderChartListSider
          appId={appId}
          selectedChartId={selectedChartId}
          chartList={chartList}
          dispatch={dispatch}
          b
        />
      </div>
      <div className="right-dashboard-pannel">
        <RenderChartDetail
          appId={appId}
          item={activeChartItem}
          previewChartUrl={selectedChartUrl}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
}

export default App;
