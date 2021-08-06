// import Class from './models/Class';
// import Student from './models/Student';
// import Teacher from './models/Teacher';
// import sequelize from './connect';
import {
	Association,
	BelongsToCreateAssociationMixin,
	BelongsToGetAssociationMixin,
	BelongsToManyAddAssociationMixin,
	BelongsToManyAddAssociationsMixin,
	BelongsToManyCountAssociationsMixin,
	BelongsToManyCreateAssociationMixin,
	BelongsToManyGetAssociationsMixin,
	BelongsToManyHasAssociationMixin,
	BelongsToManyHasAssociationsMixin,
	BelongsToManyRemoveAssociationMixin,
	BelongsToManyRemoveAssociationsMixin,
	BelongsToManySetAssociationsMixin,
	BelongsToSetAssociationMixin,
	DataTypes,
	HasManyAddAssociationMixin,
	HasManyAddAssociationsMixin,
	HasManyCountAssociationsMixin,
	HasManyCreateAssociationMixin,
	HasManyGetAssociationsMixin,
	HasManyHasAssociationMixin,
	HasManyHasAssociationsMixin,
	HasManyRemoveAssociationMixin,
	HasManyRemoveAssociationsMixin,
	HasManySetAssociationsMixin,
	HasOneCreateAssociationMixin,
	HasOneGetAssociationMixin,
	HasOneSetAssociationMixin,
	Model,
	Optional,
	Sequelize
} from 'sequelize';

import bcrypt from 'bcryptjs';

// export const sequelize = new Sequelize(`postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:5432/${process.env.POSTGRES_DB}`);
// export const sequelize = new Sequelize(`postgresql://admin:ylvisR88ckar@localhost:5432/didunas`);
export const sequelize = new Sequelize('didunas', 'admin', 'ylvisR88ckar', {
	host: 'localhost',
	dialect: 'postgres'
});

export interface UserAttributes {
	id: number;
	username: string;
	email: string;
	fullname: string;
	password: string;
	age: number;
	type: 'student' | 'teacher' | 'researcher';
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'age' | 'email'>;

export class User extends Model<UserAttributes, UserCreationAttributes> {
	public id!: number;
	public username!: string;
	public email!: string;
	public fullname!: string;
	public password!: string;
	public age!: string;
	public type!: 'student' | 'teacher' | 'researcher';

	// timestamps
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	// HasOne associations
	public createCookie!: HasOneCreateAssociationMixin<Cookie>;
	public getCookie!: HasOneGetAssociationMixin<Cookie>;
	public setCookie!: HasOneSetAssociationMixin<Cookie, number>;

	// // BelongsToMany associations
	public addSchools!: BelongsToManyAddAssociationsMixin<School, number>;
	public addSchool!: BelongsToManyAddAssociationMixin<School, number>;
	public countSchools!: BelongsToManyCountAssociationsMixin;
	public createSchool!: BelongsToManyCreateAssociationMixin<School>;
	public getSchools!: BelongsToManyGetAssociationsMixin<School>;
	public hasSchool!: BelongsToManyHasAssociationMixin<School, number>;
	public hasSchools!: BelongsToManyHasAssociationsMixin<School, number>;
	public removeSchool!: BelongsToManyRemoveAssociationMixin<School, number>;
	public removeSchools!: BelongsToManyRemoveAssociationsMixin<School, number>;
	public setSchools!: BelongsToManySetAssociationsMixin<School, number>;

