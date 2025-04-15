using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Vendors.Dto
{
    public class UpdateVendorInput : FullAuditedEntityDto<int?>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght128, ErrorMessage = ezinvmvcConsts.ErrorMessage128)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght32, ErrorMessage = ezinvmvcConsts.ErrorMessage32)]
        public string Phone { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght32, ErrorMessage = ezinvmvcConsts.ErrorMessage32)]
        public string TaxNo { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght328, ErrorMessage = ezinvmvcConsts.ErrorMessage328)]
        public string Address { get; set; }

        public string City { get; set; }

        public string Country { get; set; }

        public int IsTransporter { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
