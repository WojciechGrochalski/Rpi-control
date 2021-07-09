import json
import os
from sys import platform

try:
    from RPi import GPIO as GPIO
except:
    print("You dont use RPI\n Only console available")


def get_number(value) -> int:
    newvalue = ''
    for c in value:
        if c.isdigit():
            newvalue += c
    return int(newvalue)


def get_mode(value) -> str:
    newvalue = value.split('=')
    return newvalue[1]


def get_status(status) -> int:
    if status == 0:
        return 0
    if status == 1:
        return 1
    return  0


class GpioControl:

    @staticmethod
    def get_diffrent_pins(remotegpio, localgpio):
        diffrent_pins = [pin for pin in remotegpio if pin not in localgpio]
        print(diffrent_pins)
        return diffrent_pins

    @staticmethod
    def change_pin(pins):
        if platform.machine() == "armv7l":
            GPIO.setmode(GPIO.BCM)
            for pin in pins:
                if pin.GPIONumber != 41:
                    if pin.GPIOMode.upper() == 'OUT':
                        GPIO.setup(pin['GPIONumber'], GPIO.OUT)
                        GPIO.output(pin['GPIONumber'], pin['GPIOStatus'])
                    if pin.GPIOMode.upper() == 'IN':
                        GPIO.setup(pin['GPIONumber'], GPIO.IN)
                        GPIO.output(pin['GPIONumber'], pin['GPIOStatus'])



    @staticmethod
    def get_local_status(gpiolist):
        GPIO.setmode(GPIO.BCM)
        print(type(gpiolist))
        for item in gpiolist:
            try:
                state = int(GPIO.input(item['GPIONumber']))
                item['GPIOStatus'] = get_status(state)
            except Exception as e:
                print(str(e))

        return gpiolist
