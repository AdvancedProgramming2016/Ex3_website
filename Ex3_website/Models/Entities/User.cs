using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Ex3_website.Models.Entities
{
    /// <summary>
    /// User member.
    /// </summary>
    public class User
    {
        /// <summary>
        /// Id property.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Username property.
        /// </summary>
        [Required]
        public string Username { get; set; }

        /// <summary>
        /// Password property.
        /// </summary>
        [Required]
        public string Password { get; set; }

        /// <summary>
        /// Email property.
        /// </summary>
        [Required]
        public string Email { get; set; }

        /// <summary>
        /// Games won property.
        /// </summary>
        [Range(0, int.MaxValue)]
        public int GamesWon { get; set; }

        /// <summary>
        /// Games lost property.
        /// </summary>
        [Range(0, int.MaxValue)]
        public int GamesLost { get; set; }
    }
}