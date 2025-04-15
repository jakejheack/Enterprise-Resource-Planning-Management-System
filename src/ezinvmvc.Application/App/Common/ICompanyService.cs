using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Common.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace ezinvmvc.App.Common
{
    public interface ICompanyService : IApplicationService
    {
        Task<PagedResultDto<GetCompanyOutput>> GetCompanies();
        Task CreateCompany(CreateCompanyInput input);
        Task UpdateCompany(UpdateCompanyInput input);
        Task DeleteCompany(DeleteCompanyInput input);
        Task<GetCompanyOutput> GetCompany(GetCompanyInput input);
    }
}
