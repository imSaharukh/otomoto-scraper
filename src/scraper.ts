import * as cheerio from "cheerio";
import myDataSource from "./app-data-source";
import { baseAxios, initalUrl } from "./const";
import { TruckItemEntity } from "./entity/truckitems.entity";
import { TruckItem } from "./types/truck_item.type";

export class Scraper {
  async scrape(): Promise<TruckItem[]> {
    const items: any[] = [];
    let url: string | undefined = initalUrl;
    let currentPage = 1;
    while (true) {
      let html;
      try {
        html = await baseAxios.get(url);
      } catch (error) {
        console.log(error);
        break;
      }

      const $ = cheerio.load(html?.data);

      this.addItems($, items);
      url = this.getNextPageUrl(currentPage, $);

      // if ((currentPage = 1)) break; //for debug purposes

      if (!url) break;

      currentPage++;
    }

    const truckItems: TruckItem[] = [];

    for await (const item of items) {
      const truckItem = await this.scrapeTruckItem(item.link);

      if (!truckItem) {
        continue;
      }

      truckItems.push(truckItem);
    }

    return truckItems;
  }

  async addItems($: cheerio.CheerioAPI, items: any[]) {
    const articles = $('article[data-testid="listing-ad"]');

    $(articles).each((i, article) => {
      if (i === 0) return;
      const header = $(article).find("div:nth-child(1)");

      const link = header.find("a").attr("href");

      const id = $(article).attr("id");

      items.push({
        link,
        id,
      });
    });
  }

  async getTotalAdsCount(url: string) {
    const html = await baseAxios.get(url);

    const $ = cheerio.load(html.data);
    const total = $('h1[data-testid="results-heading"]')
      .text()
      ?.match(/\d/g)
      ?.join("");

    if (total) return Number(total);
    return Number(0);
  }

  getNextPageUrl(
    currentPage: number,
    $: cheerio.CheerioAPI
  ): string | undefined {
    const isMore = $('[title="Next Page"]').attr("aria-disabled") == "false";

    if (!isMore) {
      return undefined;
    }

    const nextPage = initalUrl + `&page=${currentPage}`;

    return nextPage;
  }

  async scrapeTruckItem(url: string): Promise<TruckItem | undefined> {
    let html;
    try {
      html = await baseAxios.get(url);
    } catch (error) {
      console.log(error);
      return {};
    }
    const $ = cheerio.load(html.data);

    const itemId = $("#ad_id");
    if (!itemId) return undefined;
    const title = this.parseData($(".offer-title.big-text").first().text());
    const price = this.parseData(
      $("div[class=offer-price]").attr("data-price")?.replace(" ", "")
    );
    const regDate = this.getTruckItemValue($, "Pierwsza rejestracja");
    const productionDate = this.getTruckItemValue($, "Rok produkcji");
    const mileage = this.getTruckItemValue($, "Przebieg");
    const power = this.getTruckItemValue($, "Moc");

    const data: TruckItem = {
      itemId: itemId.html()?.toString(),
      title: title,
      price: price,
      registrationDate: regDate,
      productionDate: productionDate,
      mileage: mileage,
      power: power,
    };

    console.log(data);
    const result = await myDataSource.getRepository(TruckItemEntity).upsert(
      {
        itemId: data.itemId,
        title: data.title,
        price: data.price ?? "Not Found",
        registrationDate: data.registrationDate,
        productionDate: data.productionDate,
        mileage: data.mileage,
        power: data.power,
      },
      { conflictPaths: ["itemId"], skipUpdateIfNoValuesChanged: true }
    );
    console.log(result);

    return data;
  }

  parseData(data: string | undefined) {
    const result = data?.trim().replace("\n", "");
    if (!result || result == "") return "Not Found";
    return result;
  }

  getTruckItemValue($: cheerio.CheerioAPI, label: string) {
    return this.parseData(
      $(".offer-params__item")
        .filter((i, el) => {
          return $(el).find(".offer-params__label").text() == label;
        })
        .find("div[class=offer-params__value]")
        .text()
    );
  }
}
