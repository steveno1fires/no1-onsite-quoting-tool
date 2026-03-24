import { useState, useRef, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function StepNotes({ value, onChange }: Props) {
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
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? " " : "") + transcript;
          onChange(finalTranscript);
        } else {
          interim += transcript;
        }
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, value, onChange]);

  return (
    <div className="animate-slide-in">
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
          className="min-h-[200px] resize-none"
        />
      </div>
    </div>
  );
}
