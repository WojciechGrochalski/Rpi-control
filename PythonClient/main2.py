import requests as requests
from flask import jsonify, request
import flask



app = flask.Flask(__name__)

app.config["DEBUG"] = True

@app.route('/', methods=['GET'])
def home():
    return jsonify("RpiControllApp")

@app.route('/post', methods=['POST'])
def post():
    data = request.json
    print(data)
    return jsonify(data)


if __name__ == '__main__':
    app.run(port=8080, threaded=True)
