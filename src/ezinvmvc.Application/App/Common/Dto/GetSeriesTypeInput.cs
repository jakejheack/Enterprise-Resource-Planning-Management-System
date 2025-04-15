using Abp.Domain.Entities;

namespace ezinvmvc.App.Common.Dto
{
    public class GetSeriesTypeInput
    {
        public int Id { get; set; }
        public int TransactionCode { get; set; }
        public int CompanyId { get; set; }
    }
}
