import publishStyles from "./style.less";
import { Form, Modal, Select, Tag } from "antd";
import { useModel } from "@@/plugin-model/useModel";
import moment from "moment";
import { useEffect, useState } from "react";

import DarkButton from "@/pages/Configure/components/CustomButton/DarkButton";
import { FIRST_PAGE } from "@/config/config";
import { HistoryConfigurationResponse } from "@/services/configure";
import RealtimeDiff from "@/pages/Configure/components/Menu/Publish/RealtimeDiff";
import classNames from "classnames";

const { Option } = Select;

const Publish = () => {
  const [publishForm] = Form.useForm();
  const [visibleDiff, setVisibleDiff] = useState(false);
  const {
    configurationList,
    doGetHistoryConfiguration,
    doPublishConfiguration,
  } = useModel("configure");
  const [selectedVersion, setSelectedVersion] =
    useState<HistoryConfigurationResponse>();
  const handleChangeConfig = (configId: number) => {
    doGetHistoryConfiguration
      .run(configId, {
        current: FIRST_PAGE,
        pageSize: 10000,
      })
      .then((res) => {
        if (res?.code === 0) {
          publishForm.setFields([{ name: "version", value: undefined }]);
        }
      });
  };

  const handleFormSubmit = ({ version }: { version: string }) => {
    const selectedVer = doGetHistoryConfiguration.data?.find(
      (v) => v.version === version
    );
    if (!selectedVer) return;
    setSelectedVersion(selectedVer);
    setVisibleDiff(true);
  };

  const handleConfirm = () => {
    Modal.confirm({
      title: "确认发布",
      okText: "确认发布",
      content: `发布配置后集群，请谨慎操作`,
      onOk() {
        if (selectedVersion)
          doPublishConfiguration
            .run(selectedVersion.configurationId, selectedVersion.version)
            .then((res) => {
              setVisibleDiff(false);
            });
      },
    });
  };

  useEffect(() => {
    return () => doGetHistoryConfiguration.reset();
  }, []);

  return (
    <div className={publishStyles.publishMain}>
      <Form
        className={publishStyles.publishForm}
        form={publishForm}
        onFinish={handleFormSubmit}
      >
        <div className={publishStyles.fieldLabel}>配置文件</div>
        <Form.Item name="configId">
          <Select<number>
            className={classNames(
              publishStyles.formSelectInput,
              publishStyles.darkSelect
            )}
            dropdownClassName={publishStyles.darkSelectDropdown}
            placeholder="选择配置文件"
            onSelect={(configId) => {
              handleChangeConfig(configId);
            }}
          >
            {configurationList?.map((config) => (
              <Option key={config.id} value={config.id}>
                {config.name}.{config.format}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className={publishStyles.fieldLabel}>配置文件</div>
        <Form.Item name="version">
          <Select
            placeholder="选择配置版本"
            className={classNames(
              publishStyles.formSelectInput,
              publishStyles.darkSelect
            )}
            dropdownClassName={publishStyles.darkSelectDropdown}
            optionLabelProp="label"
          >
            {doGetHistoryConfiguration.data?.map((config) => (
              <Option
                key={config.id}
                value={config.version}
                label={
                  <div className={publishStyles.versionSelectLabel}>
                    <div>
                      <Tag color="hsl(100,77%,44%)">
                        {config.version.substring(0, 7)}
                      </Tag>
                    </div>
                    <div className={publishStyles.changeLog}>
                      {config.changeLog}
                    </div>
                  </div>
                }
              >
                <div className={publishStyles.versionSelectInfo}>
                  <Tag color="hsl(100,77%,44%)">
                    {config.version.substring(0, 7)}
                  </Tag>
                  <div>
                    {moment(config.ctime, "X").format("YYYY-MM-DD HH:mm")}
                  </div>
                </div>
                <div className={publishStyles.changeLog}>
                  {config.changeLog}
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prev, next) => prev.version !== next.version}
        >
          {({ getFieldValue }) => {
            const version = getFieldValue("version");
            const configuration = doGetHistoryConfiguration.data?.find(
              (v) => v.version === version
            );
            if (!configuration) {
              return <></>;
            }

            return (
              <div className={publishStyles.configDetail}>
                <div className={publishStyles.fieldLabel}>版本信息</div>
                <div>
                  <span className={publishStyles.versionFieldLabel}>
                    Commit ID:
                  </span>
                  <span>{configuration.version}</span>
                </div>
                <div>
                  <span className={publishStyles.versionFieldLabel}>
                    Change Log:
                  </span>
                  <span>{configuration.changeLog}</span>
                </div>
                <div>
                  <span className={publishStyles.versionFieldLabel}>
                    变更时间:
                  </span>
                  {moment(configuration.ctime, "X").format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                </div>
              </div>
            );
          }}
        </Form.Item>

        <div>
          <Form.Item noStyle shouldUpdate={() => true}>
            {({ getFieldValue }) => {
              const configId = getFieldValue("configId");
              const version = getFieldValue("version");
              if (!configId)
                return <DarkButton disabled>请选择配置</DarkButton>;
              if (!version)
                return <DarkButton disabled>请选择配置版本</DarkButton>;

              return <DarkButton onClick={publishForm.submit}>发布</DarkButton>;
            }}
          </Form.Item>
        </div>
      </Form>

      <RealtimeDiff
        visible={visibleDiff}
        configId={selectedVersion?.configurationId as number}
        version={selectedVersion?.version as string}
        onCancel={() => {
          setVisibleDiff(false);
        }}
        onOk={handleConfirm}
      />
    </div>
  );
};

export default Publish;
