using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ezinvmvc.App.Clients;
using ezinvmvc.App.ContactPersons;
using ezinvmvc.App.ContactPersons.Dto;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.ContactPersons;
using Microsoft.AspNetCore.Mvc;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class ContactPersonsController : ezinvmvcControllerBase
    {
        private readonly IContactPersonService _contactPersonService;
        private readonly IIndustryService _industryService;

        public ContactPersonsController(IContactPersonService contactPersonService, IIndustryService industryService)
        {
            _contactPersonService = contactPersonService;
            _industryService = industryService;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> CreateContactPersonModal(int refid, string refname, string reference)
        {
            var cpersonawait = await _industryService.GetIndustries();
            var cperson = new CreateContactPersonInput();
            cperson.Reference = reference;
            cperson.ReferenceId = refid;
            cperson.ReferenceName = refname;
            var model = new ContactPersonCreateModel
            {
                ContactPerson = cperson
            };
            return View("_CreateContactPersonModal", model);
        }

        public async Task<ActionResult> EditContactPersonModal(int id, string refname)
        {
            var cpersoninput = new GetContactPersonInput();
            //var cpersoninput = new CreateContactPersonInput();
            cpersoninput.Id = id;
            var getcperson = await _contactPersonService.GetContactPerson(cpersoninput);

            var cperson = Mapper.Map<UpdateContactPersonInput>(getcperson);
            cperson.ReferenceName = refname;
            var model = new ContactPersonUpdateModel
            {
                ContactPerson = cperson
            };
            return View("_EditContactPersonModal", model);
        }
    }
}