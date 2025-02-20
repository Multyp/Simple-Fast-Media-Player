import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";

interface VideoPlayerProps {
  videoPath: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoPath }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert the file path to a properly encoded media protocol URL
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

      console.error("Video error details:", {
        code: videoError?.code,
        message: videoError?.message,
        mediaUrl,
        networkState: video.networkState,
        readyState: video.readyState,
      });

      setError(errorMessage);
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
      console.log("Video loading started:", mediaUrl);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
      console.log("Video can play:", mediaUrl);
    };

    const checkVideoSupport = () => {
      const videoFormats = [
        'video/mp4; codecs="avc1.42E01E,mp4a.40.2"',
        "video/webm",
        "video/x-matroska",
      ];
      const supported = videoFormats.some(
        format => video.canPlayType(format) !== "",
      );
      if (!supported) {
        setError("This video format may not be supported by your browser");
      }
    };

    video.addEventListener("error", handleError);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadedmetadata", () => {
      setDuration(video.duration);
      checkVideoSupport();
    });
    video.addEventListener("timeupdate", () =>
      setCurrentTime(video.currentTime),
    );

    return () => {
      video.removeEventListener("error", handleError);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
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
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
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

  return (
    <div
      ref={containerRef}
      className="relative group w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden shadow-xl"
    >
      {error && (
        <Alert
          variant="destructive"
          className="absolute top-0 left-0 right-0 z-50"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white">Loading video...</div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full"
        src={mediaUrl}
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        aria-label="Video Player"
      >
        <source
          src={mediaUrl}
          type="video/mp4"
        />
        <source
          src={mediaUrl}
          type="video/webm"
        />
        <source
          src={mediaUrl}
          type="video/x-matroska"
        />
        Your browser does not support the video tag.
      </video>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="px-4 py-3">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer"
            aria-label="Video Progress"
          />

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-gray-200 transition-colors"
                disabled={!!error}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={skipBackward}
                className="text-white hover:text-gray-200 transition-colors"
                disabled={!!error}
                aria-label="Skip Backward"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={skipForward}
                className="text-white hover:text-gray-200 transition-colors"
                disabled={!!error}
                aria-label="Skip Forward"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-gray-200 transition-colors"
                  disabled={!!error}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer"
                  disabled={!!error}
                  aria-label="Volume Control"
                />
              </div>

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-200 transition-colors"
              disabled={!!error}
              aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize className="w-6 h-6" />
              ) : (
                <Maximize className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
