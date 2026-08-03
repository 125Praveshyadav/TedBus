import React from "react";

const PostImages = ({ images }) => {
  if (!images || images.length === 0) return null;

  const count = images.length;

  return (
    <div className="mb-4 w-full cursor-pointer overflow-hidden rounded-[1.25rem] border border-slate-100 dark:border-slate-800">
      
      {/* Case 1: Single Image */}
      {count === 1 && (
        <div className="group relative h-[250px] w-full overflow-hidden bg-slate-100 dark:bg-slate-900 sm:h-[350px]">
          <img
            src={images[0].url}
            alt="Post content"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {/* Case 2: Two Images (Side by Side) */}
      {count === 2 && (
        <div className="flex h-[250px] w-full gap-1 sm:h-[350px]">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="group relative h-full w-1/2 overflow-hidden bg-slate-100 dark:bg-slate-900"
            >
              <img
                src={img.url}
                alt={`Post content ${idx + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}

      {/* Case 3: Three or More Images */}
      {count >= 3 && (
        <div className="grid h-[250px] grid-cols-2 gap-1 sm:h-[350px]">
          {/* Left Column - Main Image */}
          <div className="group relative h-full w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
            <img
              src={images[0].url}
              alt="Post content 1"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Right Column - Two Rows */}
          <div className="grid grid-rows-2 gap-1">
            <div className="group relative h-full w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
              <img
                src={images[1].url}
                alt="Post content 2"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="group relative h-full w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
              <img
                src={images[2].url}
                alt="Post content 3"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Overlay for Extra Images */}
              {count > 3 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-colors duration-300 group-hover:bg-black/50">
                  <span className="text-2xl font-black tracking-wider text-white sm:text-3xl">
                    +{count - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PostImages;