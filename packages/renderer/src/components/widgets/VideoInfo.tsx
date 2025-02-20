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
  Info,
  X,
  Clock,
  Film,
  Folder,
} from "lucide-react";

// Types
interface VideoFile {
  name: string;
  path: string;
  duration?: number;
  size?: string;
  thumbnail?: string;
}

interface VideoPlayerProps {
  videoPath: string;
  onError: (error: string) => void;
}

// Custom Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

// Video Info Dialog Component
interface VideoInfoDialogProps {
  video: VideoFile;
  isOpen: boolean;
  onClose: () => void;
}

const VideoInfoDialog: React.FC<VideoInfoDialogProps> = ({
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

export { VideoInfoDialog, Modal };
