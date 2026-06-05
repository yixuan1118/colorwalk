import type { MorandiColor } from "../types";
import { composeGridImage } from "../utils/canvas";

export async function generateGridImage(
  photoDataUrls: (string | null)[],
  color: MorandiColor
): Promise<string> {
  return composeGridImage(photoDataUrls, color.hex);
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
