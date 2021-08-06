import { Sequelize } from "sequelize";

const sequelize = new Sequelize('didunas', 'admin', 'ylvisR88ckar', {
	host: 'localhost',
	dialect: 'postgres'
});

export default sequelize;