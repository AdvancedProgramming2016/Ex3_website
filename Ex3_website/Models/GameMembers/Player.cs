using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MazeLib;

namespace Ex3_website.Models.GameMembers
{
    /// <summary>
    /// Game player.
    /// </summary>
    public class Player
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="connectionId">Connection id.</param>
        /// <param name="gameName">Game name.</param>
        /// <param name="playerPosition">Player position.</param>
        public Player(string connectionId, string gameName, Position playerPosition)
        {
            this.ConnectionId = connectionId;
            this.GameName = gameName;
            this.PlayerPosition = playerPosition;
        }

        /// <summary>
        /// Connection id property.
        /// </summary>
        public string ConnectionId { get; set; }

        /// <summary>
        /// Game name property.
        /// </summary>
        public string GameName { get; set; }

        /// <summary>
        /// Player position property.
        /// </summary>
        public Position PlayerPosition { get; set; }
    }
}