using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace Ex3_website.Controllers
{
    public class CommandsHub : Hub
    {
        private static readonly ConcurrentDictionary<string, string>
            connectedUsers = new ConcurrentDictionary<string, string>();

        public void Connect(string username)
        {
            connectedUsers[username] = Context.ConnectionId;
        }

        public void SendCommand(string playerName, string opponentName,
            string command)
        {
            string opponentId = connectedUsers[opponentName];

            if (opponentId == null)
            {
                return;
            }

            Clients.Client(opponentId).gotCommand(playerName, command);
        }
    }
}