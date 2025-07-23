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
import { useState } from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";

export const App = () => {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  return (
    <AgoraRTCProvider client={client}>
      <Basics />
    </AgoraRTCProvider>
  );
};

const Basics = () => {
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();
  const [appId, setAppId] = useState("<-- Insert App ID -->");
  const [channel, setChannel] = useState("<-- Insert Channel Name -->");
  const [token, setToken] = useState("<-- Insert Token -->");
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  useJoin({ appid: appId, channel: channel, token: token ? token : null }, calling);
  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {isConnected ? (
        <div className="w-full max-w-5xl grid gap-6">
          <div className="bg-white rounded-2xl shadow-md p-4">
            <LocalUser
              audioTrack={localMicrophoneTrack}
              cameraOn={cameraOn}
              micOn={micOn}
              playAudio={false}
              videoTrack={localCameraTrack}
              style={{ width: '100%', height: 300 }}
            >
              <span className="block text-center font-semibold">You</span>
            </LocalUser>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {remoteUsers.map((user) => (
              <div key={user.uid} className="bg-white rounded-2xl shadow-md p-4">
                <RemoteUser user={user} style={{ width: '100%', height: 300 }}>
                  <span className="block text-center font-semibold">{user.uid}</span>
                </RemoteUser>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-4">
          <input
            onChange={(e) => setAppId(e.target.value)}
            placeholder="<Your app ID>"
            value={appId}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            onChange={(e) => setChannel(e.target.value)}
            placeholder="<Your channel Name>"
            value={channel}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            onChange={(e) => setToken(e.target.value)}
            placeholder="<Your token>"
            value={token}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />

          <button
            // disabled={!appId || !channel}
            onClick={() => setCalling(true)}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Join Channel
          </button>
        </div>
      )}

      {isConnected && (
        <div className="mt-6 space-x-4">
          <button
            onClick={() => setMic((a) => !a)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {micOn ? "Disable mic" : "Enable mic"}
          </button>
          <button
            onClick={() => setCamera((a) => !a)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {cameraOn ? "Disable camera" : "Enable camera"}
          </button>
          <button
            onClick={() => setCalling((a) => !a)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            {calling ? "End call" : "Start call"}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
