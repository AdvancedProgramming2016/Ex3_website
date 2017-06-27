using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Ex3_website.Controllers.Parsers;
using Ex3_website.Models;
using MazeLib;
using Newtonsoft.Json.Linq;
using SearchAlgorithmsLib;

namespace Ex3_Website.Controllers
{
    public class SinglePlayerController : ApiController
    {
        /// <summary>
        /// Reference to the single player model.
        /// </summary>
        private static SinglePlayerModel model = new SinglePlayerModel();

        /// <summary>
        /// Generates a maze.
        /// </summary>
        /// <param name="mazeName">Maze name.</param>
        /// <param name="rows">Rows.</param>
        /// <param name="columns">Columns.</param>
        /// <returns>Json.</returns>
        [HttpGet]
        public JObject GenerateMaze(string mazeName, string rows,
            string columns)
        {
            Maze maze = model.GenerateMaze(mazeName, int.Parse(rows),
                int.Parse(columns));

            if (maze == null)
            {
                return null;
            }

            //Parse maze to json.
            JObject jsonMaze = ToJsonParser.ToJson(maze);

            return jsonMaze;
        }

        /// <summary>
        /// Solves a maze.
        /// </summary>
        /// <param name="mazeName">Maze name.</param>
        /// <param name="algorithmType">Algorithm type.</param>
        /// <returns>json.</returns>
        [HttpGet]
        public JObject SolveMaze(string mazeName, string algorithmType)
        {
            //Solves the maze.
            Solution<Position> solution =
                model.SolveMaze(mazeName, int.Parse(algorithmType));

            if (solution == null)
            {
                return null;
            }

            //Parse solution to json.
            JObject jsonSolution = ToJsonParser.ToJson(solution, mazeName);

            return jsonSolution;
        }
    }
}