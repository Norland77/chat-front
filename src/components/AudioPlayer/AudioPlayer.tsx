import React, { useState, useRef, useEffect } from 'react';
import styles from './audio-player.module.scss'
import pause from '../../img/paus.svg'
import play from '../../img/play.svg'

interface AudioPlayerProps {
  src: string;
  name: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, name }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && progressRef.current) {
      const seekPosition = (e.nativeEvent.offsetX / progressRef.current.offsetWidth) * audioRef.current.duration;
      audioRef.current.currentTime = seekPosition;
      setProgress((seekPosition / audioRef.current.duration) * 100);
    }
  };

  const handleSeekMouseDown = () => {
    setIsSeeking(true);
  };

  const handleSeekMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSeeking && audioRef.current && progressRef.current) {
      const seekPosition = (e.nativeEvent.offsetX / progressRef.current.offsetWidth) * audioRef.current.duration;
      audioRef.current.currentTime = seekPosition;
      setProgress((seekPosition / audioRef.current.duration) * 100);
    }
  };

  const handleSeekMouseUp = () => {
    setIsSeeking(false);
  };

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio) {
        const currentTime = audio.currentTime;
        const duration = audio.duration;
        setProgress((currentTime / duration) * 100);
        setCurrentTime(currentTime);
        setDuration(duration);
      }
    };

    if (audio) {
      audio.addEventListener('timeupdate', updateProgress);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', updateProgress);
      }
    };
  }, []);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    return formattedTime;
  };

  return (
    <div className={styles.audioPlayer}>
      <audio ref={audioRef} src={src} />

      <div className={styles.right}>
        <div className={styles.playerBlock}>
          <div className={styles.playerBlock_main}>
            <div
              ref={progressRef}
              className={styles.progressBar}
              onClick={handleSeek}
              onMouseDown={handleSeekMouseDown}
              onMouseMove={handleSeekMouseMove}
              onMouseUp={handleSeekMouseUp}
            >
              <div className={styles.progress} style={{ width: `${progress}%` }}></div>
            </div>
            <div style={ currentTime > 0 ? {opacity: 1} : {opacity: 0}} className={styles.time}>
              <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
            </div>
          </div>
          <div className={styles.controls}>
            <div onClick={togglePlay}>
              {isPlaying ? <img src={pause} alt="pause"/> : <img src={play} alt="play"/>}
            </div>
          </div>
        </div>
        <div>
          <span>{name}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
