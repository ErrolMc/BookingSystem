using BookingSystem.API.Models;
using MongoDB.Driver;

namespace BookingSystem.API.Repositories
{
    public class AdministratorRepository
    {
        private readonly IMongoCollection<Administrator> _administratorsCollection;

        public AdministratorRepository(IMongoDatabase database)
        {
            _administratorsCollection = database.GetCollection<Administrator>("Administrators");
        }

        public async Task<Administrator> GetByEmailAsync(string email) =>
            await _administratorsCollection.Find(x => x.Email == email).FirstOrDefaultAsync();

        public async Task<Administrator> GetByIdAsync(string id) =>
            await _administratorsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<bool> ExistsByEmailAsync(string email) =>
            await _administratorsCollection.Find(x => x.Email == email).AnyAsync();

        public async Task CreateAsync(Administrator administrator) =>
            await _administratorsCollection.InsertOneAsync(administrator);

        public async Task UpdateAsync(string id, Administrator administrator) =>
            await _administratorsCollection.ReplaceOneAsync(x => x.Id == id, administrator);

        public async Task DeleteAsync(string id) =>
            await _administratorsCollection.DeleteOneAsync(x => x.Id == id);

        public async Task<Administrator> GetByUsernameAsync(string username) =>
            await _administratorsCollection.Find(x => x.Username == username).FirstOrDefaultAsync();

        public async Task<bool> ExistsByUsernameAsync(string username) =>
            await _administratorsCollection.Find(x => x.Username == username).AnyAsync();
    }
}
