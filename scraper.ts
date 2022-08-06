import * as cheerio from "cheerio";
import { baseAxios, initalUrl } from "./const";

export class Scrapter {
  async scrape() {
    const items: any[] = [];
    let url: string | undefined = initalUrl;
    let currentPage = 1;
    while (true) {
      const html = await baseAxios.get(url);

      const $ = cheerio.load(html.data);

      this.addItems($, items);
      url = this.getNextPageUrl(currentPage, $);

      if (!url) break;

      currentPage++;
    }

    const truckItems = [];

    for await (const item of items) {
      const truckItem = await this.scrapeTruckItem(item.link);

      truckItems.push(truckItem);
    }

    return { data: truckItems };
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

  getTotalAdsCount($: cheerio.CheerioAPI) {
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

  async scrapeTruckItem(url: string) {
    //   throw new Error("Function not implemented.");
    //   const url =
    //     "https://www.otomoto.pl/oferta/mercedes-benz-actros-1848-giga-space-ID6EPiV6.html";

    const html = await baseAxios.get(url);
    const $ = cheerio.load(html.data);

    //   console.log("price ", $("div[class=offer-params__value]").eq(4).text());

    const itemId = $("#ad_id");
    const title = this.parseData($(".offer-title.big-text").first().text());
    const price = this.parseData(
      $("div[class=offer-price]").attr("data-price")?.replace(" ", "")
    );
    const regDate = this.parseData(
      $("div[class=offer-params__value]").eq(12).text()
    );
    const productionDate = this.parseData(
      $("div[class=offer-params__value]").eq(4).text()
    );
    const mileage = this.parseData(
      $("div[class=offer-params__value]").eq(5).text()
    );
    const power = this.parseData(
      $("div[class=offer-params__value]").eq(7).text()
    );

    const data = {
      itemId: itemId.html(),
      title: title,
      price: price,
      regDate: regDate,
      productionDate: productionDate,
      mileage: mileage,
      power: power,
    };

    console.log(data);
    return data;
  }

  parseData(data: string | undefined) {
    const result = data?.trim().replace("\n", "");
    if (!result || result == "") return "Not Found";
    return result;
  }
}
// scrapeTruckItem(){}

const scraper = new Scrapter();
scraper.scrape();
