using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using MazeLib;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SearchAlgorithmsLib;

namespace Ex3_website.Controllers.Parsers
{
    /// <summary>
    /// Parses objects to Json.
    /// </summary>
    public static class ToJsonParser
    {
        /// <summary>
        /// Converts the maze into Json format.
        /// </summary>
        /// <param name="maze">Maze.</param>
        /// <returns>Json.</returns>
        public static JObject ToJson(Maze maze)
        {
            JObject jsonMaze = new JObject();
            JObject jsonStart = new JObject();
            JObject jsonEnd = new JObject();

            jsonMaze["Username"] = maze.Name;
            JObject mazeString = JObject.Parse(maze.ToJSON());
            jsonMaze["Maze"] = mazeString["Maze"];
            jsonMaze["Rows"] = maze.Rows;
            jsonMaze["Cols"] = maze.Cols;

            jsonStart["Row"] = maze.InitialPos.Row;
            jsonStart["Col"] = maze.InitialPos.Col;
            jsonMaze["InitialPos"] = jsonStart;

            jsonEnd["Row"] = maze.GoalPos.Row;
            jsonEnd["Col"] = maze.GoalPos.Col;
            jsonMaze["GoalPos"] = jsonEnd;

            return jsonMaze;
        }

        /// <summary>
        /// Converts the solution into Json format.
        /// </summary>
        /// <param name="sol">The solution.</param>
        /// <returns>Json of the solution.</returns>
        public static JObject ToJson(Solution<Position> sol, string mazeName)
        {
            StringBuilder directionSb = new StringBuilder();

            foreach (State<Position> currPosition in sol.nodeList)
            {
                if (currPosition.cameFrom == null)
                {
                    break;
                }
                else if (currPosition.cameFrom.state.Col ==
                         currPosition.state.Col + 1)
                {
                    directionSb.Append((int) Direction.Right);
                }
                else if (currPosition.cameFrom.state.Col ==
                         currPosition.state.Col - 1)
                {
                    directionSb.Append((int) Direction.Left);
                }
                else if (currPosition.cameFrom.state.Row ==
                         currPosition.state.Row + 1)
                {
                    directionSb.Append((int) Direction.Up);
                }
                else if (currPosition.cameFrom.state.Row ==
                         currPosition.state.Row - 1)
                {
                    directionSb.Append((int) Direction.Down);
                }
            }

            //Parse the solution to json format.
            SolutionJson sj = new SolutionJson(mazeName, directionSb.ToString(),
                sol.numOfNodesEvaluated.ToString());

            JObject jObject = new JObject();

            //Pass solution to Json object.
            jObject["Username"] = sj.name;
            jObject["Solution"] = sj.solution;
            jObject["EvalNodes"] = sj.evalNodes;

            return jObject;
        }
    }
}