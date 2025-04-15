using Abp.Domain.Entities;

namespace ezinvmvc.App.Leads.Dto
{
    public class DeleteLeadTaskInput : Entity<int>
    {
        public string Name { get; set; }
        
        public decimal Rate { get; set; }
    }
}
