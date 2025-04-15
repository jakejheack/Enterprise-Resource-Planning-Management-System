using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.EmployeesAllowance.Dto;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ezinvmvc.Web.Models.EmployeeAllowance
{
    public class EmployeeAllowanceViewModel
    {
        public List<GetEmployeeOutput> Employees { get; set; }
        public string FilterText { get; set; }
        public CreateEmployeesAllowanceInput CreateEmployeesAllowance { get; set; }
    }
}
