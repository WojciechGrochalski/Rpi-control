using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.DBModels
{
    public class GPIO
    {
        public int ID { get; set; }
        public int GPIONumber { get; set; }
        public string GPIOMode { get; set; }
        public int GPIOStatus { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

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
