import { ImagesIcon, PlusIcon, XIcon } from "lucide-react";

function GalleryImagesInput({ images = [], onChange }) {
  const updateAt = (i, value) => {
    const next = [...images];
    next[i] = value;
    onChange(next);
  };

  const removeAt = (i) => {
    onChange(images.filter((_, idx) => idx !== i));
  };

  const addField = () => onChange([...images, ""]);

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text text-base font-medium flex items-center gap-1.5">
          <ImagesIcon className="size-4" />
          Additional Photos (optional)
        </span>
      </label>

      <div className="space-y-2">
        {images.map((url, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              placeholder={`https://example.com/photo-${i + 2}.jpg`}
              className="input input-bordered w-full"
              value={url}
              onChange={(e) => updateAt(i, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="btn btn-ghost btn-square"
              aria-label="Remove image"
            >
              <XIcon className="size-4" />
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={addField} className="btn btn-ghost btn-sm w-fit mt-2">
        <PlusIcon className="size-4 mr-1" />
        Add another photo
      </button>
    </div>
  );
}
export default GalleryImagesInput;
