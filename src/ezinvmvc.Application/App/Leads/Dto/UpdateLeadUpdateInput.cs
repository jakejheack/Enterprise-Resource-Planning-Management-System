using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Leads.Dto
{
    public class UpdateLeadUpdateInput : FullAuditedEntity<int>
    {
        [Required]
        public DateTime LeadUpdateDate { get; set; }

        [Required]
        public int LeadId { get; set; }

        [Required]
        public int LeadTaskId { get; set; }

        public string Notes { get; set; }

        [Required]
        public int AssignedToId { get; set; }

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

        [NotMapped]
        public string AssignedTo { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
