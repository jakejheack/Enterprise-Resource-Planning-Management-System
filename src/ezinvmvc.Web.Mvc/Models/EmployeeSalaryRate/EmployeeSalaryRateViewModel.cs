using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.EmployeesSalaryRate.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezinvmvc.Web.Models.EmployeeSalaryRate
{
    public class EmployeeSalaryRateViewModel
    {
        public List<GetEmployeeOutput> Employees { get; set; }
        public string FilterText { get; set; }
        public CreateEmployeeSalariesInput CreateEmployeeSalary { get; set; }
    }
}
