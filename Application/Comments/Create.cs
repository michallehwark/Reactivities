using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<Result<CommentDto>>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
        }

            public class Commandvalidator : AbstractValidator<Command>
            {
                public Commandvalidator() // we don't want to receive empty comments
                {
                    RuleFor(x => x.Body).NotEmpty();
                }
            }

            public class Handler : IRequestHandler<Command, Result<CommentDto>>
            {
                private readonly IUserAccessor _userAccessor;
                private readonly DataContext _context;
                private readonly IMapper _mapper;

                public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
                {
                    _mapper = mapper;
                    _context = context;
                    _userAccessor = userAccessor;
                }

                public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
                {
                    var activity = await _context.Activities.FindAsync(request.ActivityId);

                    if (activity == null) return null;

                    // Here we want to populate the image property inside comment
                    // so that's why I have new function var user
                    //var user = await _context.Users.Include(p => p.PhoneNumber).SingleOrDefaultAsync(x => x.UserName ==_userAccessor.GetUsername());
                    var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName ==_userAccessor.GetUsername());

                    var comment = new Comment
                    {
                        Author = user,
                        Activity = activity,
                        Body = request.Body
                    };

                    activity.Commetns.Add(comment);

                    var success = await _context.SaveChangesAsync() > 0;

                    if (success) return Result<CommentDto>.Success(_mapper.Map<CommentDto>(comment));

                    return Result<CommentDto>.Failure("Failed to add comment :( ");
                }
            }
    }
}