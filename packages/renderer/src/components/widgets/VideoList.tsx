import { useState } from "react";
import { VideoFile } from "/@/types/VideoFile";
import { Clock, Film, Folder, Info, Play } from "lucide-react";

const VideoList = ({
  videos,
  onVideoSelect,
  selectedVideo,
}: {
  videos: VideoFile[];
  onVideoSelect: (video: VideoFile) => void;
  selectedVideo: VideoFile | null;
}) => {
  const [selectedVideoInfo, setSelectedVideoInfo] = useState<VideoFile | null>(
    null,
  );
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Video Library</h2>
      <div className="space-y-3">
        {videos.map(video => (
          <div
            key={video.path}
            className={`group relative flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              selectedVideo?.path === video.path
                ? "bg-blue-50"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="w-24 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-grow min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {video.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {video.duration || "Unknown duration"}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setSelectedVideoInfo(video);
                  setIsInfoDialogOpen(true);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <Info className="w-4 h-4" />
              </button>
              <button
                onClick={() => onVideoSelect(video)}
                className="p-2 text-blue-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
              >
                <Play className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedVideoInfo && (
        <VideoInfoDialog
          video={selectedVideoInfo}
          isOpen={isInfoDialogOpen}
          onClose={() => setIsInfoDialogOpen(false)}
        />
      )}
    </div>
  );
};

import { FC } from "react";
import { Modal } from "./VideoInfo";

interface VideoInfoDialogProps {
  video: VideoFile;
  isOpen: boolean;
  onClose: () => void;
}

const VideoInfoDialog: FC<VideoInfoDialogProps> = ({
  video,
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <h2 className="text-2xl font-bold mb-4">{video.name}</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="w-5 h-5" />
          <span>Duration: {video.duration || "Unknown"}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Film className="w-5 h-5" />
          <span>Size: {video.size || "Unknown"}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Folder className="w-5 h-5" />
          <span className="break-all">Path: {video.path}</span>
        </div>
      </div>
    </Modal>
  );
};

export default VideoList;
