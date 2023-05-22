using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {
        Task<PhotoUploadResult> AddPhoto(IFormFile file); // this method only work with cloudinary and not database
        Task<string> DeletePhoto(string PublicId); // this method only work with cloudinary and not database
    }
}