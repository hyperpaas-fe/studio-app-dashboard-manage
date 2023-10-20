import { useEffect, useState } from "react";

import { generatePreviewPath } from "@/const";
import RenderChartListSider from "@/module/sider";
import RenderChartDetail from "@/module/chartDetail";
import { previewChart, listCharts } from "@/services";
import "@/assets/style/index.less";

function App(props) {
  const { appId } = props || {};

  const [chartList, setChartList] = useState([]);
  const [selectedChartId, setSelectedChartId] = useState(null);
  const [selectedChartUrl, setSelectedChartUrl] = useState(null);

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

  const activeChartItem = chartList.find(
    (item) => item?.id === selectedChartId
  );

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

  useEffect(() => {
    selectedChartId && getLatestChartUrl();
  }, [selectedChartId]);

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
