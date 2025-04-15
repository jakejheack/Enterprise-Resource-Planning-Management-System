using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using AutoMapper;
using ezinvmvc.App.Clients.Dto;
using Abp.Authorization;
using ezinvmvc.Authorization;
using ezinvmvc.Dto;
using ezinvmvc.App.Clients.Exporting;
using ezinvmvc.App.Common;
using ezinvmvc.App.Leads;
using ezinvmvc.App.Leads.Dto;
using ezinvmvc.App.Addresses.Dto;
using ezinvmvc.App.Addresses;
using ezinvmvc.App.Addresses.Models;
using ezinvmvc.App.Employees.Dto;
using ezinvmvc.App.Employees;
using ezinvmvc.App.Employees.Models;
using System;

namespace ezinvmvc.App.Clients
{
    //[AbpAuthorize(PermissionNames.Master_Clients)]
    public class ClientService : ezinvmvcAppServiceBase, IClientService
    {
        private readonly IClientManager _manager;
        private readonly IAddressManager _addressManager;
        private readonly IAccountExecutiveManager _aeManager;
        private readonly ISeriesTypeManager _seriesTypeManager;
        private readonly ILeadManager _leadManager;
        private readonly IClientExporter _exporter;

        public ClientService(IClientManager manager, IAddressManager addressManager, IAccountExecutiveManager aeManager, IClientExporter exporter, ISeriesTypeManager seriesTypeManager, ILeadManager leadManager)
        {
            _manager = manager;
            _addressManager = addressManager;
            _aeManager = aeManager;
            _seriesTypeManager = seriesTypeManager;
            _leadManager = leadManager;
            _exporter = exporter;
        }

        public async Task<int> CreateClient(CreateClientInput input)
        {
            //series
            var seriestype = await _seriesTypeManager.GetByIdAsync(input.SeriesTypeId);
            int nextseries = seriestype.LastSeries + 1;
            string seriescode = seriestype.Prefix + nextseries.ToString().PadLeft(seriestype.Padding, '0');
            seriestype.LastSeries = nextseries;
            CheckErrors(await _seriesTypeManager.UpdateAsync(seriestype));
            input.Prefix = seriestype.Prefix;
            input.Code = seriescode;
            //series

            //Client
            Client output = Mapper.Map<Client>(input);

            CheckErrors(await _manager.CreateAsync(output));
            //Client

            //Address
            CreateAddressInput addressInput = new CreateAddressInput();
            addressInput.Reference = "Client";
            addressInput.ReferenceId = output.Id;
            addressInput.AddressDescription = input.Address;
            addressInput.CityId = input.CityId;
            addressInput.ProvinceId = input.ProvinceId;
            addressInput.CountryId = input.CountryId;
            addressInput.IsActive = true;

            Address address = Mapper.Map<Address>(addressInput);

            CheckErrors(await _addressManager.CreateAsync(address));
            //Address

            //Account Executive
            CreateAccountExecutiveInput aeInput = new CreateAccountExecutiveInput();
            aeInput.Reference = "Client";
            aeInput.ReferenceId = output.Id;
            aeInput.EmployeeId = output.AssignedToId;
            aeInput.AssignedDate = output.CreationTime;

            AccountExecutive ae = Mapper.Map<AccountExecutive>(aeInput);

            CheckErrors(await _aeManager.CreateAsync(ae));
            //Account Executive

            await CurrentUnitOfWork.SaveChangesAsync();

            return output.Id;
        }

        public async Task DeleteClient(DeleteClientInput input)
        {
            CheckErrors(await _manager.DeleteAsync(input.Id));
        }

        public async Task<GetClientOutput> GetClient(GetClientInput input)
        {
            var getbyid = await _manager.GetByIdAsync(input.Id);
            return Mapper.Map<GetClientOutput>(getbyid);
        }

        public async Task<GetClientOutput> GetBillingAddressAsync(GetClientInput input)
        {
            var getbyid = await _manager.GetBillingAddressAsync(input.Id);
            return Mapper.Map<GetClientOutput>(getbyid);
        }

        public async Task<GetClientOutput> GetBillingSIAddressAsync(GetClientInput input)
        {
            var getbyid = await _manager.GetSIBillingAddressAsync(input.Id);
            return Mapper.Map<GetClientOutput>(getbyid);
        }

        public async Task<PagedResultDto<GetClientOutput>> GetClients(GetClientListInput input)
        {
            var resultList = await _manager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            int listcount = 0;
            if (resultList.Count() > 0)
            {
                listcount = resultList.First().TotalRows;
            }
            return new PagedResultDto<GetClientOutput>(listcount, ObjectMapper.Map<List<GetClientOutput>>(resultList));
        }

        public async Task<IEnumerable<GetClientOutput>> GetClientDetails(GetClientInput input)
        {
            var result = await _manager.GetDetailsByIdAsync(input.Id);
            return Mapper.Map<List<GetClientOutput>>(result);
        }

