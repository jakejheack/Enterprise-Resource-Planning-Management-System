using Abp.Runtime.Validation;
using ezinvmvc.Dto;

namespace ezinvmvc.App.ContactPersons.Dto
{
    public class GetContactPersonListInput : PagedAndSortedInputDto, IShouldNormalize
    {
        public int Id { get; set; }
        public string Reference { get; set; }
        public int ReferenceId { get; set; }
        public string Filter { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "";
            }
            if (string.IsNullOrEmpty(Filter))
            {
                Filter = "";
            }
        }
    }
}
