using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Notification.DTO
{
    public class GetUserNotificationOutput : Entity<int>
    {
        public int NotificationId { get; set; }
        
        public int State { get; set; }
        
        public long UserId { get; set; }
        
        public DateTime CreationTime { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        [NotMapped]
        public string Message { get; set; }

        [NotMapped]
        public string TransactionCode { get; set; }

        [NotMapped]
        public string TransactionId { get; set; }

        [NotMapped]
        public string Action { get; set; }

        [NotMapped]
        public string UserName { get; set; }
    }
}
