using BookingSystem.API.Models.Subclasses;

namespace BookingSystem.API.Models.DTOs.RequestObjects
{
    public class UpdatePractitionerInfoRequest
    {
        public required string Id { get; set; }
        public List<PractitionerQualification>? Qualifications { get; set; }
        public int? YearsOfExperience { get; set; }
        public string? Bio { get; set; }
        public Availability? Availability { get; set; }
    }
}
