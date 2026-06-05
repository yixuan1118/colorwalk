// ColorWalk 类型定义

export interface MorandiColor {
  id: string;
  name: string;
  hex: string;
}

export interface DayEntry {
  dateKey: string; // "YYYY-MM-DD"
  colorId: string;
  colorName: string;
  colorHex: string;
  photos: Array<{
    id: string;
    dataUrl: string; // base64 data URL for rendering
    order: number; // 0-8
  }>;
  gridImage: string; // base64 data URL of the composed 3×3 grid
  createdAt: number;
}

export interface CaptureState {
  color: MorandiColor | null;
  photos: Array<{ id: string; dataUrl: string; order: number }>;
  maxSlots: 9;
}
