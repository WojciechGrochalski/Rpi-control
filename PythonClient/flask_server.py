import json
import os
import pickle
from flask import jsonify, request
import flask
import Gpio

import WebSocketClient

app = flask.Flask(__name__)
app.config["DEBUG"] = True

with open('AllPins.json', ) as file:
    gpios = file.read()
jsonstring = json.dumps(gpios)
# print(json.dumps(gpios, indent = 4))
with open("gpio.pkl", "wb") as fp:
    pickle.dump(jsonstring, fp)


def change_pin(newpin):
    for pin in gpios:
        if (pin == newpin):
            pin = newpin
            break
    with open("gpio.pkl", "wb") as fp:
        pickle.dump(gpios, fp)


@app.route('/', methods=['GET'])
def home():
    return jsonify("RpiControllApp")


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
