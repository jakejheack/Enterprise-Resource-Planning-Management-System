using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Sales.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
  public  interface ISalesInvoiceService : IApplicationService
    {
        Task<int> CreateSalesInvoice(CreateSalesInvoiceInput input);
        Task<PagedResultDto<SalesInvoiceOutput>> GetSalesInvoices(GetSalesInvoicesInput input);
        Task<SalesInvoiceOutput> GetSalesInvoice(GetSalesInvoiceInput input);
        Task<int> UpdateSalesInvoice(UpdateSalesInvoiceInput input);

        Task<PagedResultDto<SalesInvoiceItemOutput>> GetSalesInvoiceItemsByParentId(GetSalesInvoiceInput input);
        Task<PagedResultDto<SalesInvoiceChargeOutput>> GetSalesInvoiceChargesByParentId(GetSalesInvoiceInput input);

        Task<PagedResultDto<AccountsReceivableOutput>> GetAccountsReceivable(GetSalesInvoicesInput input);
    }
}
