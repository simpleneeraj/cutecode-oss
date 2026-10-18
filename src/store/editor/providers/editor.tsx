"use client";

import { useState } from "react";
import { createStore, Provider } from "jotai";

type Props = {
  children: React.ReactNode;
};

export default function EditorProvider({ children }: Props) {
  const [store] = useState(createStore);
  return <Provider store={store}>{children}</Provider>;
}
