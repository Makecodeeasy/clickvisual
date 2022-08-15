import styles from "./index.less";
import { DatePicker, Input, Select, Space } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;

export interface TaskFilterType {
  onGetList: (data: {
    end?: number;
    start?: number;
    nodeName?: string;
    tertiary?: number;
  }) => void;
  setNodeName: (str: string) => void;
  setEndTime: (num: number) => void;
  setStartTime: (num: number) => void;
  setTertiary: (num: number) => void;
  endTime?: number;
  startTime?: number;
}
const TaskFilter = (props: TaskFilterType) => {
  //   const [nodeValue, setNodeValue] = useState<string>("");
  const {
    setNodeName,
    onGetList,
    endTime,
    startTime,
    setStartTime,
    setEndTime,
    setTertiary,
  } = props;

  const handleSelectChange = (num: number) => {
    setTertiary(num);
    onGetList({ tertiary: num });
  };

  return (
    <div className={styles.taskFilter}>
      <Space>
        <div className={styles.node}>
          <Space>
            <span>节点搜索：</span>
            <Input
              allowClear
              size="small"
              style={{ width: "150px" }}
              placeholder={"节点名称"}
              onPressEnter={(e: any) => {
                const nodeName = e.target.value;
                setNodeName(nodeName);
                onGetList({ nodeName });
              }}
            />
          </Space>
        </div>
        <div className={styles.time}>
          <span>业务日期：</span>
          <RangePicker
            size="small"
            showTime
            style={{ width: "360px" }}
            allowClear
            value={[
              startTime ? moment(startTime / 1000, "X") : null,
              endTime ? moment(endTime / 1000, "X") : null,
            ]}
            ranges={{
              昨天: [
                moment().startOf("day").subtract(1, "d"),
                moment().endOf("day").subtract(1, "d"),
              ],
              前天: [
                moment().startOf("day").subtract(2, "d"),
                moment().endOf("day").subtract(2, "d"),
              ],
            }}
            onChange={(timeList: any) => {
              const start = timeList && timeList.length > 1 ? +timeList[0] : 0;
              const end = timeList && timeList.length > 1 ? +timeList[1] : 0;
              setStartTime(start);
              setEndTime(end);
              onGetList({
                start: Math.floor(start / 1000),
                end: Math.floor(end / 1000),
              });
            }}
          />
        </div>
        <div className={styles.type}>
          <span>节点类型：</span>
          <Select
            style={{ width: 150 }}
            onChange={handleSelectChange}
            placeholder={"请选择节点类型"}
            allowClear
            size="small"
          >
            <Option value={10}>ClickHouse</Option>
            <Option value={11}>MySQL</Option>
            <Option value={20}>OfflineSync</Option>
          </Select>
        </div>
      </Space>
    </div>
  );
};
export default TaskFilter;
