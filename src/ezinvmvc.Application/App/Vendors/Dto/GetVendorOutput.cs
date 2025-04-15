using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Vendors.Dto
{
   public class GetVendorOutput : FullAuditedEntityDto<int>
    {
        public string Name { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string TaxNo { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public string Country { get; set; }

        public int IsTransporter { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
