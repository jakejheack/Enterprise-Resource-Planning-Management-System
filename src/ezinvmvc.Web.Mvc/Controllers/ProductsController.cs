using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using AutoMapper;
using ezinvmvc.App.Products;
using ezinvmvc.App.Products.Dto;
using ezinvmvc.Authorization;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.Common;
using ezinvmvc.Web.Models.Products;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace ezinvmvc.Web.Mvc.Controllers
{
    [AbpMvcAuthorize(PermissionNames.Master_Products)]
    public class ProductsController : ezinvmvcControllerBase
    {
        private readonly IProductService _productService;
        private readonly ICategoryService _categoryService;
        private readonly IBrandService _brandService;
        private readonly IUnitService _unitService;
        private readonly ICostingTypeService _costingTypeService;
        private readonly IPricingTypeService _pricingTypeService;
        private readonly IFileProvider _fileProvider;

        public ProductsController(IProductService productservice,IBrandService brandservice,ICategoryService categoryservice, IUnitService unitservice, ICostingTypeService costingtypeservice, IPricingTypeService pricingtypeservice, IFileProvider fileProvider)
        {
            _productService = productservice;
            _brandService = brandservice;
            _categoryService = categoryservice;
            _unitService = unitservice;
            _costingTypeService = costingtypeservice;
            _pricingTypeService = pricingtypeservice;
            _fileProvider = fileProvider;
        }
        public async Task<ActionResult> Index(GetProductInput input)
        {
            var model = new ProductViewModel
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
            GetProductInput productinput = new GetProductInput();
            productinput.Id = id;

            //var getcategories = await _categoryService.GetCategories();
            //var getbrands = await _brandService.GetBrands();
            //var getunits = await _unitService.GetUnits();
            //var getcostingtypes = await _costingTypeService.GetCostingTypes();
            var getproduct = await _productService.GetProduct(productinput);

            //List<GetCategoryOutput> categories = getcategories.Cast<GetCategoryOutput>().ToList();
            //List<GetBrandOutput> brands = getbrands.Cast<GetBrandOutput>().ToList();
            //List<GetUnitOutput> units = getunits.Cast<GetUnitOutput>().ToList();
            //List<GetUnitOutput> productunits = getunits.Cast<GetUnitOutput>().ToList();

            //List<GetCostingTypeOutput> costingtypes = getcostingtypes.Cast<GetCostingTypeOutput>().ToList();

            var product = Mapper.Map<CreateProductInput>(getproduct);

            var model = new ProductCreateModel
            {
                Product = product,
                //Categories = categories,
                //Brands = brands,
                //Units = units,
                //CostingTypes = costingtypes,
            };
            return View(model);
        }


        public async Task<ActionResult> CreateCategoryModal()
        {
            var category = new CreateCategoryInput();
            var model = new CategoryCreateModel
            {
                Category = category
            };
            return View("_CreateCategoryModal", model);
        }
        public async Task<ActionResult> CreateBrandModal()
        {
            var brand = new CreateBrandInput();
            var model = new BrandCreateModel
            {
                Brand = brand
            };
            return View("_CreateBrandModal", model);
        }
        public async Task<ActionResult> CreateUnitModal()
        {
            var unit = new CreateUnitInput();
            var model = new UnitCreateModel
            {
                Unit = unit
            };
            return View("_CreateUnitModal", model);
        }
        public async Task<ActionResult> CreatePricingTypeModal()
        {
            var pricingtype = new CreatePricingTypeInput();
            var model = new PricingTypeCreateModel
            {
                PricingType = pricingtype
            };
            return View("_CreatePricingTypeModal", model);
        }
        [HttpPost]
        public async Task<IActionResult> UploadFile(IFormFile file,string code)
        {
            if (file == null || file.Length == 0)
                return Content("file not selected");

            var serverpath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot","products" ,code);

            var fullpath = Path.Combine(serverpath,file.GetFilename());

            string filename = file.GetFilename();
            if (Directory.Exists(serverpath))
            {
                Directory.Delete(serverpath, true);
            }
            
            Directory.CreateDirectory(serverpath);

            ResizeAndSaveImage(file.OpenReadStream(), fullpath);
            
            return Json(new { success = true });
        }
        [HttpPost]
        public async Task<IActionResult> UpdateFile(IFormFile file, string code,string oldcode,string oldimagename)
        {
            var oldserverpath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "products", oldcode);
            var newserverpath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "products", code);
            if (file == null || file.Length == 0)
            {
                var oldfullpath = Path.Combine(oldserverpath, oldimagename);
                var newfullpath = Path.Combine(newserverpath, oldimagename);
                if (code != oldcode)
                {
                    if (Directory.Exists(oldserverpath))
                    {
                        if (!Directory.Exists(newserverpath))
                        {
                            Directory.CreateDirectory(newserverpath);
                        }
                        else
                        {
                            Directory.Delete(newserverpath, true);
                            Directory.CreateDirectory(newserverpath);
                        }
                        System.IO.File.Copy(oldfullpath, newfullpath, true);

                        if (Directory.Exists(oldserverpath))
                        {
                            Directory.Delete(oldserverpath);
                        }
                    }
                }
            }
            else
            {
                var newfullpath = Path.Combine(newserverpath, file.GetFilename());
                string filename = file.GetFilename();
                if (Directory.Exists(newserverpath))
                {
                    Directory.Delete(newserverpath, true);
                }
                Directory.CreateDirectory(newserverpath);

                ResizeAndSaveImage(file.OpenReadStream(), newfullpath);
            }
            return Json(new { success = true });
        }
        [HttpPost]
        public async Task<IActionResult> RemoveFile(string code)
        {
            var newserverpath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "products", code);
            if (Directory.Exists(newserverpath))
            {
                Directory.Delete(newserverpath, true);
            }
            return Json(new { success = true });
        }
        public static void ResizeAndSaveImage(Stream stream, string filename)
        {
            using (Image<Rgba32> image = Image.Load(stream))
            {
                if(image.Width > 1080 )
                {
                    image.Mutate(x => x.Resize(image.Width / 2, image.Height / 2));
                }
                image.Save(filename); // Automatic encoder selected based on extension.
            }
        }

        public async Task<ActionResult> EditProductUnitModal(int id, int defaultunitid)
        {
            GetProductUnitInput input = new GetProductUnitInput();
            input.Id = id;
            var output = await _productService.GetProductUnit(input);
            var getunits = await _unitService.GetUnits();

            var productunit = Mapper.Map<UpdateProductUnitInput>(output);
            //List<GetUnitOutput> units = getunits.Cast<GetUnitOutput>().ToList();

            var model = new ProductUnitEditModel
            {
                ProductUnit = productunit,
                //Units = units,
                DefaultUnitId = defaultunitid
            };
            return View("_EditProductUnitModal", model);
        }
    }
}