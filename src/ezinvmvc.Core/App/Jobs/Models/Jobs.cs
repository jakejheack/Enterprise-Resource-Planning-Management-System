using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ezinvmvc.App.Jobs
{
    [Table("AppJobs")]
    public class Jobs : FullAuditedEntity<int>
    {
        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght32, ErrorMessage = ezinvmvcConsts.ErrorMessage32)]
        public string JobTitle { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght32, ErrorMessage = ezinvmvcConsts.ErrorMessage32)]
        public string Department { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght32, ErrorMessage = ezinvmvcConsts.ErrorMessage32)]
        public string Position { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string Description { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string Responsibilities { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght256, ErrorMessage = ezinvmvcConsts.ErrorMessage256)]
        public string RequiredSkills { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght32, ErrorMessage = ezinvmvcConsts.ErrorMessage32)]
        public string Education { get; set; }

        [Required]
        [StringLength(ezinvmvcConsts.MaxLenght32, ErrorMessage = ezinvmvcConsts.ErrorMessage32)]
        public string Status { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }

        [NotMapped]
        public string Positionname { get; set; }

        [NotMapped]
        public string Departmentname { get; set; }
    }
}
