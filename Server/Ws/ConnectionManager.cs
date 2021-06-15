using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Server.Controllers;
using Server.Models;
using Server.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Server.Ws
{
    public class ConnectionManager : IWebsocketHandler
    {
        private readonly ILogger<ConnectionManager> _logger;
        public List<SocketConnection> websocketConnections = new List<SocketConnection>();
       public bool newGpio;

        public ConnectionManager(ILogger<ConnectionManager> logger)
        {
            _logger = logger;
        }
        public WebSocket GetSocketById(string id)
        {
            return websocketConnections.FirstOrDefault(p => p.Name == id).WebSocket;
        }

        public async Task Handle(string name, WebSocket webSocket)
        {
            lock (websocketConnections)
            {
                websocketConnections.Add(new SocketConnection(name, webSocket));
            }
            await SendMessageToSockets($"User with id {name} conneted");

            while (webSocket.State == WebSocketState.Open)
            {
                string messageSocket = await ReceiveMessage(name, webSocket);
                if (newGpio)
                {
                    string message = JsonConvert.SerializeObject(RpiController.actualGPIOStatus, Formatting.Indented);
                    await SendToUserNewPinTable("wojtek", message);
                    newGpio = false;
                }
                Thread.Sleep(TimeSpan.FromSeconds(3));
            }
        }

        private async Task SendMessageToSockets(string message)
        {
            IEnumerable<SocketConnection> toSentTo;

            lock (websocketConnections)
            {
                toSentTo = websocketConnections.ToList();
            }

            var tasks = toSentTo.Select(async websocketConnection =>
            {
                var bytes = Encoding.Default.GetBytes(message);
                var arraySegment = new ArraySegment<byte>(bytes);
                await websocketConnection.WebSocket.SendAsync(arraySegment, WebSocketMessageType.Text, true, CancellationToken.None);
            });
            await Task.WhenAll(tasks);
        }

        private async Task<string> ReceiveMessage(string id, WebSocket webSocket)
        {
            var arraySegment = new ArraySegment<byte>(new byte[4096]);
            var receivedMessage = await webSocket.ReceiveAsync(arraySegment, CancellationToken.None);
            if (receivedMessage.MessageType == WebSocketMessageType.Text)
            {
                var message = Encoding.Default.GetString(arraySegment).TrimEnd('\0');
                if (!string.IsNullOrWhiteSpace(message))
                {
                    _logger.LogInformation($"{id}: {message}");
                    return $"{id}: {message}";
                }
            }
            return null;
        }

        public List<SocketConnection> GetAll()
        {
            return websocketConnections;
        }

        public string GetId(WebSocket socket)
        {
            return websocketConnections.FirstOrDefault(p => p.WebSocket == socket).Name;
        }
        public void AddSocket(string user,WebSocket socket)
        {
            websocketConnections.Add(new SocketConnection(user,socket));
        }

        public async Task RemoveSocket(string id)
        {
            var socket = websocketConnections.FirstOrDefault(item => item.Name == id);
            websocketConnections.Remove(socket);

            await socket.WebSocket.CloseAsync(closeStatus: WebSocketCloseStatus.NormalClosure,
                                    statusDescription: "Closed by the ConnectionManager",
                                    cancellationToken: CancellationToken.None);
        }
        public async Task SendToUserNewPinTable(string userID,string message)
        {
            IEnumerable<SocketConnection> toSentTo;

            lock (websocketConnections)
            {
                toSentTo = websocketConnections.Where(item=>item.Name==userID).ToList();
            }
           
            var tasks = toSentTo.Select(async websocketConnection =>
            {
                foreach (var item in toSentTo)
                {
                    var bytes = Encoding.Default.GetBytes(message);
                    var arraySegment = new ArraySegment<byte>(bytes);
                    await item.WebSocket.SendAsync(arraySegment, WebSocketMessageType.Text, true, CancellationToken.None);
                }
               
            });
            await Task.WhenAll(tasks);

          

        }
      
        private string CreateConnectionId()
        {
            return "w";
        }

    }
    public class SocketConnection
    {
        public string Name { get; set; }
        public WebSocket WebSocket { get; set; }
        public SocketConnection(string name, WebSocket socket)
        {
            Name = name;
            WebSocket = socket;
        }
    }
}

