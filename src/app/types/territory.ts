// import moment from "moment";

import { COLUMNS } from "@/constants";
import { TUser } from "./user";

// export type UnionOmit<T, K extends string | number | symbol> = T extends unknown
//   ? Omit<T, K>
//   : never;

// export type TEvent = {
//   id?: string;
//   title: string;
//   name1: string;
//   name2: string;
//   start: Date;
//   end: Date;
//   resourceId?: number | string;
// };

// export type TEventNew = UnionOmit<TEvent, "id">;

// export type TEventNewSlot = Pick<TEvent, "start" | "end" | "resourceId">;

// export type TEventDate = { date: Date | string };

// export type EventPopupProps = {
//   open: boolean;
//   data: TEvent | TEventDate | TEventNewSlot | null;
//   closeModal: () => void;
//   moment: typeof moment;
//   handleSave: (values: TEvent) => void;
//   handleDelete: (id: TEvent["id"]) => void;
//   message?: { status: string; text: string };
// };

export type TTerritoryHistory = Pick<
  TTerritory,
  "user" | "publisher" | "publisherId" | "given" | "returned"
>;

export type TTerritory = {
  id: string;
  title: string;
  code: string;
  comment: string;
  publisher: string;
  publisherId: string;
  given: Date;
  returned: Date;
  available: boolean;
  user?: Pick<TUser, "id" | "name">;
  history: TTerritoryHistory[];
  image: string;
  address: string;
};

export type TSortOrder = "desc" | "asc";

export type TAccessor = (typeof COLUMNS)[number]["accessor"];
