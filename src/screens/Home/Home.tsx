import { Image } from "react-native";
import { Text, View, Button } from "native-base";
import bg from "../../../assets/bg.jpg";
import app from "../../../app.json";
import { Layout } from "../../Layout";

export function Home() {
  function onCoursesPress() {}

  return (
    <Layout>
      <View>
        <Text>{app.expo.name}</Text>
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
            <Button onPress={onCoursesPress}>Courses</Button>
          </Text>
        </View>
        <View>
          <Image source={bg} style={{ width: 386, height: 256 }} />
        </View>
      </View>
      <View>
        <Text>
          &copy; {app.expo.name} {new Date().getFullYear()}
        </Text>
      </View>
    </Layout>
  );
}
