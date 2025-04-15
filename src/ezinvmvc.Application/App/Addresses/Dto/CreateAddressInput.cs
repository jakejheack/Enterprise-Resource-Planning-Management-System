using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Addresses.Dto
{
    public class CreateAddressInput : FullAuditedEntity<int>
    {
        [Required]
        public int ReferenceId { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght16, ErrorMessage = ezinvmvcConsts.ErrorMessage16)]
        public string Reference { get; set; }

        [Required]
        public string AddressDescription { get; set; }

        [Required]
        public int CountryId { get; set; }

        [Required]
        public int ProvinceId { get; set; }

        [Required]
        public int CityId { get; set; }

        public bool IsActive { get; set; }

        [NotMapped]
        public string CompleteAddress { get; set; }

        [NotMapped]
        public string Country { get; set; }

        [NotMapped]
        public string Province { get; set; }

        [NotMapped]
        public string City { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
