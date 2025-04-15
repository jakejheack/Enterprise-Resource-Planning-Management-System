using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Notification.Models
{
    [Table("AppUserNotification")]
    public class UserNotification : Entity<int>
    {
        [Required]
        public int NotificationId { get; set; }

        [Required]
        public int State { get; set; }

        [Required]
        public long UserId { get; set; }

        [Required]
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
