//import moment from "moment";
//import "moment/locale/ru";
//import "moment/locale/lv";
import { AREA } from "@/constants";
import type { TAccess, TUser } from "@/types/user";
import type { TEvent } from "@/types/event";
import { RoundedSize } from "@/types/modal";
import { addMinutes, differenceInMinutes, format } from "date-fns";
//moment.locale("ru");

export const backgroundColor = (title: string) => {
  const area = AREA.find((a) => a.title === title);
  if (area) {
    return area.color;
  }
  return "#8B80F9";
};

export const transformedData = (el: any) => {
  return {
    ...el,
    start: new Date(Date.parse(el.start)),
    end: new Date(Date.parse(el.end)),
  };
};

// export const transformedTime = (date: Date, newHour: number) => {
//   const m = moment(date);
//   // @ts-expect-error
//   m.set({ h: newHour, m: "00" });
//   return m.toDate();
// };

export const capitalizeString = (string: string) => {
  return `${string.charAt(0).toUpperCase()}${string
    .slice(1)
    .toLocaleLowerCase()}`;
};

export const overlappingHours = (events: TEvent[], event: any) => {
  if (event.action !== "select") {
    return false;
  }
  const sameLocationEvents = events.filter(
    (el) =>
      el.resourceId === event.resourceId &&
      format(el.start, "yyyy-MM-dd") ===
        format(event.slots[0], "yyyy-MM-dd")
  );

  function getRange(
    startDate: TEvent["start"],
    endDate: TEvent["end"],
    //type = "minutes" as any
  ) {
    let fromDate = new Date(startDate);
    let toDate = new Date(endDate);

    let diff = differenceInMinutes(toDate, fromDate);
    let range = [];
    for (let i = 0; i < diff; i++) {
      range.push(addMinutes(startDate, i));
    }
    return range;
  }

  return sameLocationEvents.some((el) =>
    getRange(el.start, el.end).some((el) =>
      getRange(event.slots[0], event.slots[event.slots.length - 1]).includes(el)
    )
  );
};

export const resourceMap = AREA.map((a) => {
  return {
    resourceId: a.id,
    resourceTitle: a.title,
    resourceShortTitle: a.shortTitle,
  };
});

export const permissionClient = (access: TAccess, user: TUser) => {
  if (!user) return false;
  switch (access) {
    case "publisher":
      return user.verified && !!user.name;
    case "admin":
      return ["admin"].includes(user.status);
    default:
      return false;
  }
};

/* Validation: allowed two words in Russian or Latvian */
export const nameIsValid = (name: string) =>
  /^[a-vA-VzZāĀčČēĒģĢīĪķĶļĻņŅšŠūŪžŽ]+ ([\-a-vA-VzZāĀčČēĒģĢīĪķĶļĻņŅšŠūŪžŽ.]+)$|^[а-яА-ЯЁё]+ ([-а-яА-ЯЁё.]+)$/.test(
    name.trim()
  );

export const nameIsValidList = (name: string) =>
  /^[a-vA-VzZāĀčČēĒģĢīĪķĶļĻņŅšŠūŪžŽ.\s]*$|^[а-яА-ЯЁё.\s]*$/.test(name);

export const emailIsValid = (email: string) =>
  /^(\w[-._+\w]*\w@\w[-._\w]*\w\.\w{2,3})$/.test(email);

export const userMessage = (
  title: string,
  response: "success" | "error",
  value?: "google" | "credentials"
) => {
  switch (title) {
    case "name":
      return response === "success"
        ? "Имя возвещателя обнавлено успешно!"
        : response;
    case "email":
      return response === "success"
        ? "Адрес эл. почты возвещателя обнавлен успешно!"
        : response;
    case "provider":
      return response === "success"
        ? `${
            value === "google"
              ? "Авторизация через Гугл кнопку была активированна!"
              : "Авторизация через Гугл кнопку отключена!"
          }`
        : response;
    case "verified":
      return response === "success"
        ? "Возвещатель подтверждён успешно!"
        : response;
    case "status":
      return response === "success" ? "Доступ изменён успешно!" : response;
    default:
      return "";
  }
};

