//using System;
//using System.Collections;
//using System.Collections.Generic;
//using System.Linq;
//using System.Net;
//using System.Net.Http;
//using System.Web.Http;
//using Ex3_website.Controllers.Parsers;
//using Ex3_website.Models;
//using MazeLib;
//using Newtonsoft.Json;
//using Newtonsoft.Json.Linq;
//
//namespace Ex3_website.Controllers
//{
//    /// <summary>
//    /// Multiplayer game controller.
//    /// </summary>
//    public class MultiPlayerController : ApiController
//    {
//        /// <summary>
//        /// Reference to the multiplayer model.
//        /// </summary>
//        private static MultiPlayerModel model = new MultiPlayerModel();
//
//        /// <summary>
//        /// Get the games list.
//        /// </summary>
//        /// <returns>List of games.</returns>
//        public string GetGamesList()
//        {
//            IList<string> gamesList = model.GetGamesList();
//
//            //Convert the games names list to JSon array.
//            string gamesListInJsonFormat =
//                JsonConvert.SerializeObject(gamesList);
//
//            return gamesListInJsonFormat;
//        }
//
//        /// <summary>
//        /// Starts a new game.
//        /// </summary>
//        /// <param name="mazeName">Maze name.</param>
//        /// <param name="rows">Rows.</param>
//        /// <param name="columns">Columns.</param>
//        /// <param name="username">Player name.</param>
//        /// <returns>Maze in json format.</returns>
//        [HttpGet]
//        public JObject StartGame(string mazeName, string rows, string columns, string username)
//        {
//            //Start a new game.
//            Maze maze = model.StartGame(mazeName, int.Parse(rows),
//                int.Parse(columns), username);
//
//            //Check if game was created.
//            if (maze == null)
//            {
//                return null;
//            }
//
//            //Parse maze to json.
//            JObject jsonMaze = ToJsonParser.ToJson(maze);
//
//            return jsonMaze;
//        }
//
//        /// <summary>
//        /// Joins an existing game.
//        /// </summary>
//        /// <param name="mazeName">Maze name.</param>
//        /// <param name="username">Player name.</param>
//        /// <returns>>Maze in json format.</returns>
//        [HttpGet]
//        public JObject JoinGame(string mazeName, string username)
//        {
//            Maze maze = model.JoinGame(mazeName, username);
//
//            //Parse maze to json.
//            JObject jsonMaze = ToJsonParser.ToJson(maze);
//
//            return jsonMaze;
//
//        }
//
//    }
//}
