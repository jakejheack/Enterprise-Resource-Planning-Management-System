using Abp.Domain.Entities;

namespace ezinvmvc.App.Common.Dto
{
    public class GetDeliveryTypeOutput : Entity<int>
    {
        public int Code { get; set; }

        public string Name { get; set; }

        public int NoOfDays { get; set; }
    }
}
