using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.GroupTypes.Dto;
using ezinvmvc.App.EmployeesAccountsAbility.Dto;
using System.Collections.Generic;

namespace ezinvmvc.Web.Models.Employees
{
    public class EmployeesViewModel
    {        
        public List<GetEmployeeOutput> Employees { get; set; }
        public string FilterText { get; set; }
        public CreateEmployeeInput Employee { get; set; }
        public List<GetGroupTypeGroupOutput> GroupTypes { get; set; }
        public List<GetDepartmentOutput> Departments { get; set; }
        public List<GetDivEmployeeOutput> DivEmployee { get; set; }
        public List<GetSectorOutput> Sertors { get; set; }
        public List<GetPositionOutput> Positions { get; set; }
        public CreateAccoutnAbilityInput CreateAccoutn { get; set; }
    }
}
