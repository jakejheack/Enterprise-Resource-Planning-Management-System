using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using ezinvmvc.Authorization;

namespace ezinvmvc
{
    [DependsOn(
        typeof(ezinvmvcCoreModule), 
        typeof(AbpAutoMapperModule))]

    public class ezinvmvcApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<ezinvmvcAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(ezinvmvcApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddProfiles(thisAssembly)
            );
        }
    }
}
