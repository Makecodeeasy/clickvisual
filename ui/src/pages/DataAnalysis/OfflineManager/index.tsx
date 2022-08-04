import offlineStyles from "@/pages/DataAnalysis/OfflineManager/index.less";
import WorkflowTree from "@/pages/DataAnalysis/OfflineManager/components/WorkflowTree";
import { useEffect, useMemo } from "react";
import { Empty, Spin, Tabs } from "antd";
import TabPaneItem from "./components/TabPaneItem";
import { PaneItemType } from "@/models/dataanalysis/useFilePane";
import { useModel } from "umi";
import { cloneDeep } from "lodash";
import Luckysheet from "@/components/Luckysheet";
import { useIntl } from "umi";

const { TabPane } = Tabs;

const OfflineManager = () => {
  const i18n = useIntl();
  const {
    offlinePaneList,
    onChangeOfflinePaneList,
    currentOfflinePaneActiveKey,
    onChangeCurrentOfflinePaneActiveKey,
    doGetNodeInfo,
    luckysheetData,
    changeOpenNodeId,
    setSelectKeys,
  } = useModel("dataAnalysis", (model) => ({
    offlinePaneList: model.filePane.offlinePaneList,
    onChangeOfflinePaneList: model.filePane.onChangeOfflinePaneList,
    currentOfflinePaneActiveKey: model.filePane.currentOfflinePaneActiveKey,
    onChangeCurrentOfflinePaneActiveKey:
      model.filePane.onChangeCurrentOfflinePaneActiveKey,
    doGetNodeInfo: model.doGetNodeInfo,
    luckysheetData: model.luckysheetData,
    changeOpenNodeId: model.changeOpenNodeId,
    setSelectKeys: model.manageNode.setSelectKeys,
  }));

  const panes = useMemo(() => {
    return cloneDeep(offlinePaneList);
  }, [offlinePaneList]);

  const onChange = (key: string) => {
    onChangeCurrentOfflinePaneActiveKey(key);
    const node = offlinePaneList.filter((item: any) => item.key == key)[0].node;
    setSelectKeys([`${node.workflowId}-${node.id}-${node.name}`]);
    changeOpenNodeId(parseInt(key));
  };

  const remove = (targetKey: string) => {
    const targetIndex = panes.findIndex((pane) => pane.key === targetKey);
    const newPanes = panes.filter((pane) => pane.key !== targetKey);
    const index =
      targetIndex === newPanes.length ? targetIndex - 1 : targetIndex;

    if (newPanes.length) {
      const { key } = newPanes[index];
      onChangeCurrentOfflinePaneActiveKey(key.toString());
      setSelectKeys([
        `${newPanes[index].node.workflowId}-${key}-${newPanes[index].title}`,
      ]);
      changeOpenNodeId(parseInt(key));
    } else {
      setSelectKeys([]);
      changeOpenNodeId(undefined);
    }
    onChangeOfflinePaneList(newPanes);
  };

  const onEdit = (targetKey: any, action: "add" | "remove") => {
    if (action === "add") {
      // add();
    } else {
      remove(targetKey);
    }
  };

  useEffect(() => {
    if (currentOfflinePaneActiveKey) {
      changeOpenNodeId(parseInt(currentOfflinePaneActiveKey));
    }
  }, []);

  return (
    <div className={offlineStyles.offlineMain} style={{ background: "#fff" }}>
      <div className={offlineStyles.right}>
        <WorkflowTree />
      </div>
      <div className={offlineStyles.content}>
        {panes.length > 0 ? (
          <>
            <Tabs
              hideAdd
              onChange={onChange}
              activeKey={currentOfflinePaneActiveKey}
              type="editable-card"
              onEdit={onEdit}
              className={offlineStyles.fileNameList}
            >
              {panes.map((pane: PaneItemType) => {
                return (
                  <TabPane
                    tab={pane.title}
                    key={pane.key}
                    forceRender
                    style={{ background: "#fff", width: "100%" }}
                  >
                    <TabPaneItem
                      id={parseInt(pane.key)}
                      node={pane.node}
                      parentId={pane.parentId}
                      currentOfflinePaneActiveKey={currentOfflinePaneActiveKey}
                    />
                  </TabPane>
                );
              })}
            </Tabs>
            <Spin spinning={doGetNodeInfo.loading}>
              <div
                style={{
                  position: "relative",
                  width: "calc(100% - 32px)",
                  height: "calc(40vh - 32px - 32px)",
                  top: "calc(-40vh + 32px + 32px)",
                  zIndex: 10,
                }}
              >
                {luckysheetData[0].celldata.length > 0 ? (
                  <Luckysheet />
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={i18n.formatMessage({
                      id: "bigdata.components.RightMenu.notResults",
                    })}
                  />
                )}
              </div>
            </Spin>
          </>
        ) : (
          <div>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={i18n.formatMessage({
                id: "bigdata.components.SQLEditor.selectFile",
              })}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default OfflineManager;
