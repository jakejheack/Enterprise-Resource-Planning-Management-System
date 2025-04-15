using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Notification.DTO
{
    public class GetNotificationOutput : AuditedEntity<int>
    {
        public string Message { get; set; }

        public string Action { get; set; }

        public string TransactionCode { get; set; }

        public string TransactionId { get; set; }

        public string UserIds { get; set; }

        //Not Use Extra Field//

        public string Cat1 { get; set; }

        public string Cat2 { get; set; }

        public string Cat3 { get; set; }

        public string Cat4 { get; set; }

        public string Cat5 { get; set; }

        public string Field1 { get; set; }

        public string Field2 { get; set; }

        public string Field3 { get; set; }

        public string Field4 { get; set; }

        public string Field5 { get; set; }

        public string Status1 { get; set; }

        public string Status2 { get; set; }

        public string Status3 { get; set; }

        //Not Use Extra Field//

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
