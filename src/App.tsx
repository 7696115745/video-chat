import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { useEffect, useState } from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import { Camera, CameraOff, Mic, MicOff, PhoneOff, Volume2 } from "lucide-react";

export const App = () => {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  return (
    <AgoraRTCProvider client={client}>
      <VideoCall />
    </AgoraRTCProvider>
  );
};

const VideoCall = () => {
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();
  const [appId, setAppId] = useState("");
  const [channel, setChannel] = useState("");
  const [token, setToken] = useState("");

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  const remoteUsers = useRemoteUsers();

  const [callTime, setCallTime] = useState("00:00");

  useJoin({ appid: appId, channel: channel, token: token || null }, calling);
  usePublish([localMicrophoneTrack, localCameraTrack]);

  useEffect(() => {
    let interval: any;
    if (isConnected) {
      let seconds = 0;
      interval = setInterval(() => {
        seconds++;
        const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");
        setCallTime(`${mins}:${secs}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-center text-gray-700">Join Video Call</h2>
          <input
            onChange={(e) => setAppId(e.target.value)}
            placeholder="App ID"
            value={appId}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            onChange={(e) => setChannel(e.target.value)}
            placeholder="Channel Name"
            value={channel}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            onChange={(e) => setToken(e.target.value)}
            placeholder="Token (optional)"
            value={token}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={() => setCalling(true)}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Join Call
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-[360px] mx-auto bg-black rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
      {/* Local Video (Main View) */}
      <div className="absolute inset-0 bg-black">
        <LocalUser
          audioTrack={localMicrophoneTrack}
          videoTrack={localCameraTrack}
          cameraOn={cameraOn}
          micOn={micOn}
          playAudio={false}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Remote User (Top Right Mini View) */}
      {remoteUsers[0] && (
        <div className="absolute top-4 right-4 w-24 h-32 rounded-xl overflow-hidden shadow-lg border-2 border-white z-20 bg-black">
          <RemoteUser
            user={remoteUsers[0]}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Username and Call Duration */}
      <div className="absolute bottom-24 w-full text-center text-white z-10">
        <h2 className="text-lg font-semibold">Jack Adams</h2>
        <p className="text-sm tracking-wide">{callTime}</p>
      </div>

      {/* Call Control Buttons */}
      <div className="absolute bottom-6 w-full flex justify-center gap-6 z-10">
        <button
          onClick={() => setMicOn((prev) => !prev)}
          className="bg-white p-3 rounded-full shadow-lg"
        >
          {micOn ? <Mic className="text-black" /> : <MicOff className="text-black" />}
        </button>
        <button
          onClick={() => setCalling(false)}
          className="bg-red-600 p-4 rounded-full shadow-xl"
        >
          <PhoneOff className="text-white" />
        </button>
        <button
          className="bg-white p-3 rounded-full shadow-lg"
          onClick={()=>setCameraOn(false)}
        >{cameraOn?
          <Camera className="text-black" />:<CameraOff/>}
        </button>
      </div>
    </div>
  );
};

export default App;
