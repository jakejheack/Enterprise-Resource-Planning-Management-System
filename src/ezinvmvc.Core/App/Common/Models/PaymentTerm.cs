using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Common
{
    [Table("AppPaymentTerms")]
   public class PaymentTerm : Entity<int>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string Name { get; set; }

        [Required]
        public int NoOfDays { get; set; }

        [Required]
        public bool IsAdvance { get; set; } 

        public bool IsDeleted { get; set; }
    }
}
