using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Addresses.Dto
{
    public class UpdateCityInput : Entity<int>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Code { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Name { get; set; }

        [Required]
        public int CountryId { get; set; }

        [NotMapped]
        public string Country { get; set; }

        [Required]
        public int ProvinceId { get; set; }

        [NotMapped]
        public string Province { get; set; }
    }
}
