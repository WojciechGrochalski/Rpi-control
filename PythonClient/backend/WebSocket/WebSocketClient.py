import platform

import websockets
import asyncio


class WebSocket:

    def __init__(self, ip, port, token):
        self.ip = f"ws://{ip}:{port}"
        self.token = token
        pass

    async def connect(self):

        self.connection = await websockets.connect(self.ip)
        if self.connection.open:
            print('Connection stablished. Client correcly connected')
            # Send greeting
            client = platform.node()
            await self.sendMessage(str(self.token))
            await self.sendMessage(client)
            return self.connection

    async def sendMessage(self, message):

        await self.connection.send(message)

    async def receiveMessage(self, connection):
        while True:
            try:
                message = await connection.recv()
                print('Received message from server: ' + str(message))
            except websockets.exceptions.ConnectionClosed:
                print('Connection with server closed')
                break
            await asyncio.sleep(2)

    async def heartbeat(self, connection):
        device = platform.node()
        while True:
            try:
                await connection.send(device)
            except websockets.exceptions.ConnectionClosed:
                print('Connection with server closed')
                break
            await asyncio.sleep(5)
