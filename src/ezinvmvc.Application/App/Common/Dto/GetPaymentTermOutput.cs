using Abp.Domain.Entities;

namespace ezinvmvc.App.Common.Dto
{
  public  class GetPaymentTermOutput: Entity<int>
    {
        public string Name { get; set; }

        public int NoOfDays { get; set; }

        public bool IsAdvance { get; set; }

        public bool IsDeleted { get; set; }
    }
}
