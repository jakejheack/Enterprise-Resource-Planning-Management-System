using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Common.Dto
{
    public class GetTaxTypeOutput : Entity<int>
    {
        public int Code { get; set; }

        public string Name { get; set; }

        public decimal Rate { get; set; }

        public int Type { get; set; }

        public int LiabilityAccountId { get; set; }

        [NotMapped]
        public string Accountname { get; set; }
    }
}
