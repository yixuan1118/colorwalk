import { useRef } from "react";
import { resizeImage } from "../utils/canvas";

interface Props {
  onPhoto: (dataUrl: string) => void;
  disabled?: boolean;
}

const btnStyle: React.CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: "50%",
  background: "#4a4543",
  color: "#fff",
  fontSize: "1.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "3px solid #e8e4e0",
  cursor: "pointer",
  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
  flexShrink: 0,
};

export default function CameraButton({ onPhoto, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file, 800);
      onPhoto(dataUrl);
    } catch {
      // ignore
    }
    // Reset input so same file can be re-selected
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
      />
      <button
        style={btnStyle}
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        aria-label="拍照"
      >
        📸
      </button>
    </>
  );
}
