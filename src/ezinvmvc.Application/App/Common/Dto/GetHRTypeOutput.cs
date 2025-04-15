using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.Common.Dto
{
    public class GetHRTypeOutput : Entity<int>
    {
        public string Status { get; set; }

        public int TypeCode { get; set; }
    }
}
