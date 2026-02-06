using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BookingSystem.API.Models
{
    public class Administrator
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("username")]
        public required string Username { get; set; }

        [BsonElement("email")]
        public required string Email { get; set; }

        [BsonElement("passwordHash")]
        public required string PasswordHash { get; set; }

        [BsonElement("practices")]
        public List<string> Practices { get; set; } = new List<string>();
    }
}
