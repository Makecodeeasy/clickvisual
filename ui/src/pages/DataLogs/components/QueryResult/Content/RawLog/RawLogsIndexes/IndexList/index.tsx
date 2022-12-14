import indexListStyles
    from "@/pages/DataLogs/components/QueryResult/Content/RawLog/RawLogsIndexes/IndexList/index.less";
import classNames from "classnames";
import {Empty, Spin, Tooltip} from "antd";
import {CaretDownOutlined, CaretUpOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import IndexItem from "@/pages/DataLogs/components/QueryResult/Content/RawLog/RawLogsIndexes/IndexItem";
import {useIntl, useModel} from "umi";
import {IndexInfoType} from "@/services/dataLogs";

type IndexListProps = {
  list?: IndexInfoType[];
};
const IndexList = (props: IndexListProps) => {
  const [activeList, setActiveList] = useState<number[]>([]);
  const i18n = useIntl();
  const { list } = props;

  const { doGetAnalysisField } = useModel("dataLogs");

  useEffect(() => {
    setActiveList([]);
  }, [list]);

  return (
    <div className={classNames(indexListStyles.indexListMain)}>
      <Spin spinning={doGetAnalysisField.loading}>
        {list && list?.length > 0 ? (
          <ul>
            {list.map((index) => {
              const isActive = activeList.indexOf(index.id as number) > -1;
              return (
                <div
                  className={classNames(indexListStyles.indexRowMain)}
                  key={index.id}
                >
                  <Tooltip title={index.field} placement={"left"}>
                    <li
                      className={classNames(
                        indexListStyles.indexRow,
                        isActive && indexListStyles.activeIndexRow
                      )}
                      onClick={() => {
                        if (activeList.indexOf(index.id as number) === -1) {
                          setActiveList(() => [
                            ...activeList,
                            index.id as number,
                          ]);
                        } else {
                          setActiveList(() =>
                            activeList.filter(
                              (itemActive) => itemActive !== index.id
                            )
                          );
                        }
                      }}
                    >
                      <span className={indexListStyles.title}>
                        {index.rootName === ""
                          ? index.rootName
                          : `${index.rootName}.`}
                        {index.field}
                      </span>
                      <div className={indexListStyles.icon}>
                        {isActive ? <CaretUpOutlined /> : <CaretDownOutlined />}
                      </div>
                    </li>
                  </Tooltip>
                  {isActive && <IndexItem index={index} isActive={isActive} />}
                </div>
              );
            })}
          </ul>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={i18n.formatMessage({ id: "log.index.empty" })}
          />
        )}
      </Spin>
    </div>
  );
};
export default IndexList;
