export class GPIO{
  GPIONumber: number;
  GPIOMode: string;
  GPIOStatus: number;

  constructor(gpionumber: number, mode: string, status: number) {
    this.GPIONumber = gpionumber;
    this.GPIOMode = mode;
    this.GPIOStatus = status;
  }
}
