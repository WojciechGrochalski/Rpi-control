import json

import requests
import websockets
import asyncio

gpio = any
def get_gpio():
    return gpio


class WebSocket:

    def __init__(self, url):
        self.url = url
        pass

    async def connect(self):

        self.connection = await websockets.connect(self.url)
        if self.connection.open:
            print('Connection stablished. Client correcly connected')
            # Send greeting
            await self.sendMessage("Hello from client")
            return self.connection

    async def sendMessage(self, message):

        await self.connection.send(message)

    async def receiveMessage(self, connection):
        while True:
            try:
                message = await connection.recv()
                print('Received message from server: ' + str(message))
                global gpio
                gpio = json.loads(message)
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
