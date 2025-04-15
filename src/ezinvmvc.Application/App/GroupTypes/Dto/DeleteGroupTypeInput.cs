using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace ezinvmvc.App.GroupTypes.Dto
{
    public class DeleteGroupTypeInput : FullAuditedEntityDto<int>
    {
        [Required]
        public string GroupTypes { get; set; }

        [Required]
        public string Group { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public int Ids { get; set; }

        public string Status { get; set; }
    }
}
