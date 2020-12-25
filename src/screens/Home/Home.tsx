import { Text, Image, View, Button } from "react-native";
import {
  selectHeight,
  selectWidth,
} from "../../state/lib/screenSize/selectors";
import { IState, useState } from "../../state";
import bg from "../../../assets/bg.jpg";

function mapStateToProps(state: IState) {
  return {
    width: selectWidth(state),
    height: selectHeight(state),
  };
}

export function Home() {
  const props = useState(mapStateToProps);

  function onCoursesPress() {
    console.log("Go to Courses");
  }

  return (
    <View>
      <View>
        <Text>
          Math Cafe - {props.width} {props.height}
        </Text>
      </View>
      <View>
        <View>
          <Text>Lifelong Learning</Text>
          <Text>
            With our open platform designed for deep thinkers and lifelong
            learners, you can build, train and iteratively improve your
            reasoning and quantitative skills.
          </Text>
          <Text>
            <Button title="Courses" onPress={onCoursesPress} />
          </Text>
        </View>
        <View>
          <Image source={bg} style={{ width: 386, height: 256 }} />
        </View>
      </View>
      <View>
        <Text>&copy; Quant University 2020</Text>
      </View>
    </View>
  );
}
