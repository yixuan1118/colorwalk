import type { MorandiColor } from "../types";
import styles from "../styles/HomePage.module.css";

interface Props {
  color: MorandiColor;
  selected: boolean;
  onSelect: (color: MorandiColor) => void;
}

export default function ColorSwatch({ color, selected, onSelect }: Props) {
  return (
    <button
      className={`${styles.swatch} ${selected ? styles.swatchSelected : ""}`}
      style={{
        backgroundColor: color.hex,
        ...(selected
          ? ({
              "--swatch-color": color.hex,
            } as React.CSSProperties)
          : {}),
      }}
      onClick={() => onSelect(color)}
      aria-label={`选择${color.name}`}
    >
      {selected && (
        <span className={styles.swatchCheck}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </button>
  );
}
