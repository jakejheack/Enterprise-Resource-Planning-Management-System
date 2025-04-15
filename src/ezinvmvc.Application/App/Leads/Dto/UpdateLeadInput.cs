using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Leads.Dto
{
    public class UpdateLeadInput : FullAuditedEntity<int>
    {
        [Required]
        public int CompanyId { get; set; }

        [Required]
        public int SeriesTypeId { get; set; }

        [Required]
        public string Prefix { get; set; }

        [Required]
        public string Code { get; set; }

        [Required]
        public DateTime LeadDate { get; set; }

        [Required]
        public string ClientId { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Name { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght64, ErrorMessage = ezinvmvcConsts.ErrorMessage64)]
        public string Project { get; set; }

        [Required]
        public int ContactPersonId { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght32, ErrorMessage = ezinvmvcConsts.ErrorMessage32)]
        public string ContactPerson { get; set; }

        public string TelNo { get; set; }
        public string FaxNo { get; set; }
        public string MobileNo { get; set; }

        public string Email { get; set; }

        public int LeadSourceId { get; set; }

        public string Address { get; set; }

        public int LeadTaskId { get; set; }

        public string Notes { get; set; }

        [Required]
        public int AssignedToId { get; set; }

        [Required]
        public string AssignedToEmail { get; set; }

        [Required]
        public DateTime NextContactDateTime { get; set; }

        public int StatusId { get; set; }

        [NotMapped]
        public string Company { get; set; }

        [NotMapped]
        public string SeriesType { get; set; }

        [NotMapped]
        public string LeadSource { get; set; }

        [NotMapped]
        public string LeadTask { get; set; }

        [NotMapped]
        public string AssignedTo { get; set; }

        [NotMapped]
        public string Status { get; set; }

        [NotMapped]
        public int ULeadUpdateId { get; set; }

        [NotMapped]
        public int ULeadTaskId { get; set; }

        [NotMapped]
        public string ULeadTask { get; set; }

        [NotMapped]
        public DateTime UNextContactDateTime { get; set; }

        [NotMapped]
        public int UAssignedToId { get; set; }

        [NotMapped]
        public string UAssignedTo { get; set; }

        [NotMapped]
        public string UAssignedToEmail { get; set; }

        [NotMapped]
        public int RFQId { get; set; }

        [NotMapped]
        public int QuotationId { get; set; }

        [NotMapped]
        public int SalesOrderId { get; set; }

        [NotMapped]
        public int SalesInvoiceId { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        [NotMapped]
        public string ClientName { get; set; }
    }
}
