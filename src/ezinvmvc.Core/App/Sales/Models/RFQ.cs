using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Sales.Models
{
    [Table("AppRFQ")]
    public class RFQ : FullAuditedEntity<int>
    {
        [Required]
        public int CompanyId { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string Code { get; set; }

        [Required]
        public DateTime TransactionTime { get; set; }

        [Required]
        public int SeriesTypeId { get; set; }

        [Required]
        public string Prefix { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string Type { get; set; }

        [Required]
        public int LeadId { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string Lead { get; set; }

        [Required]
        public int ClientId { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string Client { get; set; }

        [Required]
        public int ContactPersonId { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string ContactPerson { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string ProjectName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string Phone { get; set; }

        [Required]
        public string Address { get; set; }

        //[Required]
        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string TelNo { get; set; }

        [Required]
        public string DeliveryAddress { get; set; }

        public string Remarks { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string Discount { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string Vat { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
        public int RevisionNo { get; set; }

        //public string IsRevise { get; set; }

        [NotMapped]
        public int Assignedid { get; set; }

        [NotMapped]
        public string Company { get; set; }

        [NotMapped]
        public string Status { get; set; }

        [NotMapped]
        public string AssignedPerson { get; set; }

        [NotMapped]
        public int Astatus { get; set; }

        [NotMapped]
        public string AccountExecutive { get; set; }

        [NotMapped]
        public int UAssignedToId { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        public DateTime Deadlines { get; set; }

        public string Others { get; set; }

        [NotMapped]
        public string ClientName { get; set; }
    }

}

