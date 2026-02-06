namespace BookingSystem.API.Models.DTOs.ResponseObjects
{
    public class RegisterResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
