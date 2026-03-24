import { useState, useRef, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Camera, X } from "lucide-react";
import { SitePhotos } from "@/types/quote";

interface Props {
  value: string;
  onChange: (value: string) => void;
  photos: SitePhotos;
  onPhotosChange: (photos: SitePhotos) => void;
}

const PHOTO_CATEGORIES: { key: keyof SitePhotos; label: string; hint: string }[] = [
  { key: "current", label: "Current Setup", hint: "What the customer has now" },
  { key: "upClose", label: "Up Close", hint: "Close-up detail shots" },
  { key: "outside", label: "Outside / Access", hint: "External access & chimney" },
];

function PhotoSection({
  label,
  hint,
  photos,
  onAdd,
  onRemove,
}: {
  label: string;
  hint: string;
  photos: string[];
  onAdd: (files: FileList) => void;
  onRemove: (index: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-semibold">{label}</Label>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => inputRef.current?.click()}
        >
          <Camera className="h-4 w-4" />
          Add
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) {
              onAdd(e.target.files);
              e.target.value = "";
            }
          }}
        />
      </div>
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((src, i) => (
            <div key={i} className="relative group rounded-md overflow-hidden aspect-square">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function StepNotes({ value, onChange, photos, onPhotosChange }: Props) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const supported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-GB";
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = value;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? " " : "") + transcript;
          onChange(finalTranscript);
        }
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, value, onChange]);

  const addPhotos = (key: keyof SitePhotos, files: FileList) => {
    const readers = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((dataUrls) => {
      onPhotosChange({ ...photos, [key]: [...photos[key], ...dataUrls] });
    });
  };

  const removePhoto = (key: keyof SitePhotos, index: number) => {
    onPhotosChange({ ...photos, [key]: photos[key].filter((_, i) => i !== index) });
  };

  return (
    <div className="animate-slide-in space-y-4">
      {/* Notes */}
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Additional Notes</Label>
          {supported && (
            <Button
              type="button"
              variant={isListening ? "destructive" : "outline"}
              size="sm"
              onClick={toggleListening}
              className="gap-2"
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Voice Note
                </>
              )}
            </Button>
          )}
        </div>
        {isListening && (
          <p className="text-xs text-destructive animate-pulse">🔴 Listening…</p>
        )}
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Any additional notes about the installation, access requirements, or customer preferences..."
          className="min-h-[150px] resize-none"
        />
      </div>

      {/* Site Photos */}
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-4">
        <Label className="text-sm font-semibold">Site Photos</Label>
        {PHOTO_CATEGORIES.map((cat) => (
          <PhotoSection
            key={cat.key}
            label={cat.label}
            hint={cat.hint}
            photos={photos[cat.key]}
            onAdd={(files) => addPhotos(cat.key, files)}
            onRemove={(i) => removePhoto(cat.key, i)}
          />
        ))}
      </div>
    </div>
  );
}
