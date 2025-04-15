using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.CashVoucher.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.CashVoucher
{
    public interface ICashVoucherService : IApplicationService
    {
        Task<GetCashVoucherOutput> GetCashVoucher(GetCashVoucherInput input);
        Task<PagedResultDto<CashVoucherOutput>> GetAllCashVoucher(GetCashVoucherListInput input);
        Task<int> CreateCashVoucher(CreateCashVoucherInput input);
        Task<int> UpdateCashVoucher(UpdateCashVoucherInput input);

        Task<PagedResultDto<CashVoucherItemOutput>> GetCashVoucherItemByParentId(GetCashVoucherInput input);

    }
}
