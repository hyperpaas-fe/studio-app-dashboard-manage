import { useEffect, useState } from "react";
import { Button, Modal, message } from "antd";
import { Plus, ChartPie, SpeedOne } from "@icon-park/react";

import { isTenantEnableBi, isBiAvailableForUser, enableBi } from "@/services";
import RenderChartModal from "@/components/chartModal";
import RenderDropdownMenu from "@/components/dropdownMenu";

function RenderChartListSider(props) {
  const { appId, selectedChartId, chartList, dispatch } = props || {};

  const [visible, setVisible] = useState(false);
  const [expendItem, setExpendItem] = useState(null); // {key,open: true}
  const [biAvailable, setBiAvailable] = useState(false);

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

  const handleClick = () => {
    if (biAvailable) {
      // 已启用BI能力，开始创建图表
      setVisible(true);
    } else {
      Modal.confirm({
        title: "开启BI",
        content: "开启BI后，您可以在应用中创建仪表盘和卡片",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          appId &&
            enableBi(appId).then((res) => {
              const { content } = res || {};
              if (content === true) {
                setBiAvailable(true);
              }
            });
        },
      });
    }
  };

  const handleSelectChart = (selectedChartId) => {
    typeof dispatch === "function" && dispatch("SELECT_CHART", selectedChartId);
  };

  const chartListContent = (
    <div className="chart-list-content">
      <RenderDropdownMenu
        openKey={"CARD"}
        expendItem={expendItem}
        title="数据卡片"
        selectedKey={selectedChartId}
        icon={<ChartPie className="chart-item-icon" size="20" />}
        items={cardList}
        onOpen={setExpendItem}
        onSelect={handleSelectChart}
      />

      <RenderDropdownMenu
        openKey="DASHBOARD"
        title="仪表盘"
        expendItem={expendItem}
        icon={<SpeedOne className="chart-item-icon" size="20" />}
        selectedKey={selectedChartId}
        items={dashboardList}
        onOpen={setExpendItem}
        onSelect={handleSelectChart}
      />
    </div>
  );

  useEffect(() => {
    if (!appId) return;

    isTenantEnableBi().then((res) => {
      if (!res?.content === true) {
        return message.warning("当前租户未开启BI能力,请至工作台点击开启~");
      }

      isBiAvailableForUser(appId).then((res) => {
        if (res?.content === false) {
          setBiAvailable(false);
          return message.warning("当前应用未开启BI能力,请点击左侧按钮开启~");
        }
        setBiAvailable(true);
        typeof dispatch === "function" && dispatch("REFRESH_CHART_LIST");
      });
    });
  }, [appId]);

  return (
    <div className="chart-list-wrapper">
      <div className="chart-toolbar">
        <Button type="primary" size="small" onClick={handleClick}>
          <span style={{ display: "flex", alignItems: "center" }}>
            <Plus
              size={14}
              style={{ marginRight: 4, display: "inline-flex" }}
            />
            {biAvailable ? "新建" : "启用数据仪表盘"}
          </span>
        </Button>
      </div>

      {biAvailable ? chartListContent : null}

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
