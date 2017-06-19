using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Ex3_website.Controllers.Parsers;
using Ex3_website.Models;
using Ex3_website.Models.GameMembers;
using MazeLib;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Ex3_website.Controllers
{
    /// <summary>
    /// Game commands hub.
    /// </summary>
    public class CommandsHub : Hub
    {
        /// <summary>
        /// Reference to the multiplayer model.
        /// </summary>
        private static MultiPlayerModel model = new MultiPlayerModel();

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

        public void StartGame(string mazeName, string rows, string columns)
        {
            //Start a new game.
            Maze maze = model.StartGame(mazeName, int.Parse(rows),
                int.Parse(columns), Context.ConnectionId);

            //Check if game was created.
            if (maze == null)
            {
                //TODO return null to user
            }

            //Parse maze to json.
            //JObject jsonMaze = ToJsonParser.ToJson(maze);
            }

        public void JoinGame(string mazeName)
        {
            GameRoom room = model.JoinGame(mazeName, Context.ConnectionId);

            Maze maze = room.RoomMaze;
            JObject jsonMaze = ToJsonParser.ToJson(maze);

            Clients.Client(room.PlayerOne.ConnectionId).gotMaze(jsonMaze);
            Clients.Client(room.PlayerTwo.ConnectionId).gotMaze(jsonMaze);
        }

        public void GetListOfGames()
        {
            IList<string> gamesList = model.GetGamesList();

            //Convert the games names list to JSon array.
            string gamesListInJsonFormat =
                JsonConvert.SerializeObject(gamesList);

            Clients.Client(Context.ConnectionId)
                .gotListOfGames(gamesListInJsonFormat);
        }

        /// <summary>
        /// Send a command to an opponent.
        /// </summary>
        /// <param name="gameName">Game name.</param>
        /// <param name="command">Command.</param>
        public void SendCommand(string gameName, string command)
        {
            CommunicationSet communicationSet = activeGames[gameName];
            string opponentId =
                communicationSet.GetOpponent(Context.ConnectionId);

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