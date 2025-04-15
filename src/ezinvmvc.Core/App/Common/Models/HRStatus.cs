using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.Common.Models
{
    [Table("AppHRStatusTypes")]
    public class HRStatus : Entity<int>
    {
        public string Status { get; set; }

        public int TypeCode { get; set; }
    }
}
