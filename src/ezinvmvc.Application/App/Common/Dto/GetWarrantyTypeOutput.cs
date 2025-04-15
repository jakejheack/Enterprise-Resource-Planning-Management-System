using Abp.Domain.Entities;

namespace ezinvmvc.App.Common.Dto
{
    public class GetWarrantyTypeOutput : Entity<int>
    {
        public int Code { get; set; }

        public string Name { get; set; }
    }
}
