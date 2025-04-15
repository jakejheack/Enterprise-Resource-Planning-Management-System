using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Sales.DTO
{
    public class TasksOutput : FullAuditedEntity<int>
    {
        public string ReferenceTransactionCode { get; set; }

        public int ReferenceId { get; set; }

        public string TransactionCode { get; set; }

        public int EmployeeId { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public int Status { get; set; }

        [NotMapped]
        public string Code { get; set; }

        [NotMapped]
        public DateTime TransactionTime { get; set; }

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
