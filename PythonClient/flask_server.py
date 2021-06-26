import asyncio
import json
import platform
from threading import Thread
import requests
from flask import Flask, jsonify, request, abort, Response
from flask_cors import CORS
from WebSocket import WebSocketRemoteClient
from WebSocket.ScriptsManager import ScriptsManager
from tools import TokenManager

url = "http://localhost:5001/ws/dc/wojtek/123"
localurl = "ws://localhost:8085"
url2 = "wss://dockerinz.azurewebsites.net/ws"
shutdown = False
jwt_token = ""


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
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:4200/*"}})
with open('AllPins.json', ) as file:
    gpios = file.read()


def change_pin(pin):
    gpio = json.loads(gpios)
    for i in range(len(gpio)):
        if gpio[i]["GPIONumber"] == pin["GPIONumber"]:
            gpio[i] = pin
    print(gpio[2])

    return json.dumps(gpio, indent=4)


@app.route('/', methods=['GET'])
def home():
    return jsonify("RpiControllApp")


@app.route('/getToken', methods=['GET'])
def getToken():
    token = TokenManager.decode_token(jwt_token)
    if token:
        return jsonify(jwt_token)
    else:
        abort(404)


@app.route('/createToken', methods=['GET'])
def createToken():
    global jwt_token
    jwt_token = TokenManager.create_token(platform.node())
    return Response(status=201)


@app.route('/gpio', methods=['GET'])
def get_gpio():
    return jsonify(WebSocketRemoteClient.get_gpio())


@app.route('/local/gpio', methods=['GET'])
def get_local_gpio():
    return jsonify(gpios)


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
    data = request.json
    mode = data["mode"]
    port = data["port"]
    print(mode)
    ScriptsManager.RestartScript(mode, port)
    response = jsonify(f"Start websocket in {mode=}")
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route('/changeGPIO', methods=['POST'])
def post():
    data = request.json
    global gpios
    gpios = change_pin(data)
    return jsonify(data)


if __name__ == '__main__':
    app.run(port=8080, threaded=True)
