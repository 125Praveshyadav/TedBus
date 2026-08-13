import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";

const PostImages = ({ images }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const isOpen = lightboxIndex !== null;
  const count = images?.length || 0;

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const showPrev = useCallback(
    (e) => {
      e?.stopPropagation();
      setLightboxIndex((prev) => (prev > 0 ? prev - 1 : count - 1));
    },
    [count]
  );

  const showNext = useCallback(
    (e) => {
      e?.stopPropagation();
      setLightboxIndex((prev) => (prev < count - 1 ? prev + 1 : 0));
    },
    [count]
  );

  // Keyboard navigation + body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, showPrev, showNext]);

  if (!images || count === 0) return null;

  return (
    <>
      {/* ═══════════ IMAGE GRID ═══════════ */}
      <div className="relative w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        {/* Photo count badge — top-right */}
        {count > 1 && (
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-black text-white shadow-lg backdrop-blur-md">
            <ImageIcon className="h-3 w-3" />
            {count}
          </div>
        )}

        {/* ── Single Image ── */}
        {count === 1 && (
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="group relative block h-[280px] w-full overflow-hidden sm:h-[380px]"
          >
            <img
              src={images[0].url}
              alt="Post content"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        )}

        {/* ── Two Images ── */}
        {count === 2 && (
          <div className="grid h-[260px] w-full grid-cols-2 gap-1 sm:h-[360px]">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => openLightbox(idx)}
                className="group relative h-full w-full overflow-hidden"
              >
                <img
                  src={img.url}
                  alt={`Post content ${idx + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </button>
            ))}
          </div>
        )}

        {/* ── Three Images — asymmetric ── */}
        {count === 3 && (
          <div className="grid h-[280px] w-full grid-cols-3 gap-1 sm:h-[380px]">
            {/* Big left — spans 2 cols */}
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="group relative col-span-2 h-full w-full overflow-hidden"
            >
              <img
                src={images[0].url}
                alt="Post content 1"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </button>

            {/* Right column — 2 stacked */}
            <div className="grid grid-rows-2 gap-1">
              {[1, 2].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => openLightbox(idx)}
                  className="group relative h-full w-full overflow-hidden"
                >
                  <img
                    src={images[idx].url}
                    alt={`Post content ${idx + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Four or more — 2x2 grid with "+N" overlay ── */}
        {count >= 4 && (
          <div className="grid h-[280px] w-full grid-cols-2 grid-rows-2 gap-1 sm:h-[400px]">
            {images.slice(0, 4).map((img, idx) => {
              const isLast = idx === 3 && count > 4;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => openLightbox(idx)}
                  className="group relative h-full w-full overflow-hidden"
                >
                  <img
                    src={img.url}
                    alt={`Post content ${idx + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* +N more overlay on last visible image */}
                  {isLast && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 backdrop-blur-[2px] transition-colors duration-300 group-hover:bg-black/70">
                      <span className="text-3xl font-black tracking-wider text-white sm:text-4xl">
                        +{count - 4}
                      </span>
                      <span className="mt-0.5 text-[10px] font-black uppercase tracking-widest text-white/80">
                        more photos
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══════════ LIGHTBOX ═══════════ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Counter */}
          {count > 1 && (
            <div className="absolute left-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-white backdrop-blur-md">
              {lightboxIndex + 1} <span className="text-white/50">/</span> {count}
            </div>
          )}

          {/* Prev button */}
          {count > 1 && (
            <button
              type="button"
              onClick={showPrev}
              aria-label="Previous"
              className="absolute left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:left-6 sm:h-12 sm:w-12"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Main image */}
          <div
            className="mx-auto flex max-h-[90vh] max-w-[90vw] items-center justify-center px-14 sm:px-20"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex].url}
              alt={`Post content ${lightboxIndex + 1}`}
              className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
            />
          </div>

          {/* Next button */}
          {count > 1 && (
            <button
              type="button"
              onClick={showNext}
              aria-label="Next"
              className="absolute right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:right-6 sm:h-12 sm:w-12"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Bottom thumbnails */}
          {count > 1 && count <= 8 && (
            <div
              className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-white/10 px-2 py-2 backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className={`h-10 w-10 overflow-hidden rounded-lg ring-2 transition ${
                    idx === lightboxIndex
                      ? "ring-white scale-110"
                      : "ring-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`Thumb ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PostImages;