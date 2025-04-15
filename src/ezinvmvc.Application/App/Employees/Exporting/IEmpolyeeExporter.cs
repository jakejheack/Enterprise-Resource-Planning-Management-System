using ezinvmvc.App.Employees.Dto;
using ezinvmvc.Dto;
using System.Collections.Generic;

namespace ezinvmvc.App.Employees.Exporting
{
    public interface IEmpolyeeExporter
    {
        FileDto ExportToFile(List<GetEmployeeOutput> EmployeeList);
    }
}
