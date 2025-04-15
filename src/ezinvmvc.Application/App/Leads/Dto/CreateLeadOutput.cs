using Abp.Domain.Entities.Auditing;
using ezinvmvc.App.Notification.DTO;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Leads.Dto
{
    public class CreateLeadOutput
    {
        public GetLeadOutput Lead { get; set; }
        
        public GetNotificationOutput Notif { get; set; }
    }
}
