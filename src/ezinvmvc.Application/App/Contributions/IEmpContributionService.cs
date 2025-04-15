using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Contributions.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Contributions
{
    public interface IEmpContributionService : IApplicationService
    {
        Task CreateEmpContributionAsync(CreateEmpContributionInput input);

        Task UpdateEmpContributionAsync(UpdateEmpContributionInput input);

        Task DeleteEmpContributionAsync(DeleteEmpContributionInput input);

        Task <GetEmpContributionOutput> GetEmpContributionByIdAsync(GetEmpContributionInput input);

        Task<PagedResultDto<GetEmpContributionOutput>> GetAllEmpContributionAsync(GetEmpContributionListInput input);

        Task<GetEmpContributionOutput> GetDetailEmpContributionsAsync(GetEmpContributionInput input);

        Task<PagedResultDto<GetEmpContributionOutput>> GetEmpContributionAsync(GetEmpContributionListInput input);

        Task<PagedResultDto<GetEmpContributionOutput>> GetPremiumDeductionAsync(GetEmpContributionListInput input);

    }
}
