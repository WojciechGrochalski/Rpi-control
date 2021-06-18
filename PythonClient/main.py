import sys
import WebSocketServer as ws
import WebSocketClient

import asyncio
from sys import argv

url = "ws://localhost:5001/ws/wojtek"
localurl = "ws://localhost:8085"
url2 = "wss://dockerinz.azurewebsites.net/ws"

mode = sys.argv[1]

if mode == "Server":
    print("Server Up")
    ws.run()
if mode == "Client":
    client = WebSocketClient.WebSocket(localurl)
    loop = asyncio.get_event_loop()
    connection = loop.run_until_complete(client.connect())
    tasks = [
        asyncio.ensure_future(client.receiveMessage(connection))
    ]
    loop.run_until_complete(asyncio.wait(tasks))



 #asyncio.ensure_future(client.heartbeat(connection)),
