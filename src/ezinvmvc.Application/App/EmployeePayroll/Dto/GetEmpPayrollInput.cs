using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.EmployeePayroll.Dto
{
    public class GetEmpPayrollInput
    {
        public int Id { get; set; }

        public int EmpId { get; set; }

        public string AttId { get; set; }
    }
}
