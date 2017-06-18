using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ex3_website.Controllers
{
    /// <summary>
    /// A communication set between players.
    /// </summary>
    public class CommunicationSet
    {
        /// <summary>
        /// Constructor.
        /// </summary>
        public CommunicationSet()
        {
            this.PlayerOne = null;
            this.PlayerTwo = null;
        }

        /// <summary>
        /// Player one property.
        /// </summary>
        public string PlayerOne { get; set; }

        /// <summary>
        /// Player two property.
        /// </summary>
        public string PlayerTwo { get; set; }

        /// <summary>
        /// Adds a new player to the set.
        /// </summary>
        /// <param name="player">Player id.</param>
        public void AddPlayer(string player)
        {
            if (this.PlayerOne == null)
            {
                this.PlayerOne = player;
            }
            else
            {
                this.PlayerTwo = player;
            }
        }

        /// <summary>
        /// Get the player opponent.
        /// </summary>
        /// <param name="connectionId">Player id.</param>
        /// <returns>Opponent.</returns>
        public string GetOpponent(string connectionId)
        {
            if (this.PlayerOne == connectionId && this.PlayerTwo != null)
            {
                return this.PlayerTwo;
            }
            if (this.PlayerTwo == connectionId && this.PlayerOne != null)
            {
                return this.PlayerOne;
            }
            return null;
        }
    }
}