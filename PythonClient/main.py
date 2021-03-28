import asyncio
import WebSocket


url = "ws://localhost:5001/ws/wojtek"

url2 = "wss://dockerinz.azurewebsites.net/ws"

client = WebSocket.WebSocket(url)
loop = asyncio.get_event_loop()
# Start connection and get client connection protocol
connection = loop.run_until_complete(client.connect())
# Start listener and heartbeat
tasks = [
    asyncio.ensure_future(client.heartbeat(connection)),
    asyncio.ensure_future(client.receiveMessage(connection)),
]

loop.run_until_complete(asyncio.wait(tasks))


