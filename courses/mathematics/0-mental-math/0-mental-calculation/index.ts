import { IChapter } from ".\..\..\..\..\course-lib";
import { unit as calculating } from ".\0-calculating";
export const chapter: IChapter = {
	name: "Mental Calculation",
	url: "mental-calculation",
	logo: require("..\..\..\..\assets\courses\image\22fc87e38d6e178b3b16c068e5eab9d8.png"),
	tags: ["mental","calculation"],
	content: import("./content"),
	description: "Mental calculation consists of arithmetical calculations using only the human brain,\nwith no help from any supplies or devices such as a calculator.\n",
	units: [calculating],
	unitMap: {
		"calculating": calculating,
	},
};