import sys

from WebSocket import WebSocketServer as ws, WebSocketClient
import asyncio

url = "ws://localhost:5001/ws/wojtek"
localurl = "ws://localhost:"
url2 = "wss://dockerinz.azurewebsites.net/ws"

mode = sys.argv[1]
port = sys.argv[2]
# if sys.argv[2:]:
#     auth = sys.argv[2]
#     url += "/" + auth
# else:
#     url = localurl

if mode == "Server":
    print("Server Up")
    ws.run(port)
if mode == "Client":
    print("Connecting to  server...")
    url = localurl + port
    print(url)
    client = WebSocketClient.WebSocket(url)
    loop = asyncio.get_event_loop()
    connection = loop.run_until_complete(client.connect())
    tasks = [
        asyncio.ensure_future(client.receiveMessage(connection)),
        asyncio.ensure_future(client.heartbeat(connection))

    ]
    loop.run_until_complete(asyncio.wait(tasks))
