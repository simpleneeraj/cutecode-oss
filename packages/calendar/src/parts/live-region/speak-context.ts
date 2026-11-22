"use client";

import { createContext } from "react";

export type Speak = (text: string) => void;

export const SpeakContext = createContext<Speak | null>(null);
