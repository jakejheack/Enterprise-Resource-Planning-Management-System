using Abp.Domain.Entities;

namespace ezinvmvc.App.Common.Dto
{
   public class GetTransactionOutput : Entity<int>
    {
        public int Code { get; set; }

        public string Name { get; set; }

        public int GroupTypeId { get; set; } //0 = ungroup, 1 = billing documents, 2 = inventory
    }
}
