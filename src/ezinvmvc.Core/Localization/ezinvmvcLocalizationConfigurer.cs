using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace ezinvmvc.Localization
{
    public static class ezinvmvcLocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Sources.Add(
                new DictionaryBasedLocalizationSource(ezinvmvcConsts.LocalizationSourceName,
                    new XmlEmbeddedFileLocalizationDictionaryProvider(
                        typeof(ezinvmvcLocalizationConfigurer).GetAssembly(),
                        "ezinvmvc.Localization.SourceFiles"
                    )
                )
            );
        }
    }
}
