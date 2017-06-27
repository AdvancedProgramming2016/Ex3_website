using MazeLib;

namespace Ex3_website.Models.GameMembers
{
    /// <summary>
    /// Game room.
    /// </summary>
    public class GameRoom
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="maze">Maze.</param>
        public GameRoom(Maze maze)
        {
            RoomMaze = maze;
            IsGameAvailable = true;
            PlayerOne = null;
            PlayerTwo = null;
        }

        /// <summary>
        /// Maze property.
        /// </summary>
        public Maze RoomMaze { get; set; }

        /// <summary>
        /// Is game available property.
        /// </summary>
        public bool IsGameAvailable { get; set; }

        /// <summary>
        /// Player one property.
        /// </summary>
        public Player PlayerOne { get; set; }

        /// <summary>
        /// Player two property.
        /// </summary>
        public Player PlayerTwo { get; set; }

        /// <summary>
        /// Adds a player to the room.
        /// </summary>
        /// <param name="username">Username.</param>
        public void AddPlayer(string username)
        {
            Player player = new Player(username, RoomMaze.Name,
                RoomMaze.InitialPos);

            //Check if room already has a player.
            if (this.PlayerOne == null)
            {
                PlayerOne = player;
            }
            else
            {
                PlayerTwo = player;
                IsGameAvailable = false;
            }
        }

        /// <summary>
        /// Get player opponent.
        /// </summary>
        /// <param name="connectionId">Connection id.</param>
        /// <returns>Opponent.</returns>
        public Player GetOpponent(string connectionId)
        {

            Player player = null;

            if (this.PlayerOne == null || this.PlayerTwo == null)
            {
                return null;
            }

            if (this.PlayerOne.ConnectionId == connectionId)
            {
                player =  this.PlayerTwo;
            }
           else if(this.PlayerTwo.ConnectionId == connectionId)
            {
                player =  this.PlayerOne;
            }

            return player;
        }
    }
}