import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const metadata = {
  title: "Смена пароля | JW Centrs",
};

export default function PassForgotLayout({ children }: Props) {
  return (
    <section className="text-center mb-16 max-w-[25rem] p-4 container">
      {children}
    </section>
  );
}
