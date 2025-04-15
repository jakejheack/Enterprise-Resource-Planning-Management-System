using System.ComponentModel.DataAnnotations;

namespace ezinvmvc.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}