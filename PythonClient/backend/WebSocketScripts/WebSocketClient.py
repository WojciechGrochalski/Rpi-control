import json
import platform
import requests
import websockets
import asyncio

from myTools.ControlGpio import GpioControl


def check_it_not_equal(local_gpio, remote_gpio):
    if local_gpio == remote_gpio:
        print("equal")
        return False
    else:
        print("not equal")
        return True


def get_and_set_local_pins(remote_gpio):
    local_gpio = requests.get("http://localhost:5000/local/gpio/websocket").json()
    if check_it_not_equal(remote_gpio, local_gpio):
        diffrent_pins = GpioControl.get_diffrent_pins(json.loads(remote_gpio), json.loads(local_gpio))
        local_gpio = remote_gpio
        GpioControl.change_pin(diffrent_pins)
        requests.post("http://localhost:5000/changeLocalGPIO", json=json.loads(remote_gpio))


class WebSocket:

    def __init__(self, ip, port, token, hostname=''):
        self.ip = f"ws://{ip}:{port}"
        self.token = token
        self.hostname = hostname
        pass

    async def connect(self):
        self.connection = await websockets.connect(self.ip)
        if self.connection.open:
            print('Connection stablished. Client correcly connected')
            # Send greeting
            await self.sendMessage(str(self.token))
            return self.connection

    async def sendMessage(self, message):

        await self.connection.send(message)

    async def receiveMessage(self, connection):
        while True:
            try:
                remote_gpio = await connection.recv()
                print('Received message from server: ' + str(remote_gpio))
                get_and_set_local_pins(remote_gpio)
                client = platform.node()
                if self.hostname == '':
                    self.hostname = client
                await self.sendMessage(client)
            except websockets.exceptions.ConnectionClosed:
                print('Connection with server closed')
                break
            await asyncio.sleep(4)

    async def heartbeat(self, connection):
        device = platform.node()
        if self.hostname == '':
            self.hostname = device
        while True:
            try:
                await connection.send(self.hostname)
            except websockets.exceptions.ConnectionClosed:
                print('Connection with server closed')
                break
            await asyncio.sleep(5)
