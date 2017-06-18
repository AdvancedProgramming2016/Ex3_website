using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MazeLib;

namespace Ex3_website.Models.GameMembers
{
    public class Player
    {
        public Player(string username, string gameName, Position playerPosition)
        {
            this.Username = username;
            this.GameName = gameName;
            this.PlayerPosition = playerPosition;
        }

        public string Username { get; set; }

        public string GameName { get; set; }

        public Position PlayerPosition { get; set; }
    }
}