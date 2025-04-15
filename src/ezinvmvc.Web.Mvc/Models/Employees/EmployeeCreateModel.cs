using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.GroupTypes.Dto;
using System.Collections.Generic;

namespace ezinvmvc.Web.Models.Employees
{
    public class EmployeeCreateModel
    {
        public CreateEmployeeInput Employee { get; set; }
        public List<GetEmployeeOutput> Employees { get; set; }
        public List<GetGroupTypeGroupOutput> GroupTypes { get; set; }
        public List<GetDepartmentOutput> Departments { get; set; }
        public List<GetDivEmployeeOutput> DivEmployee { get; set; }
        public List<GetSectorOutput> Sertors { get; set; }
        public List<GetPositionOutput> Positions { get; set; }
        public List<GetEmployeeOutput> Users { get; set; }
        public List<GetEmployeeOutput> Manager { get; set; }
    }
}
