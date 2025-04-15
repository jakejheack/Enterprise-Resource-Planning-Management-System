using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Common.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public interface ITaxTypeServices : IApplicationService
    {
        Task<PagedResultDto<GetTaxTypeOutput>> GetTaxtTypelist();
        Task<IEnumerable<GetTaxTypeOutput>> GetTaxtTypes();
        Task CreateTaxtType(CreateTaxTypeInput input);
        Task UpdateTaxtType(UpdateTaxTypeInput input);
        Task DeleteTaxtType(DeleteTaxTypeInput input);
        Task<GetTaxTypeOutput> GetTaxtType(GetTaxTypeInput input);
    }
}