        public async Task<IEnumerable<GetClientOutput>> GetAllClients()
        {
            var getall = await _manager.GetAllClientList();
            return Mapper.Map<List<GetClientOutput>>(getall);
        }

        public async Task<FileDto> GetClientsToExcel(GetClientListInput input)
        {
            var resultList = await _manager.GetAllList(input.Filter, input.Sorting, input.SkipCount, input.MaxResultCount, input.ForExport);
            var resultToExport = ObjectMapper.Map<List<GetClientOutput>>(resultList);
            var result = _exporter.ExportToFile(resultToExport);
            return result;
        }

        public async Task UpdateClient(UpdateClientInput input)
        {
            Client output = Mapper.Map<UpdateClientInput, Client>(input);

            //Client
            CheckErrors(await _manager.UpdateAsync(output));
            //Client

            //Leads
            if (input.StatusId == 5)
            {
                string filter = "null|null|null|null|null|" + input.Id;
                var leads = await _leadManager.GetAllList(filter, "", 0, 0, true);
                var leadList = Mapper.Map<List<GetLeadOutput>>(leads);
                foreach (var glo in leadList)
                {
                    var updateleadstatus = await _leadManager.GetByIdAsync(glo.Id);
                    if (updateleadstatus.StatusId != 3)
                    {
                        updateleadstatus.StatusId = 3;

                        CheckErrors(await _leadManager.UpdateAsync(updateleadstatus));
                    }
                }
            }
            //Leads

            //Address
            var oldAddress = await _addressManager.GetByReferenceIdAsync(output.Id, "Client");
            if(oldAddress == null)
            {
                CreateAddressInput addressInput = new CreateAddressInput();
                addressInput.Reference = "Client";
                addressInput.ReferenceId = output.Id;
                addressInput.AddressDescription = input.Address;
                addressInput.CityId = input.CityId;
                addressInput.ProvinceId = input.ProvinceId;
                addressInput.CountryId = input.CountryId;
                addressInput.IsActive = true;

                Address createaddress = Mapper.Map<Address>(addressInput);

                CheckErrors(await _addressManager.CreateAsync(createaddress));
            }
            else if (oldAddress.CountryId != output.CountryId || oldAddress.ProvinceId != output.ProvinceId || oldAddress.CityId != output.CityId || oldAddress.AddressDescription.ToUpper() != output.Address.ToUpper())
            {
                oldAddress.IsActive = false;

                Address updateoldaddress = Mapper.Map<Address>(oldAddress);

                CheckErrors(await _addressManager.UpdateAsync(updateoldaddress));

                CreateAddressInput addressInput = new CreateAddressInput();
                addressInput.Reference = "Client";
                addressInput.ReferenceId = output.Id;
                addressInput.AddressDescription = input.Address;
                addressInput.CityId = input.CityId;
                addressInput.ProvinceId = input.ProvinceId;
                addressInput.CountryId = input.CountryId;
                addressInput.IsActive = true;

                Address createaddress = Mapper.Map<Address>(addressInput);

                CheckErrors(await _addressManager.CreateAsync(createaddress));
            }
            else
            {
                //oldAddress.AddressDescription = input.Address;

                Address updateaddress = Mapper.Map<Address>(oldAddress);

                CheckErrors(await _addressManager.UpdateAsync(updateaddress));
            }
            //Address

            //AccountExecutive
            var oldAE = await _aeManager.GetByReferenceIdAsync(output.Id, "Client");
            if (oldAE == null)
            {
                CreateAccountExecutiveInput aeInput = new CreateAccountExecutiveInput();
                aeInput.Reference = "Client";
                aeInput.ReferenceId = output.Id;
                aeInput.EmployeeId = output.AssignedToId;
                aeInput.AssignedDate = System.DateTime.Now;
                aeInput.IsActive = true;

                AccountExecutive ae = Mapper.Map<AccountExecutive>(aeInput);

                CheckErrors(await _aeManager.CreateAsync(ae));
            }
            else if (oldAE.EmployeeId != output.AssignedToId)
            {
                oldAE.IsActive = false;

                AccountExecutive updateoldae = Mapper.Map<AccountExecutive>(oldAE);

                CheckErrors(await _aeManager.UpdateAsync(updateoldae));

                CreateAccountExecutiveInput aeInput = new CreateAccountExecutiveInput();
                aeInput.Reference = "Client";
                aeInput.ReferenceId = output.Id;
                aeInput.EmployeeId = output.AssignedToId;
                aeInput.AssignedDate = output.CreationTime;
                aeInput.IsActive = true;

                AccountExecutive ae = Mapper.Map<AccountExecutive>(aeInput);

                CheckErrors(await _aeManager.CreateAsync(ae));
            }
            else
            {
                //oldAddress.AddressDescription = input.Address;

                AccountExecutive updateae = Mapper.Map<AccountExecutive>(oldAE);

                CheckErrors(await _aeManager.UpdateAsync(updateae));
            }
            //AccountExecutive

            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
