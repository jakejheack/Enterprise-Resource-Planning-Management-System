using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Clients.Dto
{
    public class UpdateClientInput : FullAuditedEntityDto<int?>
    {
        [Required]
        public int CompanyId { get; set; }

        [Required]
        public int SeriesTypeId { get; set; }

        [Required]
        public string Prefix { get; set; }

        [Required]
        public string Code { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string Name { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Type { get; set; }

        public bool IsReseller { get; set; }

        public string TaxNo { get; set; }

        public string TelNo { get; set; }
        public string FaxNo { get; set; }
        public string MobileNo { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string Address { get; set; }

        public int IndustryId { get; set; }

        public int VATTypeId { get; set; }

        public int CountryId { get; set; }

        public int ProvinceId { get; set; }

        public int CityId { get; set; }

        public int StatusId { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght128, ErrorMessage = ezinvmvcConsts.ErrorMessage128)]
        public string BusinessStyle { get; set; }

        public int AssignedToId { get; set; }
        
        public string AssignedToEmail { get; set; }

        [NotMapped]
        public string Company { get; set; }

        [NotMapped]
        public string SeriesType { get; set; }

        [NotMapped]
        public string CompleteAddress { get; set; }

        [NotMapped]
        public string Industry { get; set; }

        [NotMapped]
        public string VATType { get; set; }

        [NotMapped]
        public string Country { get; set; }

        [NotMapped]
        public string Province { get; set; }

        [NotMapped]
        public string City { get; set; }

        [NotMapped]
        public string Status { get; set; }

        [NotMapped]
        public string RefNo { get; set; }

        [NotMapped]
        public string AssignedTo { get; set; }

        [NotMapped]
        public int UAssignedToId { get; set; }

        [NotMapped]
        public string UAssignedTo { get; set; }

        [NotMapped]
        public string UAssignedToEmail { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
