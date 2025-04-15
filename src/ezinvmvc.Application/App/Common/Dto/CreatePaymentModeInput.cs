
using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Common.Dto
{
    public class CreatePaymentModeInput: Entity<int>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Name { get; set; }

        [Required]
        public int DefaultAccountId { get; set; }

        [Required]
        public bool IsTax { get; set; }

        [NotMapped]
        public string DefaultAccount { get; set; }
    }
}
