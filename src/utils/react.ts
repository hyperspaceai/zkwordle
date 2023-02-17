import type { CSSProperties } from "react";

export type OmitChildren<T> = Omit<T, "children">;

export const style = <T extends CSSProperties & Record<string, unknown>>(_style: T) => _style as CSSProperties;
