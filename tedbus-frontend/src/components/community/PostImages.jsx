

const PostImages = ({ images }) => {
  if (!images || images.length === 0) return null;

  const count = images.length;

  return (
    <div className="mb-4 rounded-2xl overflow-hidden">
      {/* Case 1: Single Image */}
      {count === 1 && (
        <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-100">
          <img
            src={images[0].url}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Case 2: Two Images */}
      {count === 2 && (
        <div className="grid grid-cols-2 gap-1 h-64 sm:h-80 rounded-2xl overflow-hidden">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={`Post ${idx}`}
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      )}

      {/* Case 3: Three or More Images */}
      {count >= 3 && (
        <div className="grid grid-cols-2 gap-1 h-64 sm:h-80 rounded-2xl overflow-hidden">
          <img
            src={images[0].url}
            alt="Main"
            className="w-full h-full object-cover"
          />
          <div className="grid grid-rows-2 gap-1">
            <img
              src={images[1].url}
              alt="Second"
              className="w-full h-full object-cover"
            />
            <div className="relative">
              <img
                src={images[2].url}
                alt="Third"
                className="w-full h-full object-cover"
              />
              {count > 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xl font-black">
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