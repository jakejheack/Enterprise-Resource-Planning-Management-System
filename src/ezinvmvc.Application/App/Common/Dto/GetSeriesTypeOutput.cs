using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Common.Dto
{
   public class GetSeriesTypeOutput: Entity<int>
    {
        public string Prefix { get; set; }

        public int LastSeries { get; set; }

        public int Padding { get; set; }

        public int TransactionId { get; set; }

        public int CompanyId { get; set; }

        [NotMapped]
        public string TransactionName { get; set; }
    }
}
