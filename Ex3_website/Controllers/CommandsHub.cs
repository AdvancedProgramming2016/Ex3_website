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
        /// Starts a new game.
        /// </summary>
        /// <param name="mazeName">Maze name.</param>
        /// <param name="rows">Rows.</param>
        /// <param name="columns">Columns.</param>
        public void StartGame(string mazeName, string rows, string columns)
        {
            //Start a new game.
            Maze maze = model.StartGame(mazeName, int.Parse(rows),
                int.Parse(columns), Context.ConnectionId);

            //Check if game was created.
            if (maze == null)
            {
                Clients.Client(Context.ConnectionId).gotError("Maze exists");
            }
        }

        /// <summary>
        /// Joins to an existing game.
        /// </summary>
        /// <param name="mazeName">Maze name.</param>
        public void JoinGame(string mazeName)
        {
            GameRoom room = model.JoinGame(mazeName, Context.ConnectionId);

            //Parse maze to json.
            Maze maze = room.RoomMaze;
            JObject jsonMaze = ToJsonParser.ToJson(maze);

            //Send the maze to both players.
            Clients.Client(room.PlayerOne.ConnectionId).gotMaze(jsonMaze);
            Clients.Client(room.PlayerTwo.ConnectionId).gotMaze(jsonMaze);
        }

        /// <summary>
        /// Gets the list of games.
        /// </summary>
        public void GetListOfGames()
        {
            IList<string> gamesList = model.GetGamesList();

            //Convert the games names list to JSon array.
            string gamesListInJsonFormat =
                JsonConvert.SerializeObject(gamesList);

            //Send the list to the client.
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
            //Check if game room exists.
            if (!model.GameRooms.ContainsKey(gameName))
            {
                return;
            }

            GameRoom room = model.GameRooms[gameName];

            //Get opponent.
            Player opponent = room.GetOpponent(Context.ConnectionId);

            if (opponent == null)
            {
                return;
            }

            //Send command to opponent.
            Clients.Client(opponent.ConnectionId).gotCommand(command);
        }

        /// <summary>
        /// Closes the game.
        /// </summary>
        /// <param name="mazeName"></param>
        public void Close(string mazeName)
        {
            model.Close(mazeName);
        }
    }
}