export class GPIO{
  GPIONumber: number;
  GPIOName: string;
  GPIOMode: string;
  GPIOStatus: number;
  GPIOPin: number;
  color: string;

  constructor( unit: number, name: string, mode: string, status: number, pin: number) {
    this.GPIONumber = unit;
    this.GPIOName = name;
    this.GPIOMode = mode;
    this.GPIOStatus = status;
    this.GPIOPin = pin;
  }
}
