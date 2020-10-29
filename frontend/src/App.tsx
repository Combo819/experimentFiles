import React, { useDebugValue, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Layout, Row, Col, Typography, Tabs, Card, message } from "antd";
import DateTabs from "./Components/DateTabs";
import { getAllDates } from "./Api";
const { Header, Content, Footer } = Layout;
const { TabPane } = Tabs;
const { Title } = Typography;
type Dates = {
  dates:string
}
function App() {
  const [dates, setDates] = useState<Dates[]>([]);
  useEffect(() => {
    {
      getAllDates()
        .then((res) => {
          setDates(res.data);
        })
        .catch((err) => {
          console.log(err);
          message.error("failed to get dates");
        });
    }
  }, []);
  console.log(dates)
  return (
    <Layout>
      <Layout>
        <Content>
          <Title>Experiment Images Montage</Title>
          <Card>
            <DateTabs dates={dates.map(item=>item.dates)} />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
