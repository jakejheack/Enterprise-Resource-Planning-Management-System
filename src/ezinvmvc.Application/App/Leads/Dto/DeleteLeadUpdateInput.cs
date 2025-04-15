using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Leads.Dto
{
    public class DeleteLeadUpdateInput : FullAuditedEntity<int>
    {
        public DateTime LeadUpdateDate { get; set; }
        
        public int LeadId { get; set; }
        
        public int LeadTaskId { get; set; }

        public string Notes { get; set; }
        
        public int AssignedToId { get; set; }
        
        public string AssignedToEmail { get; set; }
        
        public DateTime NextContactDateTime { get; set; }

        [NotMapped]
        public string LeadCode { get; set; }

        [NotMapped]
        public string LeadName { get; set; }

        [NotMapped]
        public string LeadProject { get; set; }

        [NotMapped]
        public string LeadTask { get; set; }

        [NotMapped]
        public string AssignedTo { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
