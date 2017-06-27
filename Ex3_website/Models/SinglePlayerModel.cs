using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Ex3_website.Models.Adapters;
using MazeLib;
using MazeGeneratorLib;
using Newtonsoft.Json.Linq;
using SearchAlgorithmsLib;

namespace Ex3_website.Models
{
    /// <summary>
    /// The single playerr game model.
    /// </summary>
    public class SinglePlayerModel
    {
        /// <summary>
        /// A maze generator.
        /// </summary>
        private IMazeGenerator mazeGenerator;

        /// <summary>
        /// Constructor.
        /// </summary>
        public SinglePlayerModel()
        {
            //Initialize members.
            this.GenerateMazes = new Dictionary<string, Maze>();
            this.SolvedMazes = new Dictionary<string, Solution<Position>>();
            this.mazeGenerator = new DFSMazeGenerator();
            this.AlgorithmFactory = new AlgorithmFactory<Position>();
        }

        /// <summary>
        /// Generated mazes property.
        /// </summary>
        public Dictionary<string, Maze> GenerateMazes { get; }

        /// <summary>
        /// Solved mazes property.
        /// </summary>
        public Dictionary<string, Solution<Position>> SolvedMazes { get; }

        /// <summary>
        /// Algorithm factory property.
        /// </summary>
        /// <value>AlgorithmFactory.</value>
        public AlgorithmFactory<Position> AlgorithmFactory { get; }

        /// <summary>
        /// Generate a maze.
        /// </summary>
        /// <param name="mazeName">Maze name.</param>
        /// <param name="rows">Rows.</param>
        /// <param name="columns">Columns.</param>
        /// <returns>Maze.</returns>
        public Maze GenerateMaze(string mazeName, int rows, int columns)
        {
            //Check if maze already exists.
            if (GenerateMazes.ContainsKey(mazeName))
            {
                return null;
            }

            //Generates the maze with the required properties.
            Maze maze = this.mazeGenerator.Generate(rows, columns);
            maze.Name = mazeName;

            //Store maze in the list.
            this.GenerateMazes.Add(maze.Name, maze);

            return maze;
        }

        /// <summary>
        /// Solves a maze.
        /// </summary>
        /// <param name="mazeName">Maze name.</param>
        /// <param name="algorithmType">Algorithm type.</param>
        /// <returns>Solution.</returns>
        public Solution<Position> SolveMaze(string mazeName, int algorithmType)
        {
            //Check is solution already exists.
            if (SolvedMazes.ContainsKey(mazeName))
            {
                return SolvedMazes[mazeName];
            }

            //Check if maze exists.
            if (!this.GenerateMazes.ContainsKey(mazeName))
            {
                return null;
            }

            Maze maze = GenerateMazes[mazeName];

            //Solve maze.
            StatePool<Position> statePool = new StatePool<Position>();
            SolutionAdapter ad = new SolutionAdapter(maze, statePool);
            ISearcher<Position> algorithm =
                this.AlgorithmFactory.CreateAlgorithm(algorithmType);

            return algorithm.Search(ad);
        }
    }
}