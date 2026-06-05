import type { MorandiColor } from "../types";
import { MORANDI_COLORS } from "../data/colors";
import ColorSwatch from "./ColorSwatch";
import styles from "../styles/HomePage.module.css";

interface Props {
  selectedColor: MorandiColor | null;
  onSelect: (color: MorandiColor) => void;
}

export default function ColorPalette({ selectedColor, onSelect }: Props) {
  return (
    <div className={styles.palette}>
      {MORANDI_COLORS.map((color) => (
        <ColorSwatch
          key={color.id}
          color={color}
          selected={selectedColor?.id === color.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
