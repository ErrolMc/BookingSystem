using BookingSystem.API.Models;
using BookingSystem.API.Models.DTOs.RequestObjects;
using BookingSystem.API.Models.DTOs.ResponseObjects;
using BookingSystem.API.Repositories;
using BookingSystem.API.Source;
using Microsoft.AspNetCore.Mvc;

namespace BookingSystem.API.Controllers.Auth
{
    [ApiController]
    [Route("api/auth/admin")]
    public class AdminAuthController : ControllerBase
    {
        private readonly AdministratorRepository _administratorRepository;

        public AdminAuthController(AdministratorRepository administratorRepository)
        {
            _administratorRepository = administratorRepository;
        }

        [HttpPost("login")]
        [ProducesResponseType<LoginResponse>(StatusCodes.Status200OK)]
        [ProducesResponseType<LoginResponse>(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var username = request.Username.ToLowerInvariant();
            var admin = await _administratorRepository.GetByUsernameAsync(username);
            if (admin == null)
                return Unauthorized(new LoginResponse { Success = false, Message = "Invalid username or password" });

            if (!PasswordHelper.ValidatePassword(request.Password, admin.PasswordHash))
                return Unauthorized(new LoginResponse { Success = false, Message = "Invalid username or password" });

            return Ok(new LoginResponse { Success = true, Message = "Login successful", UserId = admin.Id });
        }

        [HttpPost("register")]
        [ProducesResponseType<RegisterResponse>(StatusCodes.Status200OK)]
        [ProducesResponseType<RegisterResponse>(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] AdminRegisterRequest request)
        {
            var username = request.Username.ToLowerInvariant();

            if (await _administratorRepository.ExistsByEmailAsync(request.Email))
                return BadRequest(new RegisterResponse { Success = false, Message = "Email already registered" });

            if (await _administratorRepository.ExistsByUsernameAsync(username))
                return BadRequest(new RegisterResponse { Success = false, Message = "Username already taken" });

            var admin = new Administrator
            {
                Username = username,
                Email = request.Email,
                PasswordHash = PasswordHelper.HashPassword(request.Password),
                Practices = new List<string>()
            };

            await _administratorRepository.CreateAsync(admin);
            
            return Ok(new RegisterResponse { Success = true, Message = "Registration successful", UserId = admin.Id });
        }
    }
}
