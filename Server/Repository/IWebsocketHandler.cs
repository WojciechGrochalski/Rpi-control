using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace Server.Repository
{
    public interface IWebsocketHandler
    {
        Task Handle(string name, WebSocket websocket);

         Task SendToUserNewPinTable(string userID, string message);
    }
}
