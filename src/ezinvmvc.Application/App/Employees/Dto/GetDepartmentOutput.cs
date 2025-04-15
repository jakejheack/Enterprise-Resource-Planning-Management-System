using Abp.Domain.Entities;

namespace ezinvmvc.App.Employees.Dto
{
    public class GetDepartmentOutput : Entity<int>
    {
        public string Name { get; set; }

    }
}
