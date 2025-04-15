using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Employees
{
    [Table("AppDepartment")]
    public class Department : FullAuditedEntity<int>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Name { get; set; }

        public string Description { get; set; }
    }
}
