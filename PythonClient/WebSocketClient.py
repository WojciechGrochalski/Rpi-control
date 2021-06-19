import requests
import websockets
import asyncio


class WebSocket:

    def __init__(self, url):
        self.url = url
        pass

    async def connect(self):

        self.connection = await websockets.connect(self.url)
        if self.connection.open:
            print('Connection stablished. Client correcly connected')
            # Send greeting
            await self.sendMessage('Hello')
            return self.connection

    async def sendMessage(self, message):

        await self.connection.send(message)

    async def receiveMessage(self, connection):
        while True:
            try:
                message = await connection.recv()
                print('Received message from server: ' + str(message))
               # requests.post("http://localhost:8080/post", json={"msg": message})
            except websockets.exceptions.ConnectionClosed:
                print('Connection with server closed')
                break
            await asyncio.sleep(1)

    async def heartbeat(self, connection):
        while True:
            try:
                await connection.send('ping')

            except websockets.exceptions.ConnectionClosed:
                print('Connection with server closed')
                break
            await asyncio.sleep(5)
