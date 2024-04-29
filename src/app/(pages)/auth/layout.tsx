import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const metadata = {
  title: "Авторизация | JW Centrs",
};

export default function AuthLayout({ children }: Props) {
  return (
    <section className="flex flex-col text-center mb-16 max-w-[25rem] p-4 container">
      {children}
    </section>
  );
}
