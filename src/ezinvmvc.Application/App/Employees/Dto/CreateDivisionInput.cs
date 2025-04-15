using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;

namespace ezinvmvc.App.Employees.Dto
{
    public class CreateDivisionInput : FullAuditedEntity<int>
    {
        [Required]
        public string Name { get; set; }

        public string Description { get; set; }
    }
}
