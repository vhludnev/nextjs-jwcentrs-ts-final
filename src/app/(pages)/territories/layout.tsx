import type { ReactNode } from "react";

export const metadata = {
  title: "Территории | JW Centrs",
};

type Props = {
  children: ReactNode;
};

export default function TerritoryLayout({ children }: Props) {
  return (
    <section className="flex flex-start flex-col relative xxs:w-[94dvw] sm:w-full sm:container">
      {children}
    </section>
  );
}
