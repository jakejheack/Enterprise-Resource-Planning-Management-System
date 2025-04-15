using Abp.Domain.Entities;

namespace ezinvmvc.App.Common.Dto
{
    public class GetChargeTypeOutput : Entity<int>
    {
        public int Code { get; set; }

        public string Name { get; set; }

        public int RevenueAccountId { get; set; }
        
        public string RevenueAccount { get; set; }
    }
}
