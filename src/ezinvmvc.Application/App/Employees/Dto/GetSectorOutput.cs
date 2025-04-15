using Abp.Application.Services.Dto;
using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace ezinvmvc.App.Employees.Dto
{
    public class GetSectorOutput : Entity<int>
    {
        public string Name { get; set; }
    }
}
