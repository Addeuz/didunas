/// <reference types="@sveltejs/kit" />

import type { Task } from "$lib/database";

export interface LoginAttributes {
	username: string;
	password: string;
}

export interface RegisterAttributes {
	username: string;
	password: string;
	passwordConfirmation: string,
	email: string;
	fullName: string,
	age: number;
	type: 'student' | 'teacher' | 'researcher';
	schoolId: number;
}

export interface NewTaskAttributes {
	typeId: number;
	difficulty: number;
	answerType: 'numbers' | 'twoColors' | 'threeColors';
	rightAnswer: string;
	file: string;
}
export interface EditFieldAttributes {
	editRightAnswer: string;
	editDifficulty: number;
	editFile: string;
	editTypeId: number;
	editAnswerType: 'numbers' | 'twoColors' | 'threeColors';
	editTask: Task;
}
