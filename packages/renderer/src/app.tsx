import { useState } from "react";
import "./style/globals.css";
import VideoPlayer from "./components/VideoPlayer";

interface VideoFile {
  name: string;
  path: string;
}

declare global {
  interface Window {
    media: {
      selectFolder: () => Promise<string>;
      getVideos: (folderPath: string) => Promise<VideoFile[]>;
    };
  }
}

function App() {
  const [selectedFolder, setSelectedFolder] = useState("");
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoFile | null>(null);

  const handleFolderSelect = async () => {
    const folderPath = await window.media.selectFolder();
    if (folderPath) {
      setSelectedFolder(folderPath);
      const videoFiles = await window.media.getVideos(folderPath);
      setVideos(videoFiles);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleFolderSelect}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Select Folder
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {currentVideo && <VideoPlayer videoPath={currentVideo.path} />}
        </div>
        <div>
          <VideoList
            videos={videos}
            onVideoSelect={setCurrentVideo}
            selectedVideo={currentVideo}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

const VideoList = ({
  videos,
  onVideoSelect,
  selectedVideo,
}: {
  videos: Array<{ path: string; name: string }>;
  onVideoSelect: (video: { path: string; name: string }) => void;
  selectedVideo: { path: string; name: string } | null;
}) => {
  return (
    <div className="border rounded p-2">
      <h2 className="text-xl mb-2">Videos</h2>
      <div className="space-y-2">
        {videos.map(video => (
          <div
            key={video.path}
            className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
              selectedVideo?.path === video.path ? "bg-blue-100" : ""
            }`}
            onClick={() => onVideoSelect(video)}
          >
            {video.name}
          </div>
        ))}
      </div>
    </div>
  );
};
