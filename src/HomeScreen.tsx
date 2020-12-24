import { View } from "react-native";
import { Text } from "react-native-paper";
import { IState, useState } from "./state/lib/state";
import { selectHeight, selectWidth } from "./state/lib/screenSize/selectors";

function mapStateToProps(state: IState) {
  return {
    width: selectWidth(state),
    height: selectHeight(state),
  };
}

export function HomeScreen() {
  const props = useState(mapStateToProps);

  return (
    <View>
      <Text>
        {props.width} {props.height}
      </Text>
    </View>
  );
}
