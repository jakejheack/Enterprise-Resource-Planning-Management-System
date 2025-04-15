using System;
using System.Collections.Generic;
using System.Text;

namespace ezinvmvc.App.EmpAttRecords.DTO
{
    public class CreateEmpAttInput
    {
        public EmpAttInput EmpAttInputs { get; set; }
        public List<EmpAttDetailsInput> EmpAttDetailsInputs { get; set; }

        public int EmpId { get; set; }

        public int Id { get; set; }
    }
}
