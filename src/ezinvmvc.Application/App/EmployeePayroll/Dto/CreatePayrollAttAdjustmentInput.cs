using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ezinvmvc.App.EmployeePayroll.Dto
{
    public class CreatePayrollAttAdjustmentInput : FullAuditedEntity<int>
    {
        public int EmpId { get; set; }

        public string AttId { get; set; }

        public DateTime? DateT { get; set; }

        public int Index { get; set; }

        public int AdjType { get; set; }

        public int Plusminus { get; set; }

        public string AttAdjDescription { get; set; }

        public string AttAdjAmount { get; set; }

        //description unused
        public string Description1 { get; set; }

        public string Description2 { get; set; }

        public string Description3 { get; set; }

        public string Status1 { get; set; }

        public string Status2 { get; set; }

        public string Status3 { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
