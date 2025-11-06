using Microsoft.AspNetCore.Mvc;
using RepairService.Models;
using System.Collections.Generic;

namespace RepairService.Controllers
{
    public class HomeController : Controller
    {
        // ⚙️ Временный список сообщений (имитация базы данных)
        private static List<MessageModel> messages = new List<MessageModel>();

        public IActionResult Index()
        {
            return View(messages);
        }

        // ✅ Получение всех сообщений
        [HttpGet]
        public JsonResult GetMessages()
        {
            return Json(messages);
        }

        // ✅ Добавление нового сообщения
        [HttpPost]
        public JsonResult AddMessage([FromBody] MessageModel msg)
        {
            if (string.IsNullOrWhiteSpace(msg.MessageText))
            {
                return Json(new { success = false, message = "Сообщение не может быть пустым." });
            }

            messages.Add(msg);
            return Json(new { success = true, message = "Сообщение добавлено!" });
        }
    }
}
