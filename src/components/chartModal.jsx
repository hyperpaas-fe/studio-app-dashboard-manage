import { Modal, Select, Input, Form, Switch, message, Button } from "antd";
import { useState, useEffect } from "react";
import { listModels, createChart, editChart } from "@/services";

const TextArea = Input.TextArea;

function RenderChartModal(props) {
  const { value, appId, visible, onCancel, dispatch } = props || {};

  const [form] = Form.useForm();
  const type = Form.useWatch("type", form);

  const [modelList, setModelList] = useState([]);
  const [loading, setLoading] = useState(false);

  let title = "";
  if (value) {
    title = `编辑${value.type === "CARD" ? "卡片" : "仪表盘"}`;
    form.setFieldsValue(value);
  } else {
    title = "添加数据卡片/仪表盘";
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formData = {
        ...(values || {}),
        domainId: appId,
      };

      if (value) {
        // 编辑
        const payload = {
          ...value,
          ...formData,
        };
        editChart(value.id, payload).then((res) => {
          const { content } = res || {};
          if (content) {
            typeof dispatch === "function" && dispatch("REFRESH_CHART_LIST");
            dispatch("UPDATE_SELECTED_CHART_URL"); // 刷新iframe的图表
            typeof onCancel === "function" && onCancel();
          } else {
            message.error("编辑失败");
          }
        });
      } else {
        setLoading(true);
        createChart(formData).then((res) => {
          const { content } = res || {};
          if (content) {
            setLoading(false);
            if (!typeof dispatch === "function") return;
            dispatch("REFRESH_CHART_LIST");
            dispatch("SELECT_CHART", content.id);
            typeof onCancel === "function" && onCancel();
          } else {
            message.error("创建失败");
          }
        });
      }
    });
  };

  const customerFooter = [
    <Button key="cancel" onClick={onCancel}>
      取消
    </Button>,
    <Button
      key="submit"
      disabled={loading}
      loading={loading}
      type="primary"
      onClick={handleSubmit}
    >
      确认
    </Button>,
  ];

  useEffect(() => {
    if (type === "CARD") {
      listModels(appId).then((res) => {
        const { content } = res || {};
        if (Array.isArray(content)) {
          const _modelList = content.map((item) => ({
            label: item.label,
            value: item.id,
          }));
          setModelList(_modelList);
        }
      });
    }
  }, [type]);

  return (
    <Modal
      title={title}
      visible={visible}
      cancelText="取消"
      okText="确认"
      onCancel={onCancel}
      destroyOnClose={true}
      footer={customerFooter}
    >
      <Form preserve={false} form={form} layout="vertical" autoComplete="off">
        <Form.Item
          name="label"
          label="图表名"
          rules={[{ required: true, message: "图表名不能为空" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="type" label="类型" rules={[{ required: true }]}>
          <Select disabled={!!value}>
            <Select.Option value="CARD">卡片</Select.Option>
            <Select.Option value="DASHBOARD">仪表盘</Select.Option>
          </Select>
        </Form.Item>

        {type === "CARD" ? (
          <>
            <Form.Item
              name="modelId"
              label="绑定模型"
              rules={[{ required: true }]}
            >
              <Select
                options={modelList}
                disabled={!!value}
                placeholder="一个模型只能对应一个卡片"
              />
            </Form.Item>
          </>
        ) : null}

        <Form.Item name="open" label="是否公开" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="description" label="描述">
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default RenderChartModal;
