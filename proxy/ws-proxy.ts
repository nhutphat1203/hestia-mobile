import { parse } from "url";
import WebSocket, { WebSocketServer } from "ws";

const TARGET_WS = "ws://192.168.1.9:8080/ws/v1/env"; // server thật
const PROXY_PORT = 8082;

const proxyServer = new WebSocketServer({ port: PROXY_PORT }, () => {
  console.log(`WS Proxy listening on ws://localhost:${PROXY_PORT}`);
});

proxyServer.on("connection", (clientSocket: WebSocket, req: any) => {
  if (!req.url) return;

  const { room, token } = parse(req.url, true).query;

  if (!room) {
    console.log("No room specified. Closing client connection.");
    clientSocket.close();
    return;
  }

  console.log(`Client connected for room: ${room}`);

  const headers: Record<string, string> = {};
  if (token && typeof token === "string") headers["Authorization"] = `Bearer ${token}`;

  const targetUrl = `${TARGET_WS}?room=${room}`;
  const serverSocket = new WebSocket(targetUrl, { headers });

  serverSocket.on("open", () => {
    console.log(`Connected to target server at ${targetUrl}`);
  });

  serverSocket.on("message", (msg) => {
    console.log(`[Server -> Proxy -> Client] Message: ${msg.toString()}`);
    if (clientSocket.readyState === WebSocket.OPEN) {
      clientSocket.send(msg);
    }
  });

  clientSocket.on("message", (msg) => {
    console.log(`[Client -> Proxy -> Server] Message: ${msg.toString()}`);
    if (serverSocket.readyState === WebSocket.OPEN) {
      serverSocket.send(msg);
    }
  });

  const closeSockets = (reason?: string) => {
    console.log(`Closing sockets ${reason ? "- " + reason : ""}`);
    if (clientSocket.readyState === WebSocket.OPEN) clientSocket.close();
    if (serverSocket.readyState === WebSocket.OPEN) serverSocket.close();
  };

  clientSocket.on("close", () => closeSockets("client closed"));
  clientSocket.on("error", (err) => closeSockets(`client error: ${err}`));
  serverSocket.on("close", () => closeSockets("server closed"));
  serverSocket.on("error", (err) => closeSockets(`server error: ${err}`));
});
