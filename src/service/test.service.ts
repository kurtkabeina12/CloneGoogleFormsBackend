/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Test } from 'src/DTO/test.dto';
import { SectionTest } from 'src/DTO/sectionTest.dto';
import { CardTest } from 'src/DTO/cardTest.dto';
import { subQuestionsTest } from 'src/DTO/subQuestionTest.dto';

@Injectable()
export class TestsService {
	constructor(
		@InjectRepository(Test)
		private testRepository: Repository<Test>,
		@InjectRepository(SectionTest)
		private sectionTestRepository: Repository<SectionTest>,
		@InjectRepository(CardTest)
		private cardTestRepository: Repository<CardTest>,
		@InjectRepository(subQuestionsTest)
		private subQuestionTestRepository: Repository<subQuestionsTest>,
	) { }

	async saveTest(testTitle: string, testOverview: string, testEndText: string, testEndDate: string, testBody: SectionTest[], isMandatoryAuth: boolean, selectedColor: string): Promise<{ testId: string }> {
		const test = new Test();
		test.testTitle = testTitle;
		test.testOverview = testOverview;
		test.testEndText = testEndText;
		test.testEndDate = testEndDate;
		test.selectedColor = selectedColor;
		const savedTest = await this.testRepository.save(test);
		let currentSectionOrder = 1;

		for (const sectionData of testBody) {
			const section = new SectionTest();
			section.title = sectionData.title;
			section.test = savedTest;
			section.order = currentSectionOrder++;
			const savedSection = await this.sectionTestRepository.save(section);
			let currentOrder = 1;

			for (const card of sectionData.cards) {
				card.section = savedSection;
				card.order = currentOrder++;
				if (card.addImg) {
					let imagePaths = [];
					if (Array.isArray(card.imageUrl)) {
						const imagePathsForCard = await Promise.all(card.imageUrl.map(async (imageBase64) => {
							return await this.saveImage(imageBase64, savedTest.id);
						}));
						imagePaths = imagePathsForCard;
					} else {
						const imagePath = await this.saveImage(card.imageUrl, savedTest.id);
						imagePaths.push(imagePath);
					}
					card.imageUrl = imagePaths.join(',');
				}

				const savedCard = await this.cardTestRepository.save(card);
				let currentSubOrder = 1;

				if (card.subQuestions && card.subQuestions.length > 0) {
					for (const subQuestion of card.subQuestions) {
						subQuestion.card = savedCard;
						subQuestion.order = currentSubOrder++;
						if (subQuestion.addImg) {
							let imagePaths = [];
							if (Array.isArray(subQuestion.imageUrl)) {
								const imagePathsForCard = await Promise.all(subQuestion.imageUrl.map(async (imageBase64) => {
									return await this.saveImage(imageBase64, savedTest.id);
								}));
								imagePaths = imagePathsForCard;
							} else {
								const imagePath = await this.saveImage(subQuestion.imageUrl, savedTest.id);
								imagePaths.push(imagePath);
							}
							subQuestion.imageUrl = imagePaths.join(',');
						}
						await this.subQuestionTestRepository.save(subQuestion);
					}
				}
			}
		}
		return { testId: String(savedTest.id) };
	}


	// Функция для удаления префикса
	async extractBase64String(imageBase64: string) {
		const base64Index = imageBase64.indexOf(';base64,') + 8;
		return imageBase64.substring(base64Index);
	}


	async saveImage(imageBase64: string, testId: string): Promise<string> {
		if (!imageBase64) {
			console.error('Image data is undefined');
			return '';
		}
		const base64String = await this.extractBase64String(imageBase64);
		const imageBuffer = Buffer.from(base64String, 'base64');
		const projectRoot = path.resolve(__dirname, '../../');
		const uniqueId = uuidv4();
		const imagePath = path.join(projectRoot, 'UsersImage', `${testId}_${uniqueId}.png`);

		const dir = path.dirname(imagePath);
		console.log('Saving image to:', imagePath);
		if (!fs.existsSync(dir)) {
			console.log('Creating directory:', dir);
			fs.mkdirSync(dir, { recursive: true });
		}
		try {
			await fs.promises.writeFile(imagePath, imageBuffer);
			console.log('Image saved successfully:', imagePath);
			return imagePath;
		} catch (error) {
			console.error('Error saving image:', error);
			return '';
		}

	}


	async getTest(testId: string): Promise<Test> {
		const test = await this.testRepository
			.createQueryBuilder('test')
			.leftJoinAndSelect('test.sections', 'section')
			.leftJoinAndSelect('section.cards', 'card')
			.leftJoinAndSelect('card.subQuestions', 'subQuestion')
			.where('test.id = :testId', { testId })
			.getMany(); // Получаем все формы сразу, так как дальнейшая сортировка будет происходить в памяти

		if (!test || !test.length) {
			throw new Error('Form not found');
		}

		// Сортируем секции по порядку
		test[0].sections.sort((a, b) => a.order - b.order);

		// Затем сортируем карты внутри секций
		test[0].sections.forEach(section => {
			section.cards.sort((a, b) => a.order - b.order);
		});

		// Наконец, сортируем подкарты внутри карт
		test[0].sections.forEach(section => {
			section.cards.forEach(card => {
				card.subQuestions.sort((a, b) => a.order - b.order);
			});
		});

		return test[0];
	}
}