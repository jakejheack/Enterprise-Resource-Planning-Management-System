using Abp.Domain.Repositories;
using Abp.Domain.Services;
using ezinvmvc.App.Common.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ezinvmvc.App.Common
{
    public class AttAdjustmentManager : DomainService, IAttAdjustmentManager
    {
        private readonly IRepository<AttAdjustmentTypes> _repository;

        public AttAdjustmentManager(IRepository<AttAdjustmentTypes> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<AttAdjustmentTypes>> GetAllListAsync()
        {
            return await _repository.GetAllListAsync();
        }
    }
}
