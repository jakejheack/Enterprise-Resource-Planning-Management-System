
using Abp.Domain.Entities.Auditing;
using ezinvmvc.App.Notification.DTO;
using ezinvmvc.App.Sales.Dto;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Sales.DTO
{
    public class CreateRFQOutput
    {
        public GetRFQOutput Rfq { get; set; }

        public GetNotificationOutput Notif { get; set; }

    }
}
