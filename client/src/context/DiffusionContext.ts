import { createContext } from "react";
import { TDiffusion, TDiffusionsAction } from "../App";

export const DiffusionContext = createContext<TDiffusion[]>([]);
export const DiffusionDispatchContext = createContext<
  React.Dispatch<TDiffusionsAction>
>(null!);
