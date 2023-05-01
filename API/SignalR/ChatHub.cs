using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {

        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            // from the client side they will be able to invoke methods inside the Hub
            // clinet makes connection to hub and then is able to invoke methods thet we create
            var comment = await _mediator.Send(command); // here from the client we send properties that are inside create (ActivityId, body of the comment)

            // after this comment has been saved in our databes it will be shaped to CommentDto via autoMapper
            // then we send it to anyone who is connected to this hub, including the person, that made the comment.
            // in the Client. properties we can specify who will receive the comment
            await Clients.Group(command.ActivityId.ToString()) // each activity will have its own group, Id ia a Guid so we make them strings 
                .SendAsync("ReceiveComment", comment.Value);   // HERE we specify a name, we need to sue this name on the client side, 
                                                               //{comment.Value} comment is a result object that contains our CommentDto, so we gat its value
        }

        public override async Task OnConnectedAsync()
        {
            // we get activityId from a Query string, we can get it from http context
            var httpContext = Context.GetHttpContext();
            var activityId = httpContext.Request.Query["activityId"]; // inside [] we specify that we want to get the key of activityId
                                                                // we must set up the uery string from the client that contains activityId using "activityId" as the key
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId); // we add connected client to the group, activityId here is a group name
            // we don't need to do anything when we disconnect, SignalR removes connection Id from group automatically
            var result = await _mediator.Send(new List.Query{ActivityId = Guid.Parse(activityId)}); //activityId is a string so we parse it
            await Clients.Caller.SendAsync("LoadComments", result.Value); // we specify to wo do we send this result, we want the caller to receive it
                                                                          // "LoadComments" is a name
        }

    }
}