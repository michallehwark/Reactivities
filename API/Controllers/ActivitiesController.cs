using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Activities;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [AllowAnonymous]
    public class ActivitiesController : BaseApiController
    {

        [HttpGet] // api/activities
        public async Task<IActionResult> GetActivities()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }
        
        [HttpGet("{id}")] // api/activities/1da523f (some (Guid)Id )
        public async Task<IActionResult> GetActivity(Guid id)
        {
            var result = await Mediator.Send(new Details.Query{Id = id});

            return HandleResult(result);
            //return await Mediator.Send(new Details.Query{Id = id}); // {}->objects initializer. brackets here mean only that Id gets set when we init this particual class.
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity([FromBody]Activity activity) //gives access to http response types (return not found, return ok etc.)
        {//[FromBody] additional (not necesarry) attribute to tell: look inside the body of the request, comapre the properties and if they match get the Activity
            return HandleResult(await Mediator.Send(new Create.Command {Activity = activity}));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{Activity = activity}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }
    }
}