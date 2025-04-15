using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace ezinvmvc.App.Common.Dto
{
  public  class UpdateCodeNameInput : Entity<int>
    {
        [Required]
        public int Code { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght128, ErrorMessage = ezinvmvcConsts.ErrorMessage128)]
        public string Name { get; set; }
    }
}
