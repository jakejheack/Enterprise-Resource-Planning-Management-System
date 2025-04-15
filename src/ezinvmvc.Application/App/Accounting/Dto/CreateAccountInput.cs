using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Accounting.Dto
{
    public class CreateAccountInput : FullAuditedEntityDto<int>
    {
      public AccountInput account { get; set; }
    }
}
