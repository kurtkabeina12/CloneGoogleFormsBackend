/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Answers } from "src/DTO/answers.dto";
import { Card } from "src/DTO/card.dto";
import { Form } from "src/DTO/form.dto";
import { FormReportDTO } from "src/DTO/formReport.dto";
import { Section } from "src/DTO/section.dto";
import { subQuestions } from "src/DTO/subQuestion.dto";
import { Repository } from "typeorm";

@Injectable()
export class getFormReportService {
	constructor(
		@InjectRepository(Form)
		private formsRepository: Repository<Form>,

		@InjectRepository(Card)
		private cardsRepository: Repository<Card>,

		@InjectRepository(Answers)
		private answersRepository: Repository<Answers>,

		@InjectRepository(Section)
		private sectionsRepository: Repository<Section>,

		@InjectRepository(subQuestions)
		private subQuestionsRepository: Repository<subQuestions>,

	) { }

	async getFormReport(formId: string): Promise<FormReportDTO> {

		const form = [];

		const formInfo = await this.formsRepository.find({
			where: { id: formId },
			select: ["formTitle", "formEndDate"]
		})

		form.push(...formInfo);

		const sections = await this.sectionsRepository.find({
			where: { form: { id: formId } },
			select: ["id"]
		});

		console.log(sections);

		const questions = [];
		const subQuestions = [];

		for (const section of sections) {
			const sectionQuestions = await this.cardsRepository.find({
				where: { section: { id: section.id } },
				select: ["idQuestion", "question"]
			});

			questions.push(...sectionQuestions);

			for (const question of sectionQuestions) {
				const questionSubQuestions = await this.subQuestionsRepository.find({
					where: { card: { idQuestion: question.idQuestion } },
					select: ["idSubQuestion", "question"]
				});

				subQuestions.push(...questionSubQuestions);
			}
		}

		const combinedIds = [...questions.map(q => q.idQuestion), ...subQuestions.map(sq => sq.idSubQuestion)];

		const answers = await this.answersRepository.createQueryBuilder("answer")
			.where("answer.idQuestion IN (:...combinedIds)", { combinedIds })
			.orWhere("answer.idSubQuestion IN (:...combinedIds)", { combinedIds })
			.select(["answer.idQuestion", "answer.idSubQuestion", "answer.answers"])
			.getMany();


		console.log(answers);

		return {
			form,
			questions,
			subQuestions,
			answers
		};
	}
}
