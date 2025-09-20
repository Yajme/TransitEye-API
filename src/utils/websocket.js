import { WebSocketServer } from "ws";
const wss = new WebSocketServer({
    noServer: true,
    path : "/socket/client"
});




// --- WebSocket Handling ---
wss.on("connection", (ws) => {
  console.log("[WebSocket] New WebSocket client connected");

  ws.on("message", (msg) => {
    console.log("[WebSocket] Message from client:", msg.toString());
  });

  ws.on("close", () => {
    console.log("[WebSocket] Client disconnected");
  });
});




export default wss;
