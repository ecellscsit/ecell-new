import { useCallback, useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import http from "../../api/http.js";
import PageHeader from "../../components/common/PageHeader.jsx";

const SKELETON_RATIOS = ["3/4", "1/1", "4/5", "3/5", "5/4", "2/3", "1/1", "4/5"];

function Tile({ photo, onOpen }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  if (failed) return null; // toota hua link: tile chhupa do

  const label = photo.caption || photo.event;
  return (
    <figure
      className={`masonry-item ${loaded ? "loaded" : ""}`}
      onClick={onOpen}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      tabIndex={0}
      role='button'
      aria-label={label || "Open photo"}
    >
      <img
        src={photo.url}
        alt={label || "Gallery photo"}
        loading='lazy'
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
      {label && <figcaption>{label}</figcaption>}
    </figure>
  );
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState("");
  const [idx, setIdx] = useState(null); // lightbox: kaunsi photo khuli hai
  const touchX = useRef(null);

  useEffect(() => {
    http
      .get("/gallery")
      .then((r) => setPhotos(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const years = [...new Set(photos.map((p) => p.year).filter(Boolean))]
    .sort()
    .reverse();
  const shown = year ? photos.filter((p) => p.year === year) : photos;

  const close = useCallback(() => setIdx(null), []);
  const step = useCallback(
    (d) => setIdx((i) => (i + d + shown.length) % shown.length),
    [shown.length],
  );

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // peeche ka page scroll na ho
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [idx, close, step]);

  const current = idx !== null ? shown[idx] : null;

  return (
    <>
      <PageHeader title='Gallery' />
      <div className='container section'>
        {years.length > 0 && (
          <div className='tabs'>
            <button
              className={year === "" ? "active" : ""}
              onClick={() => setYear("")}
            >
              All
            </button>
            {years.map((y) => (
              <button
                key={y}
                className={year === y ? "active" : ""}
                onClick={() => setYear(y)}
              >
                {y}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className='masonry'>
            {SKELETON_RATIOS.map((r, i) => (
              <div
                key={i}
                className='masonry-item skeleton'
                style={{ aspectRatio: r }}
              />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <p className='muted'>No photos yet.</p>
        ) : (
          <div className='masonry'>
            {shown.map((p, i) => (
              <Tile key={p._id} photo={p} onOpen={() => setIdx(i)} />
            ))}
          </div>
        )}
      </div>

      {current && (
        <div
          className='gallery-lightbox'
          onClick={close}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); // swipe
            touchX.current = null;
          }}
        >
          <span className='lb-count'>
            {idx + 1} / {shown.length}
          </span>
          <button className='lb-btn lb-close' onClick={close} aria-label='Close'>
            <CloseIcon />
          </button>
          {shown.length > 1 && (
            <>
              <button
                className='lb-btn lb-prev'
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label='Previous photo'
              >
                <ChevronLeftIcon />
              </button>
              <button
                className='lb-btn lb-next'
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label='Next photo'
              >
                <ChevronRightIcon />
              </button>
            </>
          )}
          <img
            src={current.url}
            alt={current.caption || current.event || ""}
            onClick={(e) => e.stopPropagation()}
          />
          {(current.caption || current.event) && (
            <p className='lb-caption'>{current.caption || current.event}</p>
          )}
        </div>
      )}
    </>
  );
}
