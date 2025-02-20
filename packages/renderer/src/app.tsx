import { useState } from "react";
import "./style/globals.css";
import VideoPlayer from "./components/widgets/VideoPlayer";
import { Folder } from "lucide-react";
import VideoList from "./components/widgets/VideoList";
import { VideoFile } from "./types/VideoFile";

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
  const [error, setError] = useState<string | null>(null);

  const handleFolderSelect = async () => {
    try {
      const folderPath = await window.media.selectFolder();
      if (folderPath) {
        setSelectedFolder(folderPath);
        const videoFiles = await window.media.getVideos(folderPath);
        setVideos(videoFiles);
        setError(null);
      }
    } catch (err) {
      setError("Failed to load folder. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Video Player</h1>
          <button
            onClick={handleFolderSelect}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Folder className="w-5 h-5" />
            <span>Select Folder</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {currentVideo ? (
              <VideoPlayer
                videoPath={currentVideo.path}
                onError={setError}
              />
            ) : (
              <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">Select a video to play</p>
              </div>
            )}
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
    </div>
  );
}

export default App;
