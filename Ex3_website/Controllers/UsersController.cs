using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Ex3_website.Models;
using Ex3_website.Models.Entities;

namespace Ex3_website.Controllers
{
    /// <summary>
    /// Users controller.
    /// </summary>
    public class UsersController : ApiController
    {
        /// <summary>
        /// Game context.
        /// </summary>
        private GameContext db = new GameContext();

        // GET: api/Users
        /// <summary>
        /// Gets a collection of users.
        /// </summary>
        /// <returns>Collection.</returns>
        public IQueryable<User> GetUsers()
        {
            return db.Users.Any() ? db.Users : null;
        }

        // GET: api/Users/5
        /// <summary>
        /// Gets a user.
        /// </summary>
        /// <param name="username">Username.</param>
        /// <param name="password">Password.</param>
        /// <returns>User.</returns>
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> GetUser(string username,
            string password)
        {
            //Compute hash for password.
            string encryptedPassword = ComputeHash(password);

            var users = await db.Users
                .Where(u => u.Username == username &&
                            u.Password == encryptedPassword)
                .ToListAsync();

            //Check if user is empty.
            if (users.Count == 0)
            {
                return NotFound();
            }

            //Get the user from the list.
            User user = users.First();

            return Ok();
        }

        // PUT: api/Users/5
        /// <summary>
        /// Updates the user.
        /// </summary>
        /// <param name="username">Username.</param>
        /// <param name="isWon">Is the player won.</param>
        /// <returns>Response.</returns>
        [ResponseType(typeof(void))]
        [HttpGet]
        public async Task<IHttpActionResult> UpdateUser(string username, bool isWon)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //Get user by username.
            var users = await db.Users
                .Where(u => u.Username == username) .ToListAsync();

            //Check if list is empty.
            if (users.Count == 0)
            {
                return NotFound();
            }

            User user = users.First();

            //Check if user won or lost.
            if (isWon)
            {
                user.GamesWon = user.GamesWon + 1;
            }
            else
            {
                user.GamesLost = user.GamesLost + 1;
            }
              
            db.Entry(user).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(user.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Users
        /// <summary>
        /// Add a new user.
        /// </summary>
        /// <param name="user">User.</param>
        /// <returns>Response.</returns>
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> PostUser(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var users = await db.Users.Where(u => u.Username == user.Username)
                .ToListAsync();

            //Check if username already exists in the database.
            if (users.Count > 0)
            {
                return BadRequest();
            }

            //Encrypt user password;
            user.Password = ComputeHash(user.Password);

            db.Users.Add(user);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new {id = user.Id}, user);
        }

        /// <summary>
        /// Computes hash code.
        /// </summary>
        /// <param name="input">raw input.</param>
        /// <returns>Encrypted input.</returns>
        private string ComputeHash(string input)
        {
            SHA1 sha = SHA1.Create();
            byte[] buffer = Encoding.ASCII.GetBytes(input);
            byte[] hash = sha.ComputeHash(buffer);
            string hash64 = Convert.ToBase64String(hash);
            return hash64;
        }

        // DELETE: api/Users/5
        /// <summary>
        /// Deletes the user.
        /// </summary>
        /// <param name="id">Id.</param>
        /// <returns>Response.</returns>
        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> DeleteUser(int id)
        {
            User user = await db.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            db.Users.Remove(user);
            await db.SaveChangesAsync();

            return Ok(user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        /// <summary>
        /// Check is user exists.
        /// </summary>
        /// <param name="id">Id.</param>
        /// <returns>Bool.</returns>
        private bool UserExists(int id)
        {
            return db.Users.Count(e => e.Id == id) > 0;
        }
    }
}