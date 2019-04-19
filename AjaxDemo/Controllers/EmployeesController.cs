using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AjaxDemo.Data;
using AjaxDemo.Data.Repository;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace AjaxDemo.Controllers
{
    public class EmployeesController : Controller
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeesController(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult LoadData(string name, string status, int page, int pageSize)
        {
            int totalRow = 0;
            var employees = _employeeRepository.GetAll();

            if (!string.IsNullOrEmpty(name))
            {
                employees = employees.Where(e => e.Name.Contains(name));
            }

            if (!string.IsNullOrEmpty(status))
            {
                employees = employees.Where(e => e.Status == bool.Parse(status));
            }

            totalRow = employees.Count();

            employees = employees.OrderByDescending(e => e.CreatedDate).Skip((page - 1) * pageSize).Take(pageSize);
            return Json(new
            {
                status = true,
                total = totalRow,
                data = employees
            });
        }

        [HttpPost]
        public IActionResult SaveData(string strEmployee)
        {

            Employee employee = JsonConvert.DeserializeObject<Employee>(strEmployee);

            bool status = false;
            string message = string.Empty;

            //add new employee if id = 0
            if (employee.Id == 0)
            {
                employee.CreatedDate = DateTime.Now;
                try
                {
                    _employeeRepository.Create(employee);
                    status = true;
                }
                catch (Exception ex)
                {
                    status = false;
                    message = ex.Message;
                }
            }
            else
            {
                //update existing DB
                //save db
                try
                {
                    _employeeRepository.Update(employee);
                    status = true;
                }
                catch (Exception ex)
                {
                    status = false;
                    message = ex.Message;
                }

            }

            return Json(new
            {
                status = status,
                message = message
            });
        }
    }
}