using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezinvmvc.Web.Models.Payroll
{
    public class PayrollEditModel
    {
        public int Id { get; set; }
        public int EmpId { get; set; }
        public int EmpCode { get; set; }
        public int AttId { get; set; }
    }
}
