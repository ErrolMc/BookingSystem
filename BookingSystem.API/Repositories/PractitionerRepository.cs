using BookingSystem.API.Models;
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

        public async Task CreateAsync(Practitioner practitioner) =>
            await _practitionersCollection.InsertOneAsync(practitioner);

        public async Task UpdateAsync(string id, Practitioner practitioner) =>
            await _practitionersCollection.ReplaceOneAsync(x => x.Id == id, practitioner);

        public async Task DeleteAsync(string id) =>
            await _practitionersCollection.DeleteOneAsync(x => x.Id == id);
    }
}
