using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using ezinvmvc.Configuration.Dto;

namespace ezinvmvc.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : ezinvmvcAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
