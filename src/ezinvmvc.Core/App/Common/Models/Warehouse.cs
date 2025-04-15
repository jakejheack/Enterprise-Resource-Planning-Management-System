using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Common
{
    [Table("AppWarehouses")]
    public class Warehouse : Entity<int>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght8, ErrorMessage = ezinvmvcConsts.ErrorMessage8)]
        public string Abbr { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Name { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght328, ErrorMessage = ezinvmvcConsts.ErrorMessage328)]
        public string Description { get; set; }

        public bool IsTemp { get; set; }

        public bool IsMain { get; set; }
    }
}
