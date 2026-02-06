using BookingSystem.API.Models;
using MongoDB.Driver;

namespace BookingSystem.API.Repositories
{
    public class PatientRepository
    {
        private readonly IMongoCollection<Patient> _patientsCollection;

        public PatientRepository(IMongoDatabase database)
        {
            _patientsCollection = database.GetCollection<Patient>("Patients");
        }

        public async Task<Patient?> GetByUsernameAsync(string username) =>
            await _patientsCollection.Find(x => x.Username == username).FirstOrDefaultAsync();

        public async Task<Patient?> GetByEmailAsync(string email) =>
            await _patientsCollection.Find(x => x.Email == email).FirstOrDefaultAsync();

        public async Task<Patient?> GetByIdAsync(string id) =>
            await _patientsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<bool> ExistsByEmailAsync(string email) =>
            await _patientsCollection.Find(x => x.Email == email).AnyAsync();

        public async Task<bool> ExistsByUsernameAsync(string username) =>
            await _patientsCollection.Find(x => x.Username == username).AnyAsync();

        public async Task CreateAsync(Patient patient) =>
            await _patientsCollection.InsertOneAsync(patient);

        public async Task UpdateAsync(string id, Patient patient) =>
            await _patientsCollection.ReplaceOneAsync(x => x.Id == id, patient);

        public async Task DeleteAsync(string id) =>
            await _patientsCollection.DeleteOneAsync(x => x.Id == id);
    }
}
