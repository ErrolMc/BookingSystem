using BookingSystem.API.Models;
using BookingSystem.API.Models.Subclasses;
using MongoDB.Driver;

namespace BookingSystem.API.Repositories
{
    public class PractitionerRepository
    {
        private readonly IMongoCollection<Practitioner> _practitionersCollection;

        public PractitionerRepository(IMongoDatabase database)
        {
            _practitionersCollection = database.GetCollection<Practitioner>("Practitioners");
        }

        public async Task<Practitioner?> GetByUsernameAsync(string username) =>
            await _practitionersCollection.Find(x => x.Username == username).FirstOrDefaultAsync();

        public async Task<Practitioner?> GetByEmailAsync(string email) =>
            await _practitionersCollection.Find(x => x.Email == email).FirstOrDefaultAsync();

        public async Task<Practitioner?> GetByIdAsync(string id) =>
            await _practitionersCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<bool> ExistsByEmailAsync(string email) =>
            await _practitionersCollection.Find(x => x.Email == email).AnyAsync();

        public async Task<bool> ExistsByUsernameAsync(string username) =>
            await _practitionersCollection.Find(x => x.Username == username).AnyAsync();

        public async Task<bool> ExistsByIdAsync(string id) =>
            await _practitionersCollection.Find(x => x.Id == id).AnyAsync();

        public async Task CreateAsync(Practitioner practitioner) =>
            await _practitionersCollection.InsertOneAsync(practitioner);

        public async Task UpdateAsync(string id, Practitioner practitioner) =>
            await _practitionersCollection.ReplaceOneAsync(x => x.Id == id, practitioner);

        public async Task DeleteAsync(string id) =>
            await _practitionersCollection.DeleteOneAsync(x => x.Id == id);

        public async Task UpdatePractitionerInfoByIdAsync(
            string id,
            List<PractitionerQualification>? qualifications,
            int? yearsOfExperience,
            string? bio,
            Availability? availability)
        {
            var updates = new List<UpdateDefinition<Practitioner>>();

            if (qualifications != null)
                updates.Add(Builders<Practitioner>.Update.Set(x => x.Qualifications, qualifications));

            if (yearsOfExperience.HasValue)
                updates.Add(Builders<Practitioner>.Update.Set(x => x.YearsOfExperience, yearsOfExperience.Value));

            if (bio != null)
                updates.Add(Builders<Practitioner>.Update.Set(x => x.Bio, bio));

            if (availability != null)
                updates.Add(Builders<Practitioner>.Update.Set(x => x.Availability, availability));

            if (updates.Count > 0)
            {
                var combinedUpdate = Builders<Practitioner>.Update.Combine(updates);
                await _practitionersCollection.UpdateOneAsync(x => x.Id == id, combinedUpdate);
            }
        }
    }
}
