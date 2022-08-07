# OTOMOTO WEB SCRAPER

## Installation

```bash
$ git clone https://github.com/imSaharukh/otomoto-scraper.git
```


## Installation

```bash
$ yarn install
```

## Running

```bash

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## API end points


| Method     | url          | Description               | live url |
| -------- | -------------- | -------------------------- |--------|
| GET   | /scrape_data      | scrape all the ads of all pages, save to DB and return the result|[LINK](https://otomoto-scraper.herokuapp.com/scrape_data) (may take a few minutes to get data)|
| GET | /get_data_from_db       | get all the scraped ads from DB | [LINK](https://otomoto-scraper.herokuapp.com/get_data_from_db)|

