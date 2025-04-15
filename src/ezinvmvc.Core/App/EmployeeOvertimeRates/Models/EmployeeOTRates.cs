using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.EmployeeOvertimeRates.Models
{
    [Table("appEmployeeOTRates")]
    public class EmployeeOTRates : FullAuditedEntity<int>
    {
        [Required]
        public int EmpId { get; set; }

        [Required]
        public int TabId { get; set; }

        public string Status { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        [NotMapped]
        public string FullName { get; set; }

        [NotMapped]
        public string TableName { get; set; }

        [NotMapped]
        public int? RegularDayHours { get; set; }
    }
}
