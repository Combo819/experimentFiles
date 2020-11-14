import React, { useDebugValue, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  Layout,
  Row,
  Col,
  Typography,
  Tabs,
  Card,
  message,
  Switch as SwtichAntd,
} from "antd";
import DateTabs from "./Pages/DateTabs";
import { getAllDates } from "./Api";
import { Switch, Route, Redirect } from "react-router-dom";
import { routes, Route as RouteType } from "./Routes";
const { Header, Content, Footer } = Layout;
const { TabPane } = Tabs;
const { Title } = Typography;
type Dates = {
  dates: string;
};
function App() {
  const [dates, setDates] = useState<Dates[]>([]);
  const [editMode, toggleEditMode] = useState<boolean>(false);
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
  console.log(dates);
  return (
    <Layout>
      <Layout>
        <Content>
          <div style={{ float: "right" }}>
            Edit Mode
            <SwtichAntd
              onChange={() => {
                toggleEditMode((preState) => !preState);
              }}
              checked={editMode}
            />
          </div>
          <Title>Experiment Images Montage</Title>

          <Card>
            <Switch>
              {routes.map((route: RouteType) => {
                return (
                  <Route path={route.path} exact={route.exact}>
                    <route.component editMode={editMode} dates={dates.map((item) => item.dates)} />
                  </Route>
                );
              })}
              <Redirect to="/" />
            </Switch>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
