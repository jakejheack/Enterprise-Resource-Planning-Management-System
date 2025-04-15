using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Common
{
    [Table("AppDeliveryTypes")]
    public class DeliveryType : Entity<int>
    {
        [Required]
        public int Code { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght128, ErrorMessage = ezinvmvcConsts.ErrorMessage128)]
        public string Name { get; set; }

        [Required]
        public int NoOfDays { get; set; }
    }
}
