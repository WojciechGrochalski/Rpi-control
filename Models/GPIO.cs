using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Models
{
    public class GPIO
    {
        public int GPIONumber { get; set; }
        public string GPIOMode { get; set; }
        public int GPIOStatus { get; set; }

        public GPIO(GPIO gpio)
        {
            GPIONumber = gpio.GPIONumber;
            GPIOMode = gpio.GPIOMode;
            if (gpio.GPIOStatus > 0)
            {
                GPIOStatus = 1;
            }
            if (gpio.GPIOStatus == 0)
            {
                GPIOStatus = 0;
            }


        }
        public GPIO()
        {

        }
    }
}
