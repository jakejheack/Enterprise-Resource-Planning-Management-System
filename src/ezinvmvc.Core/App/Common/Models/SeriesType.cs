using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Common
{
    [Table("AppSeriesType")]
   public class SeriesType: Entity<int>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght8, ErrorMessage = ezinvmvcConsts.ErrorMessage8)]
        public string Prefix { get; set; }

        [Required]
        public int LastSeries { get; set; }

        [Required]
        public int Padding { get; set; }

        [Required]
        public int TransactionId { get; set; }

        [Required]
        public int CompanyId { get; set; }

        [NotMapped]
        public string TransactionName { get; set; }
    }
}
