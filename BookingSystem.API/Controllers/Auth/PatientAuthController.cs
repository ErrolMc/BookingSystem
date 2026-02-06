using BookingSystem.API.Models;
using BookingSystem.API.Models.DTOs.RequestObjects;
using BookingSystem.API.Models.DTOs.ResponseObjects;
using BookingSystem.API.Repositories;
using BookingSystem.API.Source;
using Microsoft.AspNetCore.Mvc;

namespace BookingSystem.API.Controllers.Auth
{
    [ApiController]
    [Route("api/auth/patient")]
    public class PatientAuthController : ControllerBase
    {
        private readonly PatientRepository _patientRepository;

        public PatientAuthController(PatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var username = request.Username.ToLowerInvariant();
            var patient = await _patientRepository.GetByUsernameAsync(username);
            if (patient == null)
                return Unauthorized(new LoginResponse { Success = false, Message = "Invalid username or password" });

            if (!PasswordHelper.ValidatePassword(request.Password, patient.PasswordHash))
                return Unauthorized(new LoginResponse { Success = false, Message = "Invalid username or password" });

            return Ok(new LoginResponse { Success = true, Message = "Login successful" });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] PatientRegisterRequest request)
        {
            var username = request.Username.ToLowerInvariant();

            if (await _patientRepository.ExistsByEmailAsync(request.Email))
                return BadRequest(new RegisterResponse { Success = false, Message = "Email already registered" });

            if (await _patientRepository.ExistsByUsernameAsync(username))
                return BadRequest(new RegisterResponse { Success = false, Message = "Username already taken" });

            if (string.IsNullOrEmpty(request.PhoneNumber) ||
                string.IsNullOrEmpty(request.FirstName) ||
                string.IsNullOrEmpty(request.LastName))
                return BadRequest(new RegisterResponse { Success = false, Message = "Phone number, first name, and last name are required" });

            var patient = new Patient
            {
                Username = username,
                Email = request.Email,
                PasswordHash = PasswordHelper.HashPassword(request.Password),
                PhoneNumber = request.PhoneNumber,
                FirstName = request.FirstName,
                LastName = request.LastName
            };

            await _patientRepository.CreateAsync(patient);
            
            return Ok(new RegisterResponse { Success = true, Message = "Registration successful" });
        }
    }
}
