interface PhotoGalleryProps {
  photos: string[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="flex overflow-x-auto space-x-4 custom-scrollbar">
        {photos.map((photo, index) => (
          <div key={index} className="flex-none ">
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="h-96 object-contain p-5 "
            />
          </div>
        ))}
      </div>
    </div>
  );
}
