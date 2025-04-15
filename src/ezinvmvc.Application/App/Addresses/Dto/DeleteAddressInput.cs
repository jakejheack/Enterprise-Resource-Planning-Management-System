using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Addresses.Dto
{
    public class DeleteAddressInput : FullAuditedEntity<int>
    {
        public int ReferenceId { get; set; }
        
        public string Reference { get; set; }
        
        public string AddressDescription { get; set; }
        
        public int CountryId { get; set; }
        
        public int ProvinceId { get; set; }
        
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
