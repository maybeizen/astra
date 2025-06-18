import { InputLabel, TextArea, Input } from "@/components/ui";

interface EmbedEditorProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  color: string;
  setColor: (value: string) => void;
  image: string;
  setImage: (value: string) => void;
}

export function EmbedEditor({
  title,
  setTitle,
  description,
  setDescription,
  color,
  setColor,
  image,
  setImage,
}: EmbedEditorProps) {
  return (
    <div className="bg-neutral-700/30 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium text-neutral-300">Embed Settings</h5>
        <div className="flex items-center space-x-2">
          <div
            className="w-6 h-6 rounded border-2 border-neutral-600"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs text-neutral-400">{color}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <InputLabel htmlFor="embed-title">Embed Title</InputLabel>
          <Input
            id="embed-title"
            placeholder="Welcome!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <InputLabel htmlFor="embed-color">Embed Color</InputLabel>
          <div className="flex space-x-2">
            <Input
              id="embed-color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-10 p-1"
            />
            <Input
              placeholder="#5865F2"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div>
        <InputLabel htmlFor="embed-description">Embed Description</InputLabel>
        <TextArea
          id="embed-description"
          rows={3}
          placeholder="Welcome to our amazing community!"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <InputLabel htmlFor="embed-image">Embed Image URL</InputLabel>
        <Input
          id="embed-image"
          placeholder="https://example.com/image.png"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        {image && (
          <div className="mt-2">
            <img
              src={image}
              alt="Embed preview"
              className="max-w-full h-32 object-cover rounded border border-neutral-600"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      {(title || description || image) && (
        <div className="mt-4 p-3 bg-neutral-800/50 rounded border border-neutral-600">
          <h6 className="text-xs font-medium text-neutral-400 mb-2">Preview</h6>
          <div
            className="p-3 rounded border-l-4"
            style={{ borderLeftColor: color }}
          >
            {title && (
              <h4 className="font-semibold text-white mb-1">{title}</h4>
            )}
            {description && (
              <p className="text-neutral-300 text-sm">{description}</p>
            )}
            {image && (
              <img
                src={image}
                alt="Preview"
                className="mt-2 max-w-full h-20 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
