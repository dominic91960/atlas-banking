import { Sequelize } from "sequelize";

const host = process.env.PG_HOST!;
const port = parseInt(process.env.PG_PORT!, 10);
const user = process.env.PG_USER!;
const password = process.env.PG_PASSWORD!;
const database = process.env.PG_DATABASE!;

const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: "postgres",
  logging: false,
});

export default sequelize;
