import React, { useState, useEffect } from 'react';

interface Recording {
  url: string;
  date: string;
  audio: HTMLAudioElement;
}

function Rahul() {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [playing, setPlaying] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert('MediaRecorder not supported on your browser, use Firefox or Chrome instead.');
    }
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    let audioChunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setRecordings((prev) => [
        ...prev,
        { url: audioUrl, date: new Date().toLocaleString(), audio: new Audio(audioUrl) },
      ]);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  const togglePlayPause = (index: number) => {
    const newRecordings = [...recordings];
    const currentAudio = newRecordings[index].audio;

    if (currentAudio.paused) {
      currentAudio.play();
      setPlaying({ ...playing, [index]: true });
    } else {
      currentAudio.pause();
      setPlaying({ ...playing, [index]: false });
    }

    currentAudio.onended = () => {
      setPlaying({ ...playing, [index]: false });
    };
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <header className="w-full p-4 bg-blue-500 text-white text-center text-2xl">Audio Recorder</header>
      {!recording && (
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={startRecording}>
          Start Recording
        </button>
      )}
      {recording && (
        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={stopRecording}>
          Stop Recording
        </button>
      )}
      <div className="space-y-2">
        {recordings.map((recording, index) => (
          <div key={index} className="flex items-center justify-between">
            <span>
              Recording {index + 1} - {recording.date}
            </span>
            <button className="px-2 py-1 bg-green-500 text-white rounded" onClick={() => togglePlayPause(index)}>
              {playing[index] ? 'Pause' : 'Play'}
            </button>
          </div>
        ))}
      </div>
      <footer className="w-full p-4 bg-gray-700 text-white text-center">Made with ❤ by Rahul</footer>
    </div>
  );
}

export default Rahul;
