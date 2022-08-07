import axios from "axios";

export const baseURL = "https://www.otomoto.pl";
export const baseAxios = axios.create({ baseURL: baseURL });
export const initalUrl =
  "ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at%3Adesc";
