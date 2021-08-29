import os
import sys
from WebSocketScripts import WebSocketServer as ws, WebSocketClient
import asyncio

localurl = "ws://localhost:"

mode = sys.argv[1]
ip = sys.argv[2]
port = sys.argv[3]
token = sys.argv[4]

if mode == "Server":
    print("Server Up")
    ws.run(port, token)
if mode == "Client":
    print("Connecting to  server...")
    try:
        hostname = str(os.environ['hostname'])
    except:
        hostname = ''
    hostname = "Client-Test2"
    client = WebSocketClient.WebSocket(ip, port, token, hostname)
    loop = asyncio.get_event_loop()
    connection = loop.run_until_complete(client.connect())
    tasks = [
        asyncio.ensure_future(client.receiveMessage(connection)),
        asyncio.ensure_future(client.heartbeat(connection))

    ]
    loop.run_until_complete(asyncio.wait(tasks))
