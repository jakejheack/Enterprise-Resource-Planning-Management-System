using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Common.Models
{
    [Table("AppAttAdjustmentTypes")]
    public class AttAdjustmentTypes : Entity<int>
    {
        public string Types { get; set; }

        public int Status { get; set; }
    }
}
