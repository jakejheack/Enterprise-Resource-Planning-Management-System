using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace ezinvmvc.App.Common.Dto
{
    public class UpdateWarrantyTypeInput : Entity<int>
    {
        [Required]
        public int Code { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string Name { get; set; }
    }
}
