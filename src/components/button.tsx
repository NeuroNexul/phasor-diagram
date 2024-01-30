import React from "react";

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  children: React.ReactNode;
};

export default function Button(props: Props) {
  return (
    <button
      {...props}
      className={
        "relative p-2 bg-[1e293b] border-none rounded-md cursor-pointer hover:bg-[#3e4c59] transition-colors duration-200 ease-in-out" +
        props.className
      }
    >
      {props.children}
    </button>
  );
}
