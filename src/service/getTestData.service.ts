/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AnswersTest } from "src/DTO/answertsTest.dto";
import { CardTest } from "src/DTO/cardTest.dto";
import { checkPointsTest } from "src/DTO/checkPointsTest.dto";
import { subQuestionsTest } from "src/DTO/subQuestionTest.dto";
import { UsersEmails } from "src/DTO/usersEmail.dto";
import { Repository } from "typeorm";

@Injectable()
export class getTestDataService {
	constructor(
		@InjectRepository(UsersEmails)
		private usersEmailsRepository: Repository<UsersEmails>,

		@InjectRepository(AnswersTest)
		private answersTestRepository: Repository<AnswersTest>,

		@InjectRepository(CardTest)
		private cardsTestRepository: Repository<CardTest>,

		@InjectRepository(subQuestionsTest)
		private subQuestionsTestRepository: Repository<subQuestionsTest>,

		@InjectRepository(checkPointsTest)
		private checkPoinsTestRepository: Repository<checkPointsTest>,
	) { }

	async savePhoneNumber(registerEmail: string, idTest: string): Promise<UsersEmails> {
		// Проверяем, существует ли уже пользователь с таким registerEmail
		const existingUser = await this.usersEmailsRepository.findOne({ where: { registerEmail } });

		if (existingUser) {
			// Проверяем, прошёл ли пользователь данный тест
			const testTaken = await this.answersTestRepository.findOne({ where: { registerEmail: existingUser.registerEmail, idTest } });

			if (testTaken) {
				// Если пользователь уже прошёл тест, возвращаем ошибку
				throw new HttpException('User already exists', HttpStatus.CONFLICT);
			} else {
				// Если пользователь существует, но не прошёл тест, возвращаем существующего пользователя
				return existingUser;
			}
		} else {
			// Если пользователя нет, создаем нового и сохраняем его
			const user = this.usersEmailsRepository.create({ registerEmail });
			return this.usersEmailsRepository.save(user);
		}
	}


	async saveAnswers(testData: any, testId: string): Promise<void> {
		const { registerEmail } = testData;
		console.log(testId, registerEmail, "formData and registerEmail");
		await this.savePhoneNumber(registerEmail, testId)
		let user = await this.usersEmailsRepository.findOne({ where: { registerEmail: registerEmail } });

		if (!user) {
			user = this.usersEmailsRepository.create({ registerEmail: registerEmail });
			await this.usersEmailsRepository.save(user);
		}

		for (const [idQuestion, answer] of Object.entries(testData)) {
			if (idQuestion !== 'registerEmail') {
				const filteredAnswers = Array.isArray(answer) ? answer.filter(a => a !== "null" && a !== null) : [answer];
				let idField = 'idQuestion';

				if (idQuestion.includes('card')) {
					idField = 'idQuestion';
				} else if (idQuestion.includes('subCard')) {
					idField = 'idSubQuestion';
				}

				const idPart = idQuestion.split(':').shift().trim();

				const answerEntity = this.answersTestRepository.create({
					registerEmail: registerEmail,
					idTest: testId,
					userEmail: user,
					[idField]: idPart,
					answers: filteredAnswers,
				});
				console.log(answerEntity, 'answerEntity');
				await this.answersTestRepository.save(answerEntity);
			}
		}
		this.getAllPointsForQuestions(registerEmail, testId)
	}

	async getUrlForCheckTestPoints(testId: string, registerEmail: string): Promise<string> {
		// Находим пользователя по registerEmail
		const user = await this.usersEmailsRepository.findOne({ where: { registerEmail } });

		if (!user) {
			throw new Error('User not found');
		}

		const userId = user.id;

		return userId
		
	}

	async getAllPointsForQuestions(registerEmail: string, testId: string): Promise<void> {
    const answers = await this.answersTestRepository.find({ where: { registerEmail: registerEmail, idTest: testId } });
		const user = await this.usersEmailsRepository.findOne({ where: { registerEmail } });

    for (const answer of answers) {
        let questionDetails: CardTest | subQuestionsTest;
        if (answer.idQuestion) {
            questionDetails = await this.cardsTestRepository.findOne({ where: { idQuestion: answer.idQuestion } });
        } else if (answer.idSubQuestion) {
            questionDetails = await this.subQuestionsTestRepository.findOne({ where: { idSubQuestion: answer.idSubQuestion } });
        }

        if (!questionDetails) {
            continue;
        }

        const userAnswer = typeof answer.answers === 'string' ? [answer.answers] : answer.answers;
        const correctAnswers = typeof questionDetails.correctAnswer === 'string' ? [questionDetails.correctAnswer] : questionDetails.correctAnswer;

        let points = 0;
        if (questionDetails.selectedComponent === "Checkbox") {
            const totalCorrectAnswers = correctAnswers.length;
            const selectedCorrectAnswers = userAnswer.filter(answer => correctAnswers.includes(answer)).length;
            points = Math.round((selectedCorrectAnswers / totalCorrectAnswers) * questionDetails.points);
        } else if (JSON.stringify(userAnswer.sort()) === JSON.stringify(correctAnswers.sort())) {
            points = questionDetails.points;
        }

        const checkPointRecord = this.checkPoinsTestRepository.create({
						userId: user.id,
            idTest: testId,
            idQuestion: answer.idQuestion || null,
            idSubQuestion: answer.idSubQuestion || null,
            correctAnswers: JSON.stringify(correctAnswers),
            UserAnswers: JSON.stringify(userAnswer),
            correctPoints: questionDetails.points,
            UserPoints: points,
            card: answer.idQuestion ? { idQuestion: answer.idQuestion } : null,
            subQuestion: answer.idSubQuestion ? { idSubQuestion: answer.idSubQuestion } : null
        });

        await this.checkPoinsTestRepository.save(checkPointRecord);
    }
}


	async getEarnedPoints(email: string, testId: string): Promise<number> {
		let totalPoints = 0;

		const user = await this.usersEmailsRepository.findOne({ where: { registerEmail: email } });
		if (!user) {
			throw new Error('User not found');
		}

		const answers = await this.answersTestRepository.find({ where: { registerEmail: user.registerEmail, idTest: testId } });

		for (const answer of answers) {
			let questionDetails: CardTest | subQuestionsTest;
			if (answer.idQuestion) {
				questionDetails = await this.cardsTestRepository.findOne({ where: { idQuestion: answer.idQuestion } });
				console.log(questionDetails, 'questionDetails');
			} else if (answer.idSubQuestion) {
				questionDetails = await this.subQuestionsTestRepository.findOne({ where: { idSubQuestion: answer.idSubQuestion } });
			}

			if (!questionDetails) {
				continue;
			}

			const userAnswer = typeof answer.answers === 'string' ? [answer.answers] : answer.answers;
			const correctAnswers = typeof questionDetails.correctAnswer === 'string' ? [questionDetails.correctAnswer] : questionDetails.correctAnswer;

			if (questionDetails.selectedComponent === "Checkbox") {
				const totalCorrectAnswers = correctAnswers.length;
				const selectedCorrectAnswers = userAnswer.filter(answer => correctAnswers.includes(answer)).length;
				const pointsForCheckbox = (selectedCorrectAnswers / totalCorrectAnswers) * questionDetails.points;
				totalPoints += pointsForCheckbox;
			} else if (JSON.stringify(userAnswer.sort()) === JSON.stringify(correctAnswers.sort())) {
				totalPoints += questionDetails.points;
			}
		}
		console.log(totalPoints, "totalPoints")
		return totalPoints;
	}
}