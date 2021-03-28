using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Server.Models;
using Server.Repository;
using Server.Ws;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RpiController : ControllerBase
    {
        private readonly ILogger<RpiController> _logger;
        public IWebsocketHandler WebsocketHandler { get; }
        


        public static List<GPIO> actualGPIOStatus = new List<GPIO>();
       // ConnectionManager connection = new ConnectionManager();
        public RpiController(ILogger<RpiController> logger,
                    IWebsocketHandler websocketHandler)       
        {
            _logger = logger;
            WebsocketHandler = websocketHandler;


        }
      
        [HttpPost]
        public async Task<IActionResult> SetGpio([FromBody]GPIO gpio)
        {
            if (gpio != null)
            {
                SetValue(actualGPIOStatus, gpio);
                _logger.LogInformation("Pin {0} is set to mode {1} and status {2}", gpio.GPIONumber, gpio.GPIOMode,gpio.GPIOStatus);
                FileManager.SaveToJson(actualGPIOStatus);
                await WebsocketHandler.SendToUserNewPinTable("wojtek", JsonConvert.SerializeObject(actualGPIOStatus, Formatting.Indented));
                //Task.Factory.StartNew(() => connection.SendToUserNewPinTable("wojtek", actualGPIOStatus));
                //await connection.SendToUserNewPinTable("wojtek", actualGPIOStatus,connection.websocketConnections);
                return Ok();
                
            }
            return BadRequest();

        }
      
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
        [HttpGet("/ws/{User}")]
        public async Task AddClient(string User)
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                WebSocket webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
               await WebsocketHandler.Handle(User, webSocket);
                _logger.Log(LogLevel.Information, $"Add WebSocket Clients: {User}");

               // Task.Factory.StartNew(() => Connections(webSocket));

            }
            else
            {
                HttpContext.Response.StatusCode = 400;
            }
        }

        //private async Task Connections( WebSocket webSocket)
        //{
        //    var buffer = new byte[1024 * 4];
        //    string msg = JsonConvert.SerializeObject(actualGPIOStatus, Formatting.Indented);
        //    WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        //    _logger.Log(LogLevel.Information, "Message received from Client");
        //    while (!result.CloseStatus.HasValue)
        //    {
        //        var serverMsg = Encoding.UTF8.GetBytes($"{msg}");
        //        await webSocket.SendAsync(new ArraySegment<byte>(serverMsg, 0, serverMsg.Length), result.MessageType, result.EndOfMessage, CancellationToken.None);
        //        _logger.Log(LogLevel.Information, "Message sent to Client");

        //        result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        //        _logger.Log(LogLevel.Information, "Message received from Client");
        //        Thread.Sleep(TimeSpan.FromSeconds(3));
        //    }
        //    await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
        //    _logger.Log(LogLevel.Information, "WebSocket connection closed");
        //}
        private async Task Receive(WebSocket socket, Action<WebSocketReceiveResult, byte[]> handleMessage)
        {
            var buffer = new byte[1024 * 4];

            while (socket.State == WebSocketState.Open)
            {
                var result = await socket.ReceiveAsync(buffer: new ArraySegment<byte>(buffer),
                                                        cancellationToken: CancellationToken.None);

                handleMessage(result, buffer);
            }
        }
            private async Task Connections(WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];
            string msg = JsonConvert.SerializeObject(actualGPIOStatus, Formatting.Indented);
            WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            _logger.Log(LogLevel.Information, "Message received from Client");
            while (!result.CloseStatus.HasValue)
            {
                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }
            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
            _logger.Log(LogLevel.Information, "WebSocket connection closed");
        }


    }
}