// export const formatDate = (
//   date: Date,
//   options?: Intl.DateTimeFormatOptions
// ) => {
//   return new Intl.DateTimeFormat(undefined, options).format(date);
// }; // formatDate(day, {weekday: "short"})

export const placeholder =
  "data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZWU2MTIzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBzdHlsZT0ibWFyZ2luOmF1dG87YmFja2dyb3VuZDp0cmFuc3BhcmVudDtkaXNwbGF5OmJsb2NrOyIgd2lkdGg9IjUwcHgiIGhlaWdodD0iNTBweCIgdmlld0JveD0iLTIwMCAtMjAwIDUwMCA1MDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIj4KPGcgdHJhbnNmb3JtPSJyb3RhdGUoMCA1MCA1MCkiPgogIDxyZWN0IHg9IjQ3LjUiIHk9IjEyLjUiIHJ4PSIxLjUiIHJ5PSIxLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjE1Ij4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iLTAuOTMzMzMzMzMzMzMzMzMzM3MiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+CiAgPC9yZWN0Pgo8L2c+PGcgdHJhbnNmb3JtPSJyb3RhdGUoMjQgNTAgNTApIj4KICA8cmVjdCB4PSI0Ny41IiB5PSIxMi41IiByeD0iMS41IiByeT0iMS41IiB3aWR0aD0iNSIgaGVpZ2h0PSIxNSI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiB2YWx1ZXM9IjE7MCIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgYmVnaW49Ii0wLjg2NjY2NjY2NjY2NjY2NjdzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPgogIDwvcmVjdD4KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDQ4IDUwIDUwKSI+CiAgPHJlY3QgeD0iNDcuNSIgeT0iMTIuNSIgcng9IjEuNSIgcnk9IjEuNSIgd2lkdGg9IjUiIGhlaWdodD0iMTUiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSItMC44cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4KICA8L3JlY3Q+CjwvZz48ZyB0cmFuc2Zvcm09InJvdGF0ZSg3MiA1MCA1MCkiPgogIDxyZWN0IHg9IjQ3LjUiIHk9IjEyLjUiIHJ4PSIxLjUiIHJ5PSIxLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjE1Ij4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iLTAuNzMzMzMzMzMzMzMzMzMzM3MiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+CiAgPC9yZWN0Pgo8L2c+PGcgdHJhbnNmb3JtPSJyb3RhdGUoOTYgNTAgNTApIj4KICA8cmVjdCB4PSI0Ny41IiB5PSIxMi41IiByeD0iMS41IiByeT0iMS41IiB3aWR0aD0iNSIgaGVpZ2h0PSIxNSI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiB2YWx1ZXM9IjE7MCIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgYmVnaW49Ii0wLjY2NjY2NjY2NjY2NjY2NjZzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPgogIDwvcmVjdD4KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDEyMCA1MCA1MCkiPgogIDxyZWN0IHg9IjQ3LjUiIHk9IjEyLjUiIHJ4PSIxLjUiIHJ5PSIxLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjE1Ij4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iLTAuNnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+CiAgPC9yZWN0Pgo8L2c+PGcgdHJhbnNmb3JtPSJyb3RhdGUoMTQ0IDUwIDUwKSI+CiAgPHJlY3QgeD0iNDcuNSIgeT0iMTIuNSIgcng9IjEuNSIgcnk9IjEuNSIgd2lkdGg9IjUiIGhlaWdodD0iMTUiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSItMC41MzMzMzMzMzMzMzMzMzMzcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4KICA8L3JlY3Q+CjwvZz48ZyB0cmFuc2Zvcm09InJvdGF0ZSgxNjggNTAgNTApIj4KICA8cmVjdCB4PSI0Ny41IiB5PSIxMi41IiByeD0iMS41IiByeT0iMS41IiB3aWR0aD0iNSIgaGVpZ2h0PSIxNSI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiB2YWx1ZXM9IjE7MCIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgYmVnaW49Ii0wLjQ2NjY2NjY2NjY2NjY2NjdzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPgogIDwvcmVjdD4KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDE5MiA1MCA1MCkiPgogIDxyZWN0IHg9IjQ3LjUiIHk9IjEyLjUiIHJ4PSIxLjUiIHJ5PSIxLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjE1Ij4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iLTAuNHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+CiAgPC9yZWN0Pgo8L2c+PGcgdHJhbnNmb3JtPSJyb3RhdGUoMjE2IDUwIDUwKSI+CiAgPHJlY3QgeD0iNDcuNSIgeT0iMTIuNSIgcng9IjEuNSIgcnk9IjEuNSIgd2lkdGg9IjUiIGhlaWdodD0iMTUiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIxOzAiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIGJlZ2luPSItMC4zMzMzMzMzMzMzMzMzMzMzcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4KICA8L3JlY3Q+CjwvZz48ZyB0cmFuc2Zvcm09InJvdGF0ZSgyNDAgNTAgNTApIj4KICA8cmVjdCB4PSI0Ny41IiB5PSIxMi41IiByeD0iMS41IiByeT0iMS41IiB3aWR0aD0iNSIgaGVpZ2h0PSIxNSI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiB2YWx1ZXM9IjE7MCIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgYmVnaW49Ii0wLjI2NjY2NjY2NjY2NjY2NjY2cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT4KICA8L3JlY3Q+CjwvZz48ZyB0cmFuc2Zvcm09InJvdGF0ZSgyNjQgNTAgNTApIj4KICA8cmVjdCB4PSI0Ny41IiB5PSIxMi41IiByeD0iMS41IiByeT0iMS41IiB3aWR0aD0iNSIgaGVpZ2h0PSIxNSI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiB2YWx1ZXM9IjE7MCIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgYmVnaW49Ii0wLjJzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPgogIDwvcmVjdD4KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDI4OCA1MCA1MCkiPgogIDxyZWN0IHg9IjQ3LjUiIHk9IjEyLjUiIHJ4PSIxLjUiIHJ5PSIxLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjE1Ij4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iLTAuMTMzMzMzMzMzMzMzMzMzMzNzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPgogIDwvcmVjdD4KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDMxMiA1MCA1MCkiPgogIDxyZWN0IHg9IjQ3LjUiIHk9IjEyLjUiIHJ4PSIxLjUiIHJ5PSIxLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjE1Ij4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iLTAuMDY2NjY2NjY2NjY2NjY2NjdzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPgogIDwvcmVjdD4KPC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDMzNiA1MCA1MCkiPgogIDxyZWN0IHg9IjQ3LjUiIHk9IjEyLjUiIHJ4PSIxLjUiIHJ5PSIxLjUiIHdpZHRoPSI1IiBoZWlnaHQ9IjE1Ij4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMTswIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+CiAgPC9yZWN0Pgo8L2c+Cjwvc3ZnPgo=";

export const cc = (...classes: unknown[]) => {
  return classes.filter((c) => typeof c === "string").join(" ");
};

export function formatDate(date: Date, options: any = {}, locale: string = 'ru-RU') {
  //return new Intl.DateTimeFormat(undefined, options).format(date)
  return new Intl.DateTimeFormat(locale, options).format(date)
}

export const rounded = (
  loc: "all" | "t" | "b" = "all",
  size: RoundedSize = "default"
) => {
  const r = "xs:rounded";

  if (loc == "all") {
    if (size == "default") {
      return "rounded";
    } else {
      return `rounded ${r}-${size}`;
    }
  } else {
    if (size == "default") {
      return `rounded-${loc}`;
    }
    return `rounded-${loc} ${r}-${loc}-${size}`;
  }
}; /* example: rounded("all", "lg") */
