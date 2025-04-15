using System.Threading.Tasks;
using ezinvmvc.Configuration.Dto;

namespace ezinvmvc.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
