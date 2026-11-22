"use client";

import { createContext, type ReactNode } from "react";

import type { GridColumn } from "./columns";

export type ColumnHeaderRenderer = (column: GridColumn) => ReactNode;

export const ColumnHeaderContext = createContext<ColumnHeaderRenderer | null>(null);
