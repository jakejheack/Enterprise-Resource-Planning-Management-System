using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.EmpAttRecords.DTO
{
    public class PayrollListInput
    {
        public int EmpId { get; set; }

        public string AttRecId { get; set; }

        public decimal SSSAmount { get; set; }

        public string Compensation { get; set; }

        public int LoanTitle { get; set; }

        public int DedId { get; set; }
    }
}
