using BookingSystem.API.Models;
using BookingSystem.API.Models.DTOs.RequestObjects;
using BookingSystem.API.Models.DTOs.ResponseObjects;
using BookingSystem.API.Repositories;
using BookingSystem.API.Source;
using Microsoft.AspNetCore.Mvc;

namespace BookingSystem.API.Controllers.Auth
{
    [ApiController]
    [Route("api/auth/practitioner")]
    public class PractitionerAuthController : ControllerBase
    {
        private readonly PractitionerRepository _practitionerRepository;

        public PractitionerAuthController(PractitionerRepository practitionerRepository)
        {
            _practitionerRepository = practitionerRepository;
        }

        [HttpPost("login")]
        [ProducesResponseType<LoginResponse>(StatusCodes.Status200OK)]
        [ProducesResponseType<LoginResponse>(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var username = request.Username.ToLowerInvariant();
            var practitioner = await _practitionerRepository.GetByUsernameAsync(username);
            if (practitioner == null)
                return Unauthorized(new LoginResponse { Success = false, Message = "Invalid username or password" });

            if (!PasswordHelper.ValidatePassword(request.Password, practitioner.PasswordHash))
                return Unauthorized(new LoginResponse { Success = false, Message = "Invalid username or password" });

            return Ok(new LoginResponse { Success = true, Message = "Login successful", UserId = practitioner.Id });
        }

        [HttpPost("register")]
        [ProducesResponseType<RegisterResponse>(StatusCodes.Status200OK)]
        [ProducesResponseType<RegisterResponse>(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] PractitionerRegisterRequest request)
        {
            var username = request.Username.ToLowerInvariant();

            if (await _practitionerRepository.ExistsByEmailAsync(request.Email))
                return BadRequest(new RegisterResponse { Success = false, Message = "Email already registered" });

            if (await _practitionerRepository.ExistsByUsernameAsync(username))
                return BadRequest(new RegisterResponse { Success = false, Message = "Username already taken" });

            if (string.IsNullOrEmpty(request.PhoneNumber) ||
                string.IsNullOrEmpty(request.FirstName) ||
                string.IsNullOrEmpty(request.LastName))
                return BadRequest(new RegisterResponse { Success = false, Message = "Phone number, first name, and last name are required" });

            var practitioner = new Practitioner
            {
                Username = username,
                Email = request.Email,
                PasswordHash = PasswordHelper.HashPassword(request.Password),
                PhoneNumber = request.PhoneNumber,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Specialization = request.Specialization ?? string.Empty,
                Practice = request.Practice ?? string.Empty,
            };

            await _practitionerRepository.CreateAsync(practitioner);
            
            return Ok(new RegisterResponse { Success = true, Message = "Registration successful", UserId = practitioner.Id });
        }
    }
}
