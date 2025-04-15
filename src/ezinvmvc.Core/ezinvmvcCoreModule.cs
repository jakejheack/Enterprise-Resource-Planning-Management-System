using Abp.Dapper;
using Abp.EntityFrameworkCore;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Timing;
using Abp.Zero;
using Abp.Zero.Configuration;
using ezinvmvc.Authorization.Roles;
using ezinvmvc.Authorization.Users;
using ezinvmvc.Configuration;
using ezinvmvc.Localization;
using ezinvmvc.MultiTenancy;
using ezinvmvc.Timing;
using System.Reflection;
using System.Collections.Generic;
using System;

namespace ezinvmvc
{
    [DependsOn(typeof(AbpZeroCoreModule),
              typeof(AbpEntityFrameworkCoreModule),
              typeof(AbpDapperModule))]

    public class ezinvmvcCoreModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Auditing.IsEnabledForAnonymousUsers = true;

            // Declare entity types
            Configuration.Modules.Zero().EntityTypes.Tenant = typeof(Tenant);
            Configuration.Modules.Zero().EntityTypes.Role = typeof(Role);
            Configuration.Modules.Zero().EntityTypes.User = typeof(User);

            ezinvmvcLocalizationConfigurer.Configure(Configuration.Localization);

            // Enable this line to create a multi-tenant application.
            Configuration.MultiTenancy.IsEnabled = ezinvmvcConsts.MultiTenancyEnabled;

            // Caching
            Configuration.Caching.ConfigureAll(cache =>
            {
                cache.DefaultSlidingExpireTime = TimeSpan.FromHours(1);
            });

            // Configure roles
            AppRoleConfig.Configure(Configuration.Modules.Zero().RoleManagement);

            Configuration.Settings.Providers.Add<AppSettingProvider>();

          
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(ezinvmvcCoreModule).GetAssembly());
            DapperExtensions.DapperExtensions.SetMappingAssemblies(new List<Assembly> { typeof(ezinvmvcCoreModule).GetAssembly() });
        }

        public override void PostInitialize()
        {
            IocManager.Resolve<AppTimes>().StartupTime = Clock.Now;
        }
    }
}
