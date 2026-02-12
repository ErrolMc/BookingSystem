using BookingSystem.API.Models.DTOs.RequestObjects;
using BookingSystem.API.Models.DTOs.ResponseObjects;
using BookingSystem.API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BookingSystem.API.Controllers
{
    [ApiController]
    [Route("api/practitioner")]
    public class PractitionerInfoController : ControllerBase
    {
        private readonly PractitionerRepository _practitionerRepository;

        public PractitionerInfoController(PractitionerRepository practitionerRepository)
        {
            _practitionerRepository = practitionerRepository;
        }

        [HttpPut("info")]
        [ProducesResponseType<UpdateResponse>(StatusCodes.Status200OK)]
        [ProducesResponseType<UpdateResponse>(StatusCodes.Status400BadRequest)]
        [ProducesResponseType<UpdateResponse>(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateInfo([FromBody] UpdatePractitionerInfoRequest request)
        {
            if (!await _practitionerRepository.ExistsByIdAsync(request.Id))
                return NotFound(new UpdateResponse { Success = false, Message = "Practitioner not found" });

            if (request.YearsOfExperience.HasValue && request.YearsOfExperience.Value < 0)
                return BadRequest(new UpdateResponse { Success = false, Message = "Years of experience cannot be negative" });

            await _practitionerRepository.UpdatePractitionerInfoByIdAsync(
                request.Id,
                request.Qualifications,
                request.YearsOfExperience,
                request.Bio,
                request.Availability);
            
            return Ok(new UpdateResponse { Success = true, Message = "Practitioner info updated successfully" });
        }

        [HttpGet("{id}")]
        [ProducesResponseType<PractitionerInfoResponse>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPractitioner(string id)
        {
            var practitioner = await _practitionerRepository.GetByIdAsync(id);
            
            if (practitioner == null)
                return NotFound(new { message = "Practitioner not found" });

            return Ok(new PractitionerInfoResponse
            {
                Username = practitioner.Username,
                Email = practitioner.Email,
                FirstName = practitioner.FirstName,
                LastName = practitioner.LastName,
                Specialization = practitioner.Specialization,
                Practice = practitioner.Practice,
                Qualifications = practitioner.Qualifications,
                YearsOfExperience = practitioner.YearsOfExperience,
                Bio = practitioner.Bio,
                Availability = practitioner.Availability
            });
        }
    }
}
