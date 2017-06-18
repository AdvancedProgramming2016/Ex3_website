using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace Ex3_website.Controllers
{
    /// <summary>
    /// Game commands hub.
    /// </summary>
    public class CommandsHub : Hub
    {
        /// <summary>
        /// Holds a collection of all the active games.
        /// </summary>
        private static readonly ConcurrentDictionary<string, CommunicationSet>
            activeGames =
                new ConcurrentDictionary<string, CommunicationSet>();

        /// <summary>
        /// Adds a new connection to a game.
        /// </summary>
        /// <param name="gameName">Game name.</param>
        public void Connect(string gameName)
        {
            CommunicationSet communicationSet;

            //Check if game already exists.
            if (activeGames.ContainsKey(gameName))
            {
                communicationSet = activeGames[gameName];
                communicationSet.AddPlayer(Context.ConnectionId);
            }
            else
            {
                communicationSet = new CommunicationSet();
                communicationSet.AddPlayer(Context.ConnectionId);
                activeGames.GetOrAdd(gameName, communicationSet);
            }
        }

        /// <summary>
        /// Remove game from active games collection.
        /// </summary>
        /// <param name="gameName">Game name.</param>
        public void Disconnect(string gameName)
        {
            //Check if the game exists in the collection.
            if (!activeGames.ContainsKey(gameName))
            {
                return;
            }

            CommunicationSet communicationSet;
            activeGames.TryRemove(gameName, out communicationSet);
        }

        /// <summary>
        /// Send a command to an opponent.
        /// </summary>
        /// <param name="gameName">Game name.</param>
        /// <param name="command">Command.</param>
        public void SendCommand(string gameName, string command)
        {
            CommunicationSet communicationSet = activeGames[gameName];
            string opponentId = communicationSet.GetOpponent(Context.ConnectionId);

            //Check if opponent exists.
            if (opponentId == null)
            {
                return;
            }

            //TODO Should I also add (gameName, command), meaning what happens if the opponent plays two games, which game will receive the command?
            Clients.Client(opponentId).gotCommand(command);
        }
    }
}