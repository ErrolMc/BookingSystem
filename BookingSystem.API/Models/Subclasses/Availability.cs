using MongoDB.Bson.Serialization.Attributes;

namespace BookingSystem.API.Models.Subclasses
{
    public class Availability
    {
        [BsonElement("timezone")]
        public string TimeZone { get; set; }

        [BsonElement("weeklyAvailability")]
        public List<WeeklyAvailability> WeeklyAvailability { get; set; }
    }

    public class WeeklyAvailability
    {
        [BsonElement("dayOfWeek")]
        public string DayOfWeek { get; set; }

        [BsonElement("timeSlots")]
        public List<TimeSlot> TimeSlots { get; set; }
    }

    public class TimeSlot
    {
        [BsonElement("startTime")]
        public string StartTime { get; set; }

        [BsonElement("endTime")]
        public string EndTime { get; set; }

        [BsonElement("practice")]
        public string Practice { get; set; } // this is so a practioner can work for multiple practices
    }
}
