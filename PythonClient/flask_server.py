import asyncio
import json

import os
import pickle
from threading import Thread

import requests
from flask import Flask, jsonify, abort, request

import WebSocketRemoteClient

url = "http://localhost:5001/ws/dc/wojtek/123"
localurl = "ws://localhost:8085"
url2 = "wss://dockerinz.azurewebsites.net/ws"


def connect_to_dotnetServer():
    url = "ws://localhost:5001/ws/wojtek" + "/" + "123"
    print("Connecting to dotnet server...")
    try:
        client = WebSocketRemoteClient.WebSocket(url)
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        connection = loop.run_until_complete(client.connect())
        tasks = [
            asyncio.ensure_future(client.receiveMessage(connection)),
            asyncio.ensure_future(client.heartbeat(connection))

        ]
        loop.run_until_complete(asyncio.wait(tasks))
    except Exception as e:
        print(str(e))
        print("Cannot connect to remote server")


app = Flask(__name__)
app.config["DEBUG"] = True

with open('AllPins.json', ) as file:
    gpios = file.read()
jsonstring = json.dumps(gpios)
# print(json.dumps(gpios, indent = 4))
with open("gpio.pkl", "wb") as fp:
    pickle.dump(jsonstring, fp)


# thread = Thread(target=connect_to_dotnetServer)
# thread.daemon = True


def get_gpio():
    return gpios


def change_pin(newpin):
    for pin in gpios:
        if pin == newpin:
            pin = newpin
            break
    with open("gpio.pkl", "wb") as fp:
        pickle.dump(gpios, fp)


@app.route('/', methods=['GET'])
def home():
    return jsonify("RpiControllApp")


@app.route('/gpio', methods=['GET'])
def get_gpio():
    return jsonify(WebSocketRemoteClient.get_gpio())



@app.route('/run_server', methods=['GET'])
def run_server():
    thread = Thread(target=connect_to_dotnetServer)
    thread.daemon = True
    thread.start()
    return jsonify("Server is starting up ...")


@app.route('/reload_server', methods=['GET'])
def reload_server():
    try:
        response = requests.get(url)
        if response.status_code == 200:
            thread = Thread(target=connect_to_dotnetServer)
            thread.daemon = True
            thread.start()
            return jsonify("Server is starting up ...")
        else:
            return jsonify("Socket cant be disconnected")
    except Exception as e:
        print(str(e))


@app.route('/setMode', methods=['POST'])
def set_mode():
    mode = json.dumps(request.json)
    print(mode)
    os.system("pkill -f main")
    os.system(f"python main.py {mode}")
    return jsonify("RpiControllApp")


@app.route('/changeGPIO', methods=['POST'])
def post():
    data = request.json
    print(data)
    change_pin(data)
    return jsonify(data)


if __name__ == '__main__':
    app.run(port=8080, threaded=True)
