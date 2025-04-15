using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeeRestday.Models
{
    [Table("appEmployeeRestday")]
    public class EmployeeRestday : FullAuditedEntity<int>
    {
        [Required]
        public int EmpId { get; set; }

        [Required]
        public string Days { get; set; }

    }
}
