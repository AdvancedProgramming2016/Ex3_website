using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using Ex3_website.Models.GameMembers;
using MazeGeneratorLib;
using MazeLib;
using SearchAlgorithmsLib;

namespace Ex3_website.Models
{
    /// <summary>
    /// Multiplayer game model.
    /// </summary>
    public class MultiPlayerModel
    {
        /// <summary>
        /// A maze generator.
        /// </summary>
        private IMazeGenerator mazeGenerator;

        /// <summary>
        /// Constructor.
        /// </summary>
        public MultiPlayerModel()
        {
            this.StartedMazes = new Dictionary<string, Maze>();
            this.GameRooms = new Dictionary<string, GameRoom>();
            this.mazeGenerator = new DFSMazeGenerator();
            this.AlgorithmFactory = new AlgorithmFactory<Position>();
        }

        /// <summary>
        /// Algorithm factory property.
        /// </summary>
        /// <value>AlgorithmFactory.</value>
        public AlgorithmFactory<Position> AlgorithmFactory { get; }

        /// <summary>
        /// Multiplayer games property.
        /// </summary>
        public Dictionary<string, Maze> StartedMazes { get; }

        /// <summary>
        /// Game rooms property.
        /// </summary>
        public Dictionary<string, GameRoom> GameRooms { get; }

        /// <summary>
        /// Returnes the available games list.
        /// </summary>
        /// <returns>List of games.</returns>
        public IList<string> GetGamesList()
        {
            IList<string> gamesList = new List<string>();

            //Find all the available games.
            foreach (KeyValuePair<string, GameRoom> room in GameRooms)
            {
                if (room.Value.IsGameAvailable)
                {
                    gamesList.Add(room.Value.RoomMaze.Name);
                }
            }

            return gamesList;
        }

        /// <summary>
        /// Check if the game is available.
        /// </summary>
        /// <param name="mazeName">Maze name.</param>
        /// <returns>Is the game available.</returns>
        public bool IsGameAvailable(string mazeName)
        {
            return GameRooms[mazeName].IsGameAvailable;
        }

        /// <summary>
        /// Start a new game.
        /// </summary>
        /// <param name="mazeName">Maze name.</param>
        /// <param name="rows">Rows.</param>
        /// <param name="columns">Columns.</param>
        /// <param name="connectionId"></param>
        /// <returns>Maze.</returns>
        public Maze StartGame(string mazeName, int rows, int columns,
            string connectionId)
        {
            //Check if a game with the same already exists.
            if (StartedMazes.ContainsKey(mazeName))
            {
                return null;
            }

            //Generates the maze with the required properties.
            Maze maze = this.mazeGenerator.Generate(rows, columns);
            maze.Name = mazeName;
            StartedMazes.Add(maze.Name, maze);

            //Create new game room.
            GameRoom room = new GameRoom(maze);
            room.AddPlayer(connectionId);
            GameRooms.Add(maze.Name, room);

            return maze;
        }

        /// <summary>
        /// Join an existing game.
        /// </summary>
        /// <param name="mazeName">Maze name.</param>
        /// <param name="connectionId">Connection id.</param>
        /// <returns>Game room.</returns>
        public GameRoom JoinGame(string mazeName, string connectionId)
        {
            //Add player to game room.
            GameRoom room = GameRooms[mazeName];
            room.AddPlayer(connectionId);

            return room;
        }

        /// <summary>
        /// Close the game.
        /// </summary>
        /// <param name="mazeName">Maze name.</param>
        public void Close(string mazeName)
        {
            //Check if game exists.
            if (this.StartedMazes.ContainsKey(mazeName))
            {
                this.StartedMazes.Remove(mazeName);
                this.GameRooms.Remove(mazeName);
            }
        }
    }
}