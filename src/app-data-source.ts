import { DataSource } from "typeorm";

const myDataSource = new DataSource({
  type: "postgres",
  host: "ec2-50-19-255-190.compute-1.amazonaws.com",
  port: 5432,
  username: "olcnevtmqiqckp",
  password: "03bdb798b965cdce97551a48bc579a8e98514606a3551d0590b5c46a1af553ae",
  database: "d825t0fl5a148a",
  entities: ["src/entity/*{.js,.ts}"],
  logging: true,
  ssl: { rejectUnauthorized: false },
  dropSchema: true,
  synchronize: true,
});

export default myDataSource;