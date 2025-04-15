using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Sales.DTO
{
    public class UpdateTasksInput : FullAuditedEntity<int>
    {
        public TasksInput tasks { get; set; }
    }
}
