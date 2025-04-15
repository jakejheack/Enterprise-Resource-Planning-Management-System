using Abp.Domain.Entities.Auditing;
using ezinvmvc.App.Notification.DTO;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Sales.DTO
{
    public class CreateTasksOutput
    {
        public TasksOutput Tasks { get; set; }

        public List<GetNotificationOutput> Notifs { get; set; }
    }
}
