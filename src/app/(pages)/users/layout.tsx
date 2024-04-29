import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const metadata = {
  title: "Список зарегистрированных возвещателей | JW Centrs",
};

export default function AllUsersListLayout({ children }: Props) {
  return (
    <section className="flex-start flex-col relative xxs:w-[94dvw] sm:w-full sm:container">
      {children}
    </section>
  );
}
