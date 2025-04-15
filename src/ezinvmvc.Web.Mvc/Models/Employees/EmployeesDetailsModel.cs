using ezinvmvc.App.Employees.Dto;
using System.Collections.Generic;

namespace ezinvmvc.Web.Models.Employees
{
    public class EmployeesDetailsModel
    {
        public List<GetEmployeeDetailsOutput> Employees { get; set; }
        public string FilterText { get; set; }
        public CreateEmployeeDetailsInput Employee { get; set; }
        public GetEmployeeDetailsOutput EmpOutput { get; set; }
    }
}
