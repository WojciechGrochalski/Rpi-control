import json
import os
from sys import platform


def get_number(value) -> int:
    newvalue = ''
    for c in value:
        if c.isdigit():
            newvalue += c
    return int(newvalue)


def get_mode(value) -> str:
    newvalue = value.split('=')
    return newvalue[1]


class GpioControl:

    @staticmethod
    def get_diffrent_pins(remotegpio, localgpio):
        diffrent_pins = [pin for pin in remotegpio if pin not in localgpio]
        print(diffrent_pins)
        return diffrent_pins

    @staticmethod
    def change_pin(pins):
        if platform.machine() == "armv7l":
            for pin in pins:
                os.system(f"gpio -g mode {pin.GPIONumber} {pin.GPIOMode}")
                os.system(f"gpio -g write {pin.GPIONumber} {pin.GPIOStatus}")
                result = os.popen(f"raspi-gpio get | grep '{pin.GPIONumber}'").read()
                print(f'{result=}')

    @staticmethod
    def get_local_status(gpiolist):
        for item in gpiolist:
            result = os.popen(f"raspi-gpio get | grep 'GPIO {item['GPIONumber']}:'").read()
            result = result.split()
            status = get_number(result[2])
            item['GPIOStatus'] = status
            item['GPIOMode'] = get_mode(result[4])
        return gpiolist



