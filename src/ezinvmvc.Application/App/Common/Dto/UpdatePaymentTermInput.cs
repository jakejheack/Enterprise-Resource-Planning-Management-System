using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace ezinvmvc.App.Common.Dto
{
   public class UpdatePaymentTermInput : Entity<int>
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
