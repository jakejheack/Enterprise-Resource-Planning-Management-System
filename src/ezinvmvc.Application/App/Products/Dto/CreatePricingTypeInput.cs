using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace ezinvmvc.App.Products.Dto
{
   public class CreatePricingTypeInput : Entity<int>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Name { get; set; }
    }
}
