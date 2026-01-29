using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BookingSystem.API.Models
{
    public class Appointment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("patientID")]
        public required string PatientID { get; set; }

        [BsonElement("practitionerID")]
        public required string PractitionerID { get; set; }

        [BsonElement("practiceID")]
        public required string PracticeID { get; set; }

        [BsonElement("appointmentDateTime")]
        public required DateTime AppointmentDateTime { get; set; }

        [BsonElement("durationInMinutes")]
        public required int DurationInMinutes { get; set; }

        [BsonElement("reasonForVisit")]
        public string ReasonForVisit { get; set; }
    }
}
