using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Sales.Models
{
    [Table("AppTasks")]
    public class Tasks : FullAuditedEntity<int>
    {
        [Required]
        public string ReferenceTransactionCode { get; set; }

        [Required]
        public int ReferenceId { get; set; }

        [Required]
        public string TransactionCode { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public string Name { get; set; }

        //[Required]
        //[EmailAddress]
        public string Email { get; set; }

        [Required]
        public int Status { get; set; }

        [NotMapped]
        public string Code { get; set; }

        [NotMapped]
        public DateTime transactionTime { get; set; }

        [NotMapped]
        public int RevisionNo { get; set; }

        [NotMapped]
        public int StatusID { get; set; }

        [NotMapped]
        public int RfqId { get; set; }

        [NotMapped]
        public string AssignStatus { get; set; }

        [NotMapped]
        public int SoId { get; set; }

        [NotMapped]
        public string SoCode { get; set; }

        [NotMapped]
        public int SoRevNO { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
