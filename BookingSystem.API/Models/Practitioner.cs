using BookingSystem.API.Models.Subclasses;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BookingSystem.API.Models
{
    public class Practitioner
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("username")]
        public required string Username { get; set; }

        [BsonElement("email")]
        public required string Email { get; set; }

        [BsonElement("phoneNumber")]
        public required string PhoneNumber { get; set; }

        [BsonElement("firstName")]
        public required string FirstName { get; set; }

        [BsonElement("lastName")]
        public required string LastName { get; set; }

        [BsonElement("passwordHash")]
        public required string PasswordHash { get; set; }

        [BsonElement("specialization")]
        public string Specialization { get; set; } = string.Empty;

        [BsonElement("practice")]
        public string Practice { get; set; } = string.Empty;

        [BsonElement("qualifications")]
        public List<PractitionerQualification> Qualifications { get; set; } = new List<PractitionerQualification>();

        [BsonElement("yearsOfExperience")]
        public int YearsOfExperience { get; set; } = 0;

        [BsonElement("bio")]
        public string Bio { get; set; } = string.Empty;

        [BsonElement("availability")]
        public Availability Availability { get; set; } = new Availability();
    }
}
