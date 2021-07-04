

class GpioControl:

    @staticmethod
    def get_diffrent_pins(remotegpio, localgpio):
        diffrent_pins = [pin for pin in remotegpio if pin not in localgpio]
        print(diffrent_pins)
        return diffrent_pins
