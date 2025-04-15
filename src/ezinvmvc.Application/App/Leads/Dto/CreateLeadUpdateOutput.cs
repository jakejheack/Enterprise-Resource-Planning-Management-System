using Abp.Domain.Entities.Auditing;
using ezinvmvc.App.Notification.DTO;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Leads.Dto
{
    public class CreateLeadUpdateOutput
    {
        public GetLeadUpdateOutput LeadUpdate { get; set; }

        public List<GetNotificationOutput> Notifs { get; set; }
    }
}
