using Abp.Domain.Entities;


namespace ezinvmvc.App.Common.Dto
{
  public  class GetCodeNameOutput:Entity<int>
    {
        public int Code { get; set; }
        public string Name { get; set; }
    }
}