	public static associations: {
		school: Association<User, School>;
	};
}

User.init(
	{
		id: {
			type: new DataTypes.INTEGER(),
			autoIncrement: true,
			primaryKey: true
		},
		username: {
			type: new DataTypes.STRING(128),
			allowNull: false
		},
		password: {
			type: new DataTypes.STRING(128),
			allowNull: false
		},
		email: {
			type: new DataTypes.STRING(128),
			allowNull: true
		},
		fullname: {
			type: new DataTypes.STRING(128),
			allowNull: false
		},
		age: {
			type: new DataTypes.INTEGER(),
			allowNull: true
		},
		type: {
			type: new DataTypes.STRING(128),
			allowNull: false
		}
	},
	{
		tableName: 'users',
		sequelize // passing the `sequelize` instance is required
	}
);

export interface SchoolAttributes {
	id: number;
	name: string;
}

type SchoolCreatonAttributes = Optional<SchoolAttributes, 'id'>;

export class School extends Model<SchoolAttributes, SchoolCreatonAttributes> {
	public id!: number;
	public name!: string;

	// timestamps
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	// BelongsToMany associations
	public addUser!: BelongsToManyAddAssociationMixin<User, number>;
	public addUsers!: BelongsToManyAddAssociationsMixin<User, number>;
	public countUsers!: BelongsToManyCountAssociationsMixin;
	public createUser!: BelongsToManyCreateAssociationMixin<User>;
	public getUsers!: BelongsToManyGetAssociationsMixin<User>;
	public hasUser!: BelongsToManyHasAssociationMixin<User, number>;
	public hasUsers!: BelongsToManyHasAssociationsMixin<User, number>;
	public removeUser!: BelongsToManyRemoveAssociationMixin<User, number>;
	public removeUsers!: BelongsToManyRemoveAssociationsMixin<User, number>;
	public setUsers!: BelongsToManySetAssociationsMixin<User, number>;

	public readonly users?: User[];

	public static associations: {
		user: Association<School, User>;
	};
}

School.init(
	{
		id: {
			type: new DataTypes.INTEGER(),
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: new DataTypes.STRING(128),
			allowNull: false
		}
	},
	{
		tableName: 'schools',
		sequelize
	}
);

export interface CookieAttributes {
	id: number;
	cookieId: string;
}

type CookieCreationAttributes = Optional<CookieAttributes, 'id'>;

export class Cookie extends Model<CookieAttributes, CookieCreationAttributes> {
	public id!: number;
	public cookieId!: string;

	// timestamps
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	// // BelongsTo associations
	public getUser!: BelongsToGetAssociationMixin<User>;
	public createUser!: BelongsToCreateAssociationMixin<User>;
	public setUser!: BelongsToSetAssociationMixin<User, number>

	public static associations: {
		user: Association<Cookie, User>;
	};
}

Cookie.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		cookieId: {
			type: new DataTypes.STRING(128),
			allowNull: false
		},
	},
	{
		tableName: 'cookies',
		sequelize
	}
);


export interface TypeAttributes {
	id: number;
	name: string;
}

type TypeCreationAttributes = Optional<TypeAttributes, 'id'>;

export class Type extends Model<TypeAttributes, TypeCreationAttributes> {
	public id!: number;
	public name!: string;

	// timestamps
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	// HasMany Associations
	public getTasks!: HasManyGetAssociationsMixin<Task>;
	public setTasks!: HasManySetAssociationsMixin<Task, number>;
	public addTask!: HasManyAddAssociationMixin<Task, number>;
	public addTasks!: HasManyAddAssociationsMixin<Task, number>;
	public createTask!: HasManyCreateAssociationMixin<Task>;
	public removeTask!: HasManyRemoveAssociationMixin<Task, number>;
	public removeTasks!: HasManyRemoveAssociationsMixin<Task, number>;
	public hasTask!: HasManyHasAssociationMixin<Task, number>;
	public hasTasks!: HasManyHasAssociationsMixin<Task, number>;
	public countTasks!: HasManyCountAssociationsMixin;

	public static associations: {
		task: Association<Task, Type>;
	};


}

Type.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: new DataTypes.STRING(128),
			allowNull: false
		},
	},
	{
		tableName: 'types',
		sequelize
	}
);

export interface TaskAttributes {
	id: number;
	imageString: string;
	rightAnswer: string;
	difficulty: number;
	answerType: 'numbers' | 'twoColors' | 'threeColors';
}

