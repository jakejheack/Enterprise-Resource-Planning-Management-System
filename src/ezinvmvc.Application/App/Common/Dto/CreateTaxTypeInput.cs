using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Common.Dto
{
   public class CreateTaxTypeInput: Entity<int>
    {
        //[Required]
        //public int SeriesTypeId { get; set; }

        [Required]
        public int Code { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Name { get; set; }

        [Required]
        public decimal Rate { get; set; }

        [Required]
        // 1 for vat 2 for ewt
        public int Type { get; set; }

        [Required]
        public int LiabilityAccountId { get; set; }

        [NotMapped]
        public string Accountname { get; set; }
        
    }
}
