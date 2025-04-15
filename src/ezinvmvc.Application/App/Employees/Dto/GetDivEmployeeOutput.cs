using Abp.Domain.Entities;

namespace ezinvmvc.App.Employees.Dto
{
    public class GetDivEmployeeOutput : Entity<int>
    {
        public string Name { get; set; }
        
    }
}
