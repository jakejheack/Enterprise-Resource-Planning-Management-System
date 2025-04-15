using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ezinvmvc.App.Sales.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ezinvmvc.App.Sales
{
  public interface ISalesOrderService : IApplicationService
    {
        Task<CreateSalesOrderOutput> CreateSalesOrder(CreateSalesOrderInput input);
        Task<PagedResultDto<SalesOrderOutput>> GetSalesOrders(GetSalesOrdersInput input);
        Task<GetSalesOrderOutput> GetSalesOrder(GetSalesOrderInput input);
        Task<CreateSalesOrderOutput> UpdateSalesOrder(UpdateSalesOrderInput input);
        //Task DeleteVendor(DeleteSalesOrderInput input);

        Task<PagedResultDto<SalesOrderItemOutput>> GetSalesOrderItemsByParentId(GetSalesOrderInput input);
        Task<PagedResultDto<SalesOrderChargeOutput>> GetSalesOrderChargesByParentId(GetSalesOrderInput input);

        Task<PagedResultDto<SalesOrderOutput>> GetSalesOrderReport(GetTasksListInput input);
        Task<PagedResultDto<SalesOrderOutput>> UpdateTPC(GetRFQListInput input);
        Task<PagedResultDto<SalesOrderOutput>> UpdateQDiscount(GetRFQListInput input);
        Task<PagedResultDto<SalesOrderOutput>> SalesorderSummaryAgentIdAsync(GetSalesOrdersInput input);
        Task<GetSalesOrderOutput> AgentDivision(GetSalesOrderInput input);

        Task<PagedResultDto<SalesOrderOutput>> Dashboard(GetSalesOrdersInput input);
        Task<IEnumerable<SalesOrderOutput>> GetSORevisions(GetSalesOrdersInput input);

    }
}
