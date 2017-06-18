using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Ex3_website.Models.Entities
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Email { get; set; }

        [Range(0, int.MaxValue)]
        public int GamesWon { get; set; }

        [Range(0, int.MaxValue)]
        public int GamesLost { get; set; }
    }
}