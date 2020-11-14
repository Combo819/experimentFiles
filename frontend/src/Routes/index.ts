import { FunctionComponent, ComponentClass } from "react";
import DateTabs from "../Components/DateTabs";
import InputTable from "../Components/EditTable";
export interface Route {
  path: string;
  component: FunctionComponent<any> | ComponentClass<any>;
  exact: boolean;
}
export const routes: Route[] = [
  { path: "/", component: DateTabs, exact: true },
  { path: "/edit", component: InputTable, exact: false },
];
