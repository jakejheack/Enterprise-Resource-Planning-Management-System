using Abp.Domain.Entities;

namespace ezinvmvc.App.Common.Dto
{
   public class GetInventoryTypeOutput : Entity<int>
    {
        public string Name { get; set; }
        public int EntryTypeCode { get; set; }
    }
}
