using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using ezinvmvc.Configuration;
using ezinvmvc.Web;

namespace ezinvmvc.EntityFrameworkCore
{
    /* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
    public class ezinvmvcDbContextFactory : IDesignTimeDbContextFactory<ezinvmvcDbContext>
    {
        public ezinvmvcDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<ezinvmvcDbContext>();
            var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());

            ezinvmvcDbContextConfigurer.Configure(builder, configuration.GetConnectionString(ezinvmvcConsts.ConnectionStringName));

            return new ezinvmvcDbContext(builder.Options);
        }
    }
}
