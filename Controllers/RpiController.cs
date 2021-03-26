using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RpiController : ControllerBase
    {
        private readonly ILogger<RpiController> _logger;
        public static List<GPIO> actualGPIOStatus = new List<GPIO>();

        public RpiController(ILogger<RpiController> logger)
        {
            _logger = logger;
            
        }
      
        [HttpPost]
        public IActionResult SetGpio([FromBody]GPIO gpio)
        {
            if (gpio != null)
            {
                SetValue(actualGPIOStatus, gpio);
                _logger.LogInformation("Pin {0} is set to mode {1} and status {2}", gpio.GPIONumber, gpio.GPIOMode,gpio.GPIOStatus);
                FileManager.SaveToJson(actualGPIOStatus);
                return Ok();
            }
            return BadRequest();

        }
      
        //[HttpGet]
        //public List<GPIO> GetActualGPIO()
        //{
        //    return actualGPIOStatus;

        //}
        [HttpGet]
        public string GetActualGPIO()
        {
            return JsonConvert.SerializeObject(actualGPIOStatus, Formatting.Indented);

        }

        void SetValue(List<GPIO> gpioList, GPIO gpio)
        {
            foreach (GPIO item in gpioList)
            {
                if (item.GPIONumber == gpio.GPIONumber)
                {
                    item.GPIOMode = gpio.GPIOMode.ToLower();
                    item.GPIOStatus = gpio.GPIOStatus;
                }
            }
             
        }

    }
}
