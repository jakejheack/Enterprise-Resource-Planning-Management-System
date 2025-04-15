using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Addresses.Dto
{
    public class DeleteProvinceInput : Entity<int>
    {
        public string Code { get; set; }
        
        public string Name { get; set; }
        
        public int CountryId { get; set; }

        [NotMapped]
        public string Country { get; set; }
    }
}
