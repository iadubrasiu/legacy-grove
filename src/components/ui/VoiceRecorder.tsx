"use client";

import { useState, useRef } from "react";
import { Mic, Square, Play, Trash2 } from "lucide-react";

interface VoiceRecorderProps {
  onAudioCaptured: (audioData: string) => void;
}

export default function VoiceRecorder({ onAudioCaptured }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        // Safari prefiere mp4, Chrome webm
        const mimeType = MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Convert to Base64 for storage
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onAudioCaptured(base64data);
        };
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("Error al acceder al micrófono: " + err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all tracks to release microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    onAudioCaptured("");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
      {!audioUrl ? (
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            isRecording ? "bg-red-500 animate-pulse" : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {isRecording ? <Square size={24} className="text-white" fill="currentColor" /> : <Mic size={32} className="text-white" />}
        </button>
      ) : (
        <div className="flex items-center gap-4 w-full">
          <audio src={audioUrl} controls className="flex-1 h-10" />
          <button type="button" onClick={deleteRecording} className="p-2 text-red-400 hover:text-red-300">
            <Trash2 size={20} />
          </button>
        </div>
      )}
      <p className="text-xs text-gray-400">
        {isRecording ? "Grabando... (Pulsa para parar)" : audioUrl ? "Audio guardado" : "Toca para grabar voz"}
      </p>
    </div>
  );
}
