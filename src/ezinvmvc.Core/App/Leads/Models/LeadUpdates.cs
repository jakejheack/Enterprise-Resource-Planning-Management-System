using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Leads
{
    [Table("AppLeadUpdates")]
    public class LeadUpdates : FullAuditedEntity<int>
    {
        [Required]
        public int LeadId { get; set; }

        [Required]
        public int LeadTaskId { get; set; }

        public string Notes { get; set; }

        [Required]
        public string AssignedToId { get; set; }

        [Required]
        public string AssignedToEmail { get; set; }

        [Required]
        public DateTime NextContactDateTime { get; set; }

        [NotMapped]
        public string LeadCode { get; set; }

        [NotMapped]
        public string LeadName { get; set; }

        [NotMapped]
        public string LeadProject { get; set; }

        [NotMapped]
        public string LeadTask { get; set; }
    }
}
