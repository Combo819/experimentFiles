import React, { useEffect, useState } from "react";
import { message, Tabs, Select, Row, Col } from "antd";
import { getImagesInfo } from "../Api";
import { group } from "../Utility/group";
import {baseUrl} from '../Api/config'
import { result } from "lodash";
import _ from "lodash";
import { PhotoProvider, PhotoConsumer } from "react-photo-view";
import "react-photo-view/dist/index.css";
const { TabPane } = Tabs;
const { Option } = Select;
interface Props {
  dates: string[];
}
interface Info {
  fileName: string;
  path: string;
  experimentTime: Date;
  channelSize: number;
  bubbleType: "native" | "filtered";
  waveType: "s" | "p" | "n";
  waveLength: string; //number like string
  pressure: number;
  generatedTime: Date;
  folderName: string;
  folderDate: Date;
}
export default function DateTabs(props: Props) {
  const dates: string[] = props.dates;
  const [date, setDate] = useState<string>("");
  const [infos, setInfos] = useState<Info[]>([]);
  const [channelSize, setChannelSize] = useState<number>(-1);
  const [bubbleType, setBubbleType] = useState<"native" | "filtered" | null>(
    null
  );
  const [waveLength, setWaveLength] = useState<string>("");
  const [waveType, setWaveType] = useState<"s" | "p" | "n" | null>(null);
  const changeDate = (activeKey: string) => {
    console.log(activeKey);
    setDate(activeKey);
  };

  useEffect(() => {
    if (date) {
      getImagesInfo(date)
        .then((res) => {
          setInfos(res.data.result);
          if (result.length > 0) {
            const firstInfo: Info = res.data.result[0];
            setChannelSize(firstInfo.channelSize);
            setBubbleType(firstInfo.bubbleType);
            setWaveLength(firstInfo.waveLength);
            setWaveType(firstInfo.waveType);
          }
        })
        .catch((err) => {
          console.log(err);
          message.error("failed to get images");
        });
    }
  }, [date]);
  useEffect(() => {
    setDate(dates[0]);
  }, [dates.length]);

  const availableOptions = group(infos, [
    "channelSize",
    "bubbleType",
    "waveLength",
    "waveType",
  ]);

  const filteredInfo: Info[] = _.filter(infos, (item: Info) => {
    return _.every([
      channelSize === item.channelSize,
      bubbleType === item.bubbleType,
      waveLength === item.waveLength,
      waveType === item.waveType,
    ]);
  });

  const pressures: any = groupPressure(filteredInfo);

  return (
    <Tabs onChange={changeDate} tabPosition={"left"}>
      {dates.map((item) => (
        <TabPane tab={item} key={item}>
          <Row gutter={3}>
            <Col>
              channelSize:{" "}
              <Select value={channelSize} style={{ width: 100 }}>
                <Option
                  disabled={!availableOptions.channelSize.includes(15)}
                  value={15}
                >
                  15
                </Option>
                <Option
                  disabled={!availableOptions.channelSize.includes(50)}
                  value={50}
                >
                  50
                </Option>

                <Option
                  disabled={!availableOptions.channelSize.includes(100)}
                  value={100}
                >
                  100
                </Option>
                <Option
                  disabled={!availableOptions.channelSize.includes(200)}
                  value={200}
                >
                  200
                </Option>
                <Option
                  disabled={!availableOptions.channelSize.includes(1200)}
                  value={1200}
                >
                  1200
                </Option>
              </Select>
            </Col>
            <Col>
              BubbleType:{" "}
              <Select value={bubbleType as string} style={{ width: 100 }}>
                <Option
                  disabled={!availableOptions.bubbleType.includes("native")}
                  value="native"
                >
                  native
                </Option>
                <Option
                  disabled={!availableOptions.bubbleType.includes("filtered")}
                  value="filtered"
                >
                  filtered
                </Option>
              </Select>
            </Col>
            <Col>
              waveLength:{" "}
              <Select value={waveLength} style={{ width: 100 }}>
                <Option
                  disabled={!availableOptions.waveLength.includes("011")}
                  value="011"
                >
                  011
                </Option>
                <Option
                  disabled={!availableOptions.waveLength.includes("51")}
                  value="51"
                >
                  51
                </Option>
              </Select>
            </Col>
            <Col>
              waveType:{" "}
              <Select value={waveType as string} style={{ width: 100 }}>
                <Option
                  disabled={!availableOptions.waveType.includes("s")}
                  value="s"
                >
                  s
                </Option>
                <Option
                  disabled={!availableOptions.waveType.includes("n")}
                  value="n"
                >
                  n
                </Option>
                <Option
                  disabled={!availableOptions.waveType.includes("p")}
                  value="p"
                >
                  p
                </Option>
              </Select>
            </Col>
          </Row>

          {Object.keys(pressures).map((key) => {
            return (
              <>
                <Row>{key}</Row>
                <Row  justify={"start"}>
                  <PhotoProvider>
                    {pressures[key].map((info: Info) => (
                      <Col>
                        <PhotoConsumer
                          key={info.path}
                          src={`http://localhost:5000/${info.path.replace(
                            ".tif",
                            ".png"
                          )}`}
                          intro={info.fileName}
                        >
                          <img
                            height={120}
                            src={`http://localhost:5000/thumbnail/${info.path.replace(
                              ".tif",
                              ".png"
                            )}`}
                          ></img>
                        </PhotoConsumer>
                      </Col>
                    ))}
                  </PhotoProvider>
                </Row>
              </>
            );
          })}
        </TabPane>
      ))}
    </Tabs>
  );
}

const groupPressure = (infos: Info[]) => {
  const pressures: any = {};
  infos.forEach((item: Info) => {
    const pressure: number = item.pressure;
    if (!_.isArray(pressures[String(pressure)])) {
      pressures[pressure] = [];
    }
    pressures[pressure].push(item);
  });
  return pressures;
};
