import { useState } from "react";
import { Button } from "antd";
import { Plus, ChartPie, SpeedOne } from "@icon-park/react";

import RenderChartModal from "@/components/chartModal";
import RenderDropdownMenu from "@/components/dropdownMenu";

function RenderChartListSider(props) {
  const { appId, selectedChartId, chartList, dispatch } = props || {};
  const [visible, setVisible] = useState(false);

  let cardList = [];
  let dashboardList = [];

  Array.isArray(chartList) &&
    chartList.forEach((item) => {
      if (item?.type === "CARD") {
        cardList.push(item);
      } else if (item?.type === "DASHBOARD") {
        dashboardList.push(item);
      }
    });

  // 已启用BI能力，开始创建图表
  const handleClick = () => {
    setVisible(true);
  };

  const handleSelectChart = (selectedChartId) => {
    typeof dispatch === "function" && dispatch("SELECT_CHART", selectedChartId);
  };

  return (
    <div className="chart-list-wrapper">
      <div className="chart-toolbar">
        <Button type="primary" size="small" onClick={handleClick}>
          <span style={{ display: "flex", alignItems: "center" }}>
            <Plus
              size={14}
              style={{ marginRight: 4, display: "inline-flex" }}
            />
            {"新建"}
          </span>
        </Button>
      </div>

      <div className="chart-list-content">
        <RenderDropdownMenu
          title="数据卡片"
          selectedKey={selectedChartId}
          icon={<ChartPie className="chart-item-icon" size="20" />}
          items={cardList}
          onSelect={handleSelectChart}
        />

        <RenderDropdownMenu
          title="仪表盘"
          icon={<SpeedOne className="chart-item-icon" size="20" />}
          selectedKey={selectedChartId}
          items={dashboardList}
          onSelect={handleSelectChart}
        />
      </div>

      <RenderChartModal
        appId={appId}
        visible={visible}
        onCancel={() => setVisible(false)}
        dispatch={dispatch}
      />
    </div>
  );
}

export default RenderChartListSider;
