using Microsoft.EntityFrameworkCore;
using Server.DBModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.DataBase
{
    public class DbRpi : DbContext
    {
        public DbRpi(DbContextOptions<DbRpi> options) : base(options)
        {

        }

        public DbSet<User> User { get; set; }
        public DbSet<GPIO> Gpio { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
    }
}
