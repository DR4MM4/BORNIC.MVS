using BORTNIC.MVS.Models;
using Microsoft.AspNetCore.Mvc;

namespace BORTNIC.MVS.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SendMessage(MessageModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Name) ||
                string.IsNullOrWhiteSpace(model.Phone))
            {
                return Json(new { success = false, message = "Заполните обязательные поля" });
            }

            // Тут можешь добавить email / БД
            return Json(new { success = true, message = "Сообщение успешно отправлено!" });
        }
    }
}
