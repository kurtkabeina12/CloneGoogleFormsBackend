/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { Test } from "src/DTO/test.dto";
import { getTestDataService } from "src/service/getTestData.service";

@ApiTags('TestData')
@Controller('TestData')
export class getTestDataController {
	constructor(private readonly testsDataService: getTestDataService) { }

	@Post()
	@ApiBody({ type: [Test] })
	async handleFormData(@Body() body: any) {
		console.log(body, 'Received form data');
		const testData = body.testData;
		const testId = body.testId;
		const { registerEmail } = testData;
		await this.testsDataService.saveAnswers(testData, testId);
		// const totalPoints = await this.testsDataService.getEarnedPoints(registerEmail, testId)
		const checkPoints = await this.testsDataService.getUrlForCheckTestPoints(testId, registerEmail)
		// const allPageForCheck = await this.testsDataService.getAllPointsForQuestions(testId, registerEmail)
		return {
			message: 'Data received successfully',
			// totalPoints: totalPoints,
			userEmail: registerEmail,
			userId: checkPoints,
			// allPageForCheck: allPageForCheck,
		};
	}
}
