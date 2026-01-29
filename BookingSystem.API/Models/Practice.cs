using BookingSystem.API.Models.Subclasses;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BookingSystem.API.Models
{
    public class Practice
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("name")]
        public required string Name { get; set; }

        [BsonElement("address")]
        public required string Address { get; set; }

        [BsonElement("headAdmin")]
        public required string HeadAdmin { get; set; }

        [BsonElement("phoneNumber")]
        public required string PhoneNumber { get; set; }

        [BsonElement("email")]
        public required string Email { get; set; }

        [BsonElement("website")]
        public string Website { get; set; }

        [BsonElement("openingHours")]
        public Availability OpeningHours { get; set; } // dont need the practice field here in the TimeSlots

        [BsonElement("practitioners")]
        public List<string> Practitioners { get; set; }

        [BsonElement("servicesOffered")]
        public List<string> ServicesOffered { get; set; }

        [BsonElement("description")]
        public string Description { get; set; }
    }
}
