/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Answers } from "src/DTO/answers.dto";
import { Card } from "src/DTO/card.dto";
import { Users } from "src/DTO/users.dto";
import { Repository } from "typeorm";

@Injectable()
export class getFormsDataService {
	constructor(
		@InjectRepository(Users)
		private usersRepository: Repository<Users>,

		@InjectRepository(Answers)
		private answersRepository: Repository<Answers>,

		@InjectRepository(Card)
		private cardsRepository: Repository<Card>,
	) { }

	async savePhoneNumber(phoneNumber: string): Promise<Users> {
		const user = this.usersRepository.create({ phoneNumber });
		return this.usersRepository.save(user);
	}

	async saveAnswers(formData: any, formId: string): Promise<void> {
		const { registerPhone } = formData;
	
		if (registerPhone) {
			await this.savePhoneNumber(registerPhone)
			let user = await this.usersRepository.findOne({ where: { phoneNumber: registerPhone } });
	
			if (!user) {
				user = this.usersRepository.create({ phoneNumber: registerPhone });
				await this.usersRepository.save(user);
			}
	
			for (const [idQuestion, answer] of Object.entries(formData)) {
				if (idQuestion !== 'registerPhone') {
					const filteredAnswers = Array.isArray(answer) ? answer.filter(a => a !== "null" && a !== null) : [answer];

					const answerEntity = this.answersRepository.create({
						phoneNumber: registerPhone,
						idForm: formId,
						user: user,
						idQuestion: idQuestion,
						answers: filteredAnswers
					});

					await this.answersRepository.save(answerEntity);
				}
			}
		} else {
			for (const [idQuestion, answer] of Object.entries(formData)) {
				const filteredAnswers = Array.isArray(answer) ? answer.filter(a => a !== "null" && a !== null) : [answer];
	
				const answerEntity = this.answersRepository.create({
					idForm: formId,
					idQuestion: idQuestion,
					answers: filteredAnswers
				});

				await this.answersRepository.save(answerEntity);
			}
		}
	}

	async getUserQuestionsAndAnswers(userId: number): Promise<any> {
		const userQuestionsAndAnswers = await this.answersRepository
			.createQueryBuilder("answers")
			.leftJoinAndSelect("answers.user", "user")
			.leftJoinAndSelect("answers.card", "card")
			.where("user.id = :userId", { userId })
			.select([
				"answers.idAnswer",
				"answers.phoneNumber",
				"answers.idQuestion",
				"answers.answers",
				"user.phoneNumber",
				"card.question"
			])
			.getMany();

		console.log(userQuestionsAndAnswers);
		return userQuestionsAndAnswers;
	}
}

