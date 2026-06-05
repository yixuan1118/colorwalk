import styles from "../styles/CameraPage.module.css";

interface PhotoData {
  id: string;
  dataUrl: string;
  order: number;
}

interface Props {
  photos: PhotoData[];
  maxSlots: number;
  selectedIndex: number | null;
  onSlotClick: (index: number) => void;
}

export default function PhotoGrid({
  photos,
  maxSlots,
  selectedIndex,
  onSlotClick,
}: Props) {
  const slots: (PhotoData | null)[] = Array.from({ length: maxSlots }, (_, i) => {
    return photos.find((p) => p.order === i) || null;
  });

  return (
    <div className={styles.grid}>
      {slots.map((photo, index) => (
        <button
          key={index}
          className={`${styles.slot} ${
            photo ? styles.slotFilled : styles.slotEmpty
          } ${selectedIndex === index ? styles.slotSelected : ""}`}
          onClick={() => onSlotClick(index)}
          aria-label={photo ? `第${index + 1}格，已拍照` : `第${index + 1}格，点击拍照`}
        >
          {photo && (
            <>
              <img src={photo.dataUrl} alt={`照片 ${index + 1}`} />
              <span className={styles.slotNumber}>{index + 1}</span>
            </>
          )}
        </button>
      ))}
    </div>
  );
}
