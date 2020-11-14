import { FunctionComponent, ComponentClass } from "react";
import DateTabs from "../Pages/DateTabs";
export interface Route {
  path: string;
  component: FunctionComponent<any> | ComponentClass<any>;
  exact: boolean;
}
export const routes: Route[] = [
  { path: "/", component: DateTabs, exact: true },
];
