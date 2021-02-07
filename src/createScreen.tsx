import { FunctionComponent, memo } from "react";
import { RouteProp } from "@react-navigation/native";
import { shallowEqual } from "shallow-equal-object";
import { ParamList } from "./navigationConfig";

export interface IScreenProps<T extends keyof ParamList> {
  route: RouteProp<ParamList, T>;
}

export function createScreen<T extends keyof ParamList>(
  component: FunctionComponent<IScreenProps<T>>
) {
  return memo(
    component,
    (prevProps, nextProps) =>
      prevProps.route.key === nextProps.route.key &&
      prevProps.route.name === nextProps.route.name &&
      shallowEqual(prevProps.route.params, nextProps.route.params)
  );
}
