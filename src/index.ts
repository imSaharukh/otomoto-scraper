import express, { Express, Request, Response } from "express";
import myDataSource from "./app-data-source";
import { initalUrl } from "./const";
import { TruckItemEntity } from "./entity/truckitems.entity";
import { Scraper } from "./scraper";
import "reflect-metadata";

const app: Express = express();
const port = process.env.PORT || 3000;

// establish database connection
myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

app.get("/scrape_data", async (req: Request, res: Response) => {
  const scraper = new Scraper();
  const data = await scraper.scrape();
  const count = await scraper.getTotalAdsCount(initalUrl);

  res.send({ totalAds: count, data });
});

app.get("/get_data_from_db", async (req: Request, res: Response) => {
  const data = await myDataSource.getRepository(TruckItemEntity).find();

  res.send({ data });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
