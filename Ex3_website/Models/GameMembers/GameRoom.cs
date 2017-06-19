using MazeLib;

namespace Ex3_website.Models.GameMembers
{
    public class GameRoom
    {
        public GameRoom(Maze maze)
        {
            RoomMaze = maze;
            IsGameAvailable = true;
            PlayerOne = null;
            PlayerTwo = null;
        }

        public Maze RoomMaze { get; set; }

        public bool IsGameAvailable { get; set; }

        public Player PlayerOne { get; set; }

        public Player PlayerTwo { get; set; }

        public void AddPlayer(string username)
        {
            Player player = new Player(username, RoomMaze.Name,
                RoomMaze.InitialPos);

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