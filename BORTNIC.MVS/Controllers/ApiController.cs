using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using YourProjectName.Models; // Замените на ваше пространство имен

namespace YourProjectName.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailService _emailService;

        public ApiController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IEmailService emailService)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _emailService = emailService;
        }

        // GET: api/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                var stats = new
                {
                    happyCustomers = await _context.Orders.CountAsync(o => o.Status == OrderStatus.Completed),
                    successRate = 99, // Можно вычислять из данных
                    completedRepairs = await _context.Repairs.CountAsync(r => r.Status == RepairStatus.Completed),
                    responseTime = 15 // Среднее время ответа в минутах
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        // POST: api/contact
        [HttpPost("contact")]
        public async Task<IActionResult> Contact([FromBody] ContactRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = "Invalid data" });
            }

            try
            {
                // Сохраняем в базу данных
                var contactMessage = new ContactMessage
                {
                    Name = request.Name,
                    Phone = request.Phone,
                    Subject = request.Subject,
                    Message = request.Message,
                    CreatedAt = DateTime.UtcNow
                };

                _context.ContactMessages.Add(contactMessage);
                await _context.SaveChangesAsync();

                // Можно отправить email уведомление
                await _emailService.SendContactNotification(contactMessage);

                return Ok(new { success = true, message = "Message sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to send message" });
            }
        }

        // POST: api/auth/login
        [HttpPost("auth/login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Логика аутентификации
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, request.Password))
            {
                await _signInManager.SignInAsync(user, request.Remember);

                return Ok(new
                {
                    success = true,
                    user = new
                    {
                        id = user.Id,
                        name = user.Name,
                        email = user.Email
                    }
                });
            }

            return Unauthorized(new { error = "Invalid credentials" });
        }

        // POST: api/auth/register
        [HttpPost("auth/register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = "Invalid data" });
            }

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                Name = request.Name,
                PhoneNumber = request.Phone
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, isPersistent: false);
                return Ok(new
                {
                    success = true,
                    user = new
                    {
                        id = user.Id,
                        name = user.Name,
                        email = user.Email
                    }
                });
            }

            return BadRequest(new { error = string.Join(", ", result.Errors.Select(e => e.Description)) });
        }

        // POST: api/auth/logout
        [HttpPost("auth/logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { success = true });
        }

        // GET: api/auth/check
        [HttpGet("auth/check")]
        public IActionResult CheckAuth()
        {
            if (User.Identity.IsAuthenticated)
            {
                return Ok(new
                {
                    isAuthenticated = true,
                    user = new
                    {
                        name = User.Identity.Name
                    }
                });
            }

            return Ok(new { isAuthenticated = false });
        }
    }
}