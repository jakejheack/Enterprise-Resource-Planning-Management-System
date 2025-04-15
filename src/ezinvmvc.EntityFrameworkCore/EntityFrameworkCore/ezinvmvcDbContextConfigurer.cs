using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace ezinvmvc.EntityFrameworkCore
{
    public static class ezinvmvcDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<ezinvmvcDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString); //Sql Server
            //builder.UseNpgsql(connectionString); // PostgreSql
            //builder.UseMySql(connectionString); // MySql
        }

        public static void Configure(DbContextOptionsBuilder<ezinvmvcDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection); //Sql Server
            //builder.UseNpgsql(connection); // PostgreSql
            //builder.UseMySql(connection); // MySql
        }
    }
}
