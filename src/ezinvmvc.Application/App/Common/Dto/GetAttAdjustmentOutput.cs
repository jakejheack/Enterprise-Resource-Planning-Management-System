using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.Common.Dto
{
    public class GetAttAdjustmentOutput : Entity<int>
    {
        public string Types { get; set; }

        public int Status { get; set; }
    }
}
