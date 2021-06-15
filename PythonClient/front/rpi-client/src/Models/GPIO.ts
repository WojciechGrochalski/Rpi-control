export class GPIO{
  GPIONumber: number;
  GPIOName: string;
  GPIOMode: string;
  GPIOStatus: number;
  color: string;

  constructor(gpionumber: number, gpioname: string, mode: string, status: number) {
    this.GPIONumber = gpionumber;
    this.GPIOName = gpioname;
    this.GPIOMode = mode;
    this.GPIOStatus = status;
  }
}
