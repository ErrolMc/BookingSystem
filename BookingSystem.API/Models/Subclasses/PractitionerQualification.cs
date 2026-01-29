using MongoDB.Bson.Serialization.Attributes;

namespace BookingSystem.API.Models.Subclasses
{
    public class PractitionerQualification
    {
        [BsonElement("degree")]
        public string Degree { get; set; }

        [BsonElement("institution")]
        public string Institution { get; set; }

        [BsonElement("yearOfCompletion")]
        public int YearOfCompletion { get; set; }
    }
}
