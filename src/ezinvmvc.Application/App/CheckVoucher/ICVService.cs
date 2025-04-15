using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.CheckVoucher.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.CheckVoucher
{
    public interface ICVService : IApplicationService
    {
        Task<GetCVOutput> GetCV(GetCVInput input);
        Task<PagedResultDto<CVOutput>> GetAllCV(GetCVListInput input);
        Task<int> CreateCV(CreateCVInput input);
        Task<int> UpdateCV(CreateCVInput input);

        
        Task<PagedResultDto<APOutput>> GetAPs(GetAPListInput input);
        Task<PagedResultDto<CVDOutput>> GetCVItemByParentId(GetCVInput input);
        Task<PagedResultDto<CVOutput>> GetCVByParentId(GetCVInput input);
        //Task<PagedResultDto<CVOutput>> GetAllbyDetails(GetCVListInput input);
        //Task<GetCVOutput> GetCVbyDetails(GetCVInput input);

    }
}
