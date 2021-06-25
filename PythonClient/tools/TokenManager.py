import json

import jwt


def create_token(rpi_id, secret="super_secret"):
    encoded_jwt = jwt.encode({"rpi_id": rpi_id}, secret, algorithm="HS256")
    print(encoded_jwt)
    return encoded_jwt


def check_token(token) -> bool:
    try:
        jwt.decode(token, "super_secret", algorithms=["HS256"])
        return True
    except Exception as e:
        print(str(e))
        return False


def decode_token(token):
    if check_token(token):
        return jwt.decode(token, "super_secret", algorithms=["HS256"])["rpi_id"]
    else:
        return None
