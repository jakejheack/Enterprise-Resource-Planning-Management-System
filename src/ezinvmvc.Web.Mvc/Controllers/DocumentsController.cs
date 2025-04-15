using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Abp.UI;
using AutoMapper;
using ezinvmvc.App.Common;
using ezinvmvc.App.Common.Dto;
using ezinvmvc.Controllers;
using ezinvmvc.Web.Models.Documents;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace ezinvmvc.Web.Mvc.Controllers
{
    public class DocumentsController : ezinvmvcControllerBase
    {
        private readonly IDocumentService _documentService;

        public DocumentsController(IDocumentService documentService)
        {
            _documentService = documentService;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> DocumentModal(int refid, string refname, string reference)
        {
            var doc = new GetDocumentOutput();
            doc.Reference = reference;
            doc.ReferenceId = refid;
            doc.ReferenceName = refname;
            var model = new DocumentModel
            {
                Document = doc
            };
            return View("_DocumentsModal", model);
        }

        [HttpPost]
        //[RequestFormLimits(MultipartBodyLengthLimit = 909715200)]
        public async Task<IActionResult> UploadFile(IFormFile file, string reference, string referenceid)
        {
            var serverpath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", reference, referenceid);
            var fullpath = Path.Combine(serverpath);

            if (!Directory.Exists(serverpath))
            {
                Directory.CreateDirectory(serverpath);
            }

            int ctr = 0;
            string suffix = "";
            string newname = Path.GetFileNameWithoutExtension(file.FileName) + suffix + Path.GetExtension(file.FileName);

            while (System.IO.File.Exists(Path.Combine(fullpath, newname)))
            {
                ctr++;
                if (ctr > 0)
                {
                    suffix = " (" + ctr + ")";
                }
                newname = Path.GetFileNameWithoutExtension(file.FileName) + suffix + Path.GetExtension(file.FileName);
            }

            //foreach (var formFile in file)
            //{
            var filePath = Path.Combine(serverpath, newname);
                if (file.Length > 0)
                {
                    using (var stream = System.IO.File.Create(filePath))
                    {
                        await file.CopyToAsync(stream);
                    }
                }
            //}
            return new JsonResult(new { fileName = newname, fileExtension = Path.GetExtension(file.FileName), filePath = serverpath });
        }

        private string GetMimeType(string fileName)
        {
            var provider = new FileExtensionContentTypeProvider();
            string contentType;
            if (!provider.TryGetContentType(fileName, out contentType))
            {
                contentType = "application/octet-stream";
            }
            return contentType;
        }

        //public ActionResult PostReportPartial(int id)
        //{

        //    // Validate the Model is correct and contains valid data
        //    // Generate your report output based on the model parameters
        //    // This can be an Excel, PDF, Word file - whatever you need.

        //    // As an example lets assume we've generated an EPPlus ExcelPackage

        //    ExcelPackage workbook = new ExcelPackage();
        //    // Do something to populate your workbook

        //    // Generate a new unique identifier against which the file can be stored
        //    string handle = Guid.NewGuid().ToString();

        //    using (MemoryStream memoryStream = new MemoryStream())
        //    {
        //        workbook.SaveAs(memoryStream);
        //        memoryStream.Position = 0;
        //        TempData[handle] = memoryStream.ToArray();
        //    }

        //    // Note we are returning a filename as well as the handle
        //    return new JsonResult()
        //    {
        //        Data = new { FileGuid = handle, FileName = "TestReportOutput.xlsx" }
        //    };

        //}
        
        public async Task<ActionResult> DownloadFile(int id)
        {
            var docinput = new GetDocumentInput();
            docinput.Id = id;
            var getdoc = await _documentService.GetDocument(docinput);

            var docu = Mapper.Map<GetDocumentOutput>(getdoc);
            string path = docu.FilePath;
            string name = docu.FileName;
            string extension = docu.FileExtension;
            string filePath = Path.Combine(path, name);
            if (!System.IO.File.Exists(filePath))
            {
                throw new UserFriendlyException(L("RequestedFileDoesNotExists"));
            }

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, GetMimeType(filePath), name);
        }
    }
}