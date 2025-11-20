using BORTNIC.MVS.Models;
using Microsoft.AspNetCore.Mvc;

namespace BORTNIC.MVS.Controllers
{
    public class AccountController : Controller
    {
        // LOGIN (fetch)
        [HttpPost]
        public JsonResult LoginFetch(LoginModel model)
        {
            if (model.Email == "admin@mail.com" && model.Password == "123456")
            {
                return Json(new { success = true, message = "Вход выполнен!" });
            }

            return Json(new { success = false, message = "Неверный email или пароль" });
        }

        // REGISTER (fetch)
        [HttpPost]
        public JsonResult RegisterFetch(RegisterModel model)
        {
            if (model.Password != model.ConfirmPassword)
                return Json(new { success = false, message = "Пароли не совпадают" });

            return Json(new { success = true, message = "Регистрация успешна!" });
        }
    }
}
