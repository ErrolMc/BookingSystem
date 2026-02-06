namespace BookingSystem.API.Models.DTOs.RequestObjects
{
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
