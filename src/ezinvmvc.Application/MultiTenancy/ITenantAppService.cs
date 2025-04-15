using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.MultiTenancy.Dto;

namespace ezinvmvc.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

