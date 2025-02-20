import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  SkipBack,
  Settings,
  Rewind,
  FastForward,
} from "lucide-react";

interface VideoPlayerProps {
  videoPath: string;
  onError: (error: string) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoPath, onError }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const mediaUrl = `file:///${videoPath}`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleError = () => {
      const videoError = video.error;
      setIsLoading(false);

      let errorMessage = "An unknown error occurred";
      if (videoError) {
        switch (videoError.code) {
          case 1:
            errorMessage = "Video loading was aborted";
            break;
          case 2:
            errorMessage = "Network error occurred while loading video";
            break;
          case 3:
            errorMessage =
              "Video decoding failed - format may not be supported";
            break;
          case 4:
            errorMessage = "Video format or codec is not supported";
            break;
        }
      }
      setError(errorMessage);
      setIsPlaying(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          e.preventDefault();
          if (video.currentTime + 5 < video.duration) {
            video.currentTime += 5;
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (video.currentTime - 5 > 0) {
            video.currentTime -= 5;
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume(prev => Math.min(1, prev + 0.1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume(prev => Math.max(0, prev - 0.1));
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    video.addEventListener("error", handleError);
    video.addEventListener("loadstart", () => {
      setIsLoading(true);
      setError(null);
    });
    video.addEventListener("canplay", () => {
      setIsLoading(false);
      setError(null);
    });
    video.addEventListener("loadedmetadata", () => setDuration(video.duration));
    video.addEventListener("timeupdate", () =>
      setCurrentTime(video.currentTime),
    );

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      video.removeEventListener("error", handleError);
      video.removeEventListener("loadstart", () => {});
      video.removeEventListener("canplay", () => {});
      video.removeEventListener("loadedmetadata", () => {});
      video.removeEventListener("timeupdate", () => {});
    };
  }, [mediaUrl]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      setIsPlaying(!videoRef.current.paused);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.currentTime + 10,
        duration,
      );
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        videoRef.current.currentTime - 10,
        0,
      );
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isHovered) {
        setShowControls(false);
      }
    }, 2000);
  };
  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg group"
      onMouseEnter={() => {
        setIsHovered(true);
        setShowControls(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (isPlaying) setShowControls(false);
      }}
      onMouseMove={showControlsTemporarily}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain cursor-pointer"
        src={videoPath}
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Improved Video Controls */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4">
          {/* Progress Bar */}
          <div className="relative group/progress">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 px-3 py-1.5 rounded-lg text-white text-sm opacity-0 group-hover/progress:opacity-100 transition-opacity whitespace-nowrap">
              {formatTime(currentTime)}
            </div>
            <div className="relative w-full h-1.5 bg-gray-600/40 rounded-full overflow-hidden">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            {/* Left Controls */}
            <div className="flex items-center space-x-6">
              <button
                onClick={togglePlay}
                className="text-white hover:text-blue-400 transition-colors transform hover:scale-110"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8" />
                )}
              </button>

              <div className="flex items-center space-x-4">
                <button
                  onClick={skipBackward}
                  className="text-white hover:text-blue-400 transition-colors"
                  aria-label="Rewind 10 seconds"
                >
                  <Rewind className="w-5 h-5" />
                </button>

                <button
                  onClick={skipForward}
                  className="text-white hover:text-blue-400 transition-colors"
                  aria-label="Fast forward 10 seconds"
                >
                  <FastForward className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center space-x-3 group/volume">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-blue-400 transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </button>
                <div className="relative w-0 group-hover/volume:w-24 transition-all duration-200 overflow-hidden">
                  <div className="w-24 h-1.5 bg-gray-600/40 rounded-full overflow-hidden">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.1}
                      value={volume}
                      onChange={handleVolumeChange}
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${volume * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <span className="text-white text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-blue-400 transition-colors transform hover:scale-110"
                aria-label={
                  isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                }
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-gray-300/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Enhanced Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="text-white text-center p-6 rounded-lg bg-gray-900/80">
            <p className="text-red-400 text-xl font-semibold mb-3">
              Video Error
            </p>
            <p className="text-gray-300">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
