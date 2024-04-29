export const AREA = [
  { id: 1, title: "Rīgas-Alejas", shortTitle: "Rīg.-Alejas", color: "#C76D7E" },
  {
    id: 2,
    title: "Vienības-Lačpleša",
    shortTitle: "Vien.-Lačpleša",
    color: "#58A4B0",
  },
  {
    id: 3,
    title: "Vienības-Rīgas",
    shortTitle: "Vien.-Rīgas",
    color: "#FD8B49",
  },
  {
    id: 4,
    title: "Viestura-Imantas",
    shortTitle: "Viest.-Imantas",
    color: "#8B80F9",
  },
  {
    id: 5,
    title: "Viestura-Raiņa",
    shortTitle: "Viest.-Raiņa",
    color: "#939F5C",
  },
  {
    id: 6,
    title: "Viestura-Saules",
    shortTitle: "Viest.-Saules",
    color: "#00B85C",
  },
  { id: 7, title: "Žestu", shortTitle: "Žestu", color: "#63C5DA" },
  { id: 8, title: "Esplanāde", shortTitle: "Esplanāde", color: "#C19C0B" },
  {
    id: 9,
    title: "Aveņu centrs",
    shortTitle: "Aveņu centrs",
    color: "#9684A1",
  },
];

export const COLUMNS = [
  { label: "#", accessor: "number", sortable: false },
  { label: "Код", accessor: "code", sortable: true },
  {
    label: "Название",
    accessor: "title",
    sortable: false /* , sortbyOrder: 'desc' */,
  },
  { label: "Выдана", accessor: "given", sortable: true },
  { label: "Возвещатель", accessor: "publisher", sortable: true },
  { label: "Возвращена", accessor: "returned", sortable: true },
  { label: "Статус", accessor: "available", sortable: false },
] as const;

export const TERRITORIES_PER_PAGE =
  process.env.NODE_ENV !== "production" ? 40 : 25;

export const MODERATOR_PERMISSION_IDS =
  process.env.NEXT_PUBLIC_MODERATOR_PERMISSION_IDS?.split(",") || [];
export const BLACKLIST_EMAILS = process.env.BLACKLIST_EMAILS?.split(",") || [];

// export const roundedSize = {
//   none: "rounded-none",
//   default: "rounded",
//   sm: "rounded-sm",
//   md: "rounded-md",
//   lg: "rounded-lg",
//   xl: "rounded-xl",
//   "2xl": "rounded-2xl",
//   "3xl": "rounded-3xl",
//   full: "rounded-full",
// };
