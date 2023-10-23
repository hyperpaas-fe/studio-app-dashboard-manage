import { useState, useRef } from "react";
import { Button, Modal } from "antd";

import HyperResult from "@hp-view/com-view-result";
import RenderChartModal from "@/components/chartModal";
import { deleteChart } from "@/services";

function RenderChartDetail(props) {
  const { appId, item, chartPreviewUrl, dispatch } = props;
  const [visible, setVisible] = useState(false);
  const iframeRef = useRef();

  const handleDeleteChart = () => {
    Modal.confirm({
      title: "删除图表",
      content: "确认要删除当前图表吗？",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        item &&
          deleteChart(item.id).then((res) => {
            const { content } = res || {};

            if (content && typeof dispatch === "function") {
              dispatch("REFRESH_CHART_LIST");
            }
          });
      },
    });
  };

  const handleEditChart = () => {
    setVisible(true);
  };

  let renderContent = (
    <HyperResult
      status="info"
      isFull={true}
      title="开始创建您的数据仪表盘"
      description="即刻分析您的数据"
      layout="horizontal"
    />
  );

  if (item && chartPreviewUrl) {
    renderContent = (
      <>
        <div className="dashboard-content-topbar">
          <Button
            style={{ margin: "0 8px" }}
            size="small"
            type="primary"
            onClick={handleEditChart}
          >
            编辑
          </Button>
          <Button size="small" type="primary" onClick={handleDeleteChart}>
            删除
          </Button>
        </div>

        <iframe
          className="dashboard-content-iframe"
          ref={iframeRef}
          src={chartPreviewUrl}
        />
      </>
    );
  }

  return (
    <div className="dashboard-content-wrapper">
      {renderContent}

      <RenderChartModal
        appId={appId}
        value={item}
        visible={visible}
        onCancel={() => setVisible(false)}
        dispatch={dispatch}
      />
    </div>
  );
}

export default RenderChartDetail;
