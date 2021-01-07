import { IUnit } from ".\..\..\..\..\..\course-lib";
import { quiz as leftToRight } from ".\quizzes\0-left_to_right";
export const unit: IUnit = {
	name: "Calculating",
	url: "calculating",
	logo: require("..\..\..\..\..\assets\courses\image\22fc87e38d6e178b3b16c068e5eab9d8.png"),
	tags: ["calculating"],
	content: import("./content"),
	description: "A calculation is a deliberate process that transforms one or more inputs into one or more results.\n",
	quizzes: [leftToRight],
	quizMap: {
		"left_to_right": leftToRight,
	},
}