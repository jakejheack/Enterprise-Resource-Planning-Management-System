using Abp.Domain.Entities;

namespace ezinvmvc.App.Common.Dto
{
   public class GetPaymentModeOutput : Entity<int>
    {
        public string Name { get; set; }

        public int DefaultAccountId { get; set; }

        public bool IsTax { get; set; }
        
        public string DefaultAccount { get; set; }
    }
}
