import sys

from WebSocket import WebSocketServer as ws, WebSocketClient
import asyncio

url = "ws://localhost:5001/ws/wojtek"
localurl = "ws://localhost:"
url2 = "wss://dockerinz.azurewebsites.net/ws"

mode = sys.argv[1]
ip = sys.argv[2]
port = sys.argv[3]
token = sys.argv[4]

if mode == "Server":
    print("Server Up")
    ws.run(port, token)
if mode == "Client":
    print("Connecting to  server...")
    client = WebSocketClient.WebSocket(ip, port, token)
    loop = asyncio.get_event_loop()
    connection = loop.run_until_complete(client.connect())
    tasks = [
        asyncio.ensure_future(client.receiveMessage(connection)),
        asyncio.ensure_future(client.heartbeat(connection))

    ]
    loop.run_until_complete(asyncio.wait(tasks))
