using Microsoft.AspNetCore.Mvc;

namespace RepairService.Controllers
{
    public class AccountController : Controller
    {
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(string email, string password)
        {
            if (email == "admin@repair.md" && password == "12345")
                return RedirectToAction("Index", "Home");

            ViewBag.Message = "Неверные данные входа.";
            return View();
        }

        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Register(string name, string email, string password)
        {
            // имитация регистрации
            ViewBag.Message = $"Пользователь {name} успешно зарегистрирован!";
            return View();
        }
    }
}
