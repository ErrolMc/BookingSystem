using BookingSystem.API.Models.Subclasses;

namespace BookingSystem.API.Models.DTOs.ResponseObjects
{
    public class PractitionerInfoResponse
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string Practice { get; set; } = string.Empty;
        public List<PractitionerQualification> Qualifications { get; set; } = new();
        public int YearsOfExperience { get; set; }
        public string Bio { get; set; } = string.Empty;
        public Availability Availability { get; set; } = new();
    }
}
