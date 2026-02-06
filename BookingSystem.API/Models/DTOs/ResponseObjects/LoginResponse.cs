namespace BookingSystem.API.Models.DTOs.ResponseObjects
{
    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