type TaskCreationAttributes = Optional<TaskAttributes, 'id'>

export class Task extends Model<TaskAttributes, TaskCreationAttributes> {
	public id!: number;
	public imageString!: string;
	public rightAnswer!: string;
	public difficulty!: number;
	public answerType!: string;

	// timestamps
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	// BelongsTo Association
	public getType!: BelongsToGetAssociationMixin<Type>;
	public createType!: BelongsToCreateAssociationMixin<Type>;
	public setType!: BelongsToSetAssociationMixin<Type, number>

	public readonly Type?: Type;

	public static associations: {
		type: Association<Type, Task>;
	};

}

Task.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		imageString: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		answerType: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		difficulty: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		rightAnswer: {
			type: DataTypes.STRING,
			allowNull: false,
		}
	},
	{
		tableName: 'tasks',
		sequelize
	}
);

// Many Teachers to Many Classes, i.e. Multiple teachers can belong to a class, and a class can have multiple teachers.
School.belongsToMany(User, { through: 'school_user' });
User.belongsToMany(School, { through: 'school_user' });

Cookie.belongsTo(User);
User.hasOne(Cookie);

Task.belongsTo(Type);
Type.hasMany(Task)

sequelize.sync();

// //Used to force update the whole databse when there is a needed update
// sequelize.sync({ force: true }).then(async () => {
// 	// Table created
// 	console.log('NY DATABAS');

// 	const password = bcrypt.hashSync('janne');

// 	console.log('LÖSENORD!!!!!!', bcrypt.compareSync('janne', password));

// 	const student = await User.create({
// 		username: 'janne',
// 		email: 'janne@hotmail.com',
// 		fullname: 'Janne Andersson',
// 		age: 7,
// 		password: password,
// 		type: 'student'
// 	});

// 	await User.create({
// 		username: 'admin',
// 		email: 'andreas.nb.johansson@gmail.com',
// 		fullname: 'Andreas Johansson',
// 		password: password,
// 		type: 'researcher',
// 	})

// 	const school = await School.create({
// 		name: 'Kärna skola'
// 	});

// 	const teacher = await User.create({
// 		fullname: 'Anna Andersson',
// 		username: 'anna',
// 		email: 'anna@hotmail.com',
// 		password: password,
// 		type: 'teacher'
// 	});

// 	school.addUsers([student, teacher]);


// 	await Type.create({
// 		name: 'Enumeration'
// 	})
// 	await Type.create({
// 		name: 'PatternRecognition'
// 	})
// 	await Type.create({
// 		name: 'NumberLine'
// 	})
// 	await Type.create({
// 		name: 'Color'
// 	})


// 	// const foundTeachers = await foundClasses[0].getTeachers();
// });

// Printing out association functions to see if it works, and what is available.
for (const assoc of Object.keys(User.associations)) {
	for (const accessor of Object.keys(User.associations[assoc].accessors)) {
		console.log(`${User.name}.${User.associations[assoc].accessors[accessor]}()`);
	}
}

for (const assoc of Object.keys(School.associations)) {
	for (const accessor of Object.keys(School.associations[assoc].accessors)) {
		console.log(`${School.name}.${School.associations[assoc].accessors[accessor]}()`);
	}
}

for (const assoc of Object.keys(Cookie.associations)) {
	for (const accessor of Object.keys(Cookie.associations[assoc].accessors)) {
		console.log(`${Cookie.name}.${Cookie.associations[assoc].accessors[accessor]}()`);
	}
}

for (const assoc of Object.keys(Type.associations)) {
	for (const accessor of Object.keys(Type.associations[assoc].accessors)) {
		console.log(`${Type.name}.${Type.associations[assoc].accessors[accessor]}()`);
	}
}

for (const assoc of Object.keys(Task.associations)) {
	for (const accessor of Object.keys(Task.associations[assoc].accessors)) {
		console.log(`${Task.name}.${Task.associations[assoc].accessors[accessor]}()`);
	}
}


