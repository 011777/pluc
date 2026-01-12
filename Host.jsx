import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { getAuth } from "firebase/auth";
import { LIVEKIT_URL } from "../config/livekit";

export default function Host({ onLeave }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.error("No authenticated user");
          setLoading(false);
          return;
        }

        // 🔐 Firebase ID token
        const idToken = await user.getIdToken();

        const response = await fetch("http://localhost:3001/livekit-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            roomName: "pluc-room",
            userName: user.uid,
          }),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text);
        }

        const data = await response.json();

console.log("TOKEN VALUE:", data.token);
console.log("TOKEN TYPE:", typeof data.token);

setToken(data.token);

      } catch (err) {
        console.error("Error fetching LiveKit token:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  if (loading) {
    return <p style={{ color: "white", textAlign: "center" }}>Starting stream…</p>;
  }

  if (!token) {
    return <p style={{ color: "red", textAlign: "center" }}>Failed to start live stream</p>;
  }

  return (
    <div style={{ height: "100vh" }}>
      <LiveKitRoom
        token={token}
        serverUrl={LIVEKIT_URL}
        connect={true}
        video={true}
        audio={true}
        onDisconnected={onLeave}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}
