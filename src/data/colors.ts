import type { MorandiColor } from "../types";

// 莫兰迪色系 — 红橙黄绿蓝紫粉黑白灰，每色有雅致中文名
export const MORANDI_COLORS: MorandiColor[] = [
  { id: "red", name: "灰玫瑰", hex: "#C4A8A2" },
  { id: "orange", name: "暖杏橙", hex: "#C8AB8A" },
  { id: "yellow", name: "奶油黄", hex: "#C8C0A0" },
  { id: "green", name: "鼠尾草绿", hex: "#B5C1A6" },
  { id: "blue", name: "雾霾蓝", hex: "#9EACBA" },
  { id: "purple", name: "烟熏紫", hex: "#B0A8B9" },
  { id: "pink", name: "蜜桃粉", hex: "#D4B8B8" },
  { id: "black", name: "墨灰", hex: "#6B6563" },
  { id: "white", name: "月牙白", hex: "#E8E4E0" },
  { id: "gray", name: "暖灰", hex: "#B8B0A8" },
];

export function getColorById(id: string): MorandiColor | undefined {
  return MORANDI_COLORS.find((c) => c.id === id);
}
