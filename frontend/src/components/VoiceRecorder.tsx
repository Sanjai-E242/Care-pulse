import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  isRecording: boolean;
  setIsRecording: (rec: boolean) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscript,
  isRecording,
  setIsRecording
}) => {
  const [supported, setSupported] = useState<boolean>(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      if (currentTranscript.trim()) {
        onTranscript(currentTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition status:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!supported) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition', err);
      }
    }
  };

  if (!supported) {
    return (
      <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs text-amber-800 dark:text-amber-300">
        <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
        <span>Voice input is not supported in this browser. You can type your observation directly below.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center my-2">
      <button
        type="button"
        onClick={toggleRecording}
        className={`relative group flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 shadow-xl ${
          isRecording
            ? 'bg-red-600 text-white ring-8 ring-red-100 dark:ring-red-950/50 animate-pulse'
            : 'bg-teal-600 hover:bg-teal-700 text-white hover:scale-105 ring-4 ring-teal-50 dark:ring-teal-950/40'
        }`}
        title={isRecording ? 'Click to Stop Recording' : 'Click to Speak'}
      >
        {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        {isRecording && (
          <span className="absolute -bottom-7 text-xs font-bold text-red-600 dark:text-red-400 tracking-wide uppercase">
            Listening...
          </span>
        )}
      </button>
      <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
        {isRecording ? 'Speak now into microphone' : 'Tap to speak observation'}
      </span>
    </div>
  );
};