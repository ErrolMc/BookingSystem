using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BookingSystem.API.Models;

public class Book
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("title")]
    public required string Title { get; set; }

    [BsonElement("author")]
    public required string Author { get; set; }

    [BsonElement("year")]
    public int Year { get; set; }

    [BsonElement("isbn")]
    public string? Isbn { get; set; }
}
