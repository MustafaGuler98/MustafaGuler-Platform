using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MustafaGuler.Core.DTOs.Archives;
using MustafaGuler.Core.Utilities.Results;

namespace MustafaGuler.Core.Interfaces.Archives
{
    public interface IActivityService
    {
        Task EnsureDefaultActivitiesExistAsync();
        Task<Result<List<ActivityDto>>> GetAllActivitiesAsync();
        Task<Result<List<ActivityOptionDto>>> GetOptionsForTypeAsync(string activityType);
        Task<Result<bool>> UpdateActivityAsync(string activityType, Guid? selectedItemId);
        Task<Result> UpdateActivitiesAsync(List<UpdateActivityDto> items);
    }
}
