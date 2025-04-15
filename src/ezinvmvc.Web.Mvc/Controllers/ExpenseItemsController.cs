using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using AutoMapper;
using ezinvmvc.App.ExpenseItems;
using ezinvmvc.App.ExpenseItems.Dto;
using ezinvmvc.Authorization;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.Common;
using ezinvmvc.Web.Models.ExpenseItems;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace ezinvmvc.Web.Mvc.Controllers
{
    [AbpMvcAuthorize(PermissionNames.Master_ExpenseItems)]
    public class ExpenseItemsController : ezinvmvcControllerBase
    {
        private readonly IExpenseItemService _expenseItemService;

        public ExpenseItemsController(IExpenseItemService expenseItemservice) //, IBrandService brandservice,ICategoryService categoryservice, IUnitService unitservice, ICostingTypeService costingtypeservice, IPricingTypeService pricingtypeservice, IFileProvider fileProvider)
        {
            _expenseItemService = expenseItemservice;
        }
        public async Task<ActionResult> Index(GetExpenseItemInput input)
        {
            var model = new ExpenseItemViewModel
            {
                FilterText = Request.Query["filterText"],
            };
            return View(model);
        }
        public async Task<ActionResult> Create()
        {
            //var getcategories = await _categoryService.GetCategories();
            //var getbrands = await _brandService.GetBrands();
            //var getunits = await _unitService.GetUnits();
            //var getcostingtypes = await _costingTypeService.GetCostingTypes();

            //List<GetCategoryOutput> categories = getcategories.Cast<GetCategoryOutput>().ToList();
            //List<GetBrandOutput> brands = getbrands.Cast<GetBrandOutput>().ToList();
            //List<GetUnitOutput> units = getunits.Cast<GetUnitOutput>().ToList();
            //List<GetCostingTypeOutput> costingtypes = getcostingtypes.Cast<GetCostingTypeOutput>().ToList();

            //CreateProductInput product = new CreateProductInput();

            //var model = new ProductCreateModel
            //{
            //    Product = product,
            //    //Categories = categories,
            //    //Brands = brands,
            //    Units = units,
            //    CostingTypes = costingtypes
            //};

            return View();
        }
        public async Task<ActionResult> Edit(int id)
        {
            ModelState.Clear();
            GetExpenseItemInput expenseIteminput = new GetExpenseItemInput();
            expenseIteminput.Id = id;

            //var getcategories = await _categoryService.GetCategories();
            //var getbrands = await _brandService.GetBrands();
            //var getunits = await _unitService.GetUnits();
            //var getcostingtypes = await _costingTypeService.GetCostingTypes();
            var getExpenseItem = await _expenseItemService.GetExpenseItem(expenseIteminput);

            //List<GetCategoryOutput> categories = getcategories.Cast<GetCategoryOutput>().ToList();
            //List<GetBrandOutput> brands = getbrands.Cast<GetBrandOutput>().ToList();
            //List<GetUnitOutput> units = getunits.Cast<GetUnitOutput>().ToList();
            //List<GetUnitOutput> productunits = getunits.Cast<GetUnitOutput>().ToList();

            //List<GetCostingTypeOutput> costingtypes = getcostingtypes.Cast<GetCostingTypeOutput>().ToList();

            var expenseItem = Mapper.Map<CreateExpenseItemInput>(getExpenseItem);

            var model = new ExpenseItemCreateModel
            {
                ExpenseItem = expenseItem,
                //Categories = categories,
                //Brands = brands,
                //Units = units,
                //CostingTypes = costingtypes,
            };
            return View(model);
        }
    }
}