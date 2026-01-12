import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { AccessToken } from "livekit-server-sdk";
import fs from "fs";

dotenv.config();

// Log to verify env variables are loaded
console.log("Environment check:");
console.log("LIVEKIT_API_KEY:", process.env.LIVEKIT_API_KEY ? "✓ Loaded" : "✗ Missing");
console.log("LIVEKIT_API_SECRET:", process.env.LIVEKIT_API_SECRET ? "✓ Loaded" : "✗ Missing");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Firebase Admin (service account)
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🔐 Auth middleware
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized");
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
}

// 🎥 LiveKit token endpoint (UPDATED)
app.post("/livekit-token", authenticate, async (req, res) => {
  try {
    const { roomName, userName } = req.body;

    if (!roomName || !userName) {
      return res.status(400).json({ error: "Missing roomName or userName" });
    }

    console.log("Generating token for:", { roomName, userName });
    console.log("Using API Key:", process.env.LIVEKIT_API_KEY);

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: userName,
      }
    );

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();
    
    console.log("Token generated successfully");
    
    return res.json({ token });
  } catch (error) {
    console.error("Error generating LiveKit token:", error);
    return res.status(500).json({ error: "Failed to generate token", details: error.message });
  }
});

// THIS STAYS AT THE END - NO CHANGES
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Pluc backend running on http://localhost:${PORT}`);
});