import { IQuiz } from "..\..\..\..\..\..\..\course-lib";

export const quiz: IQuiz = {
	name: "Calculating Left-to-Right",
	url: "left_to_right",
	tags: [],
	content: import("./content"),
	description: "When adding numbers start from the left side or highest power and work down from there.\n",
	items: [{"generator":"quant-u.mathematics.mental_math.mental_calculation.left_to_right","count":10,"config":{"var1Digits":2,"var2Digits":2}}],
};