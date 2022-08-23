using AutoMapper;
using KalininHutor.API.DTO;
using KalininHutor.DAL.Booking;
using KalininHutor.Domain.Booking.Enums;
using MediatR;

namespace KalininHutor.API.Queries;

internal class GetRoomVariantBedTypesHandler : IRequestHandler<RoomVariantBedTypeCommands.GetQuery, IEnumerable<RoomVariantBedTypeDTO>>
{
    private readonly RoomVariantBedTypeRepository _repository;
    private readonly IMapper _mapper;

    public GetRoomVariantBedTypesHandler(RoomVariantBedTypeRepository repository, IMapper mapper)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<IEnumerable<RoomVariantBedTypeDTO>> Handle(RoomVariantBedTypeCommands.GetQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.Get(_mapper.Map<RoomVariantBedTypeSearchOptions>(request));
        return result.Select(_mapper.Map<RoomVariantBedTypeDTO>).ToList();
    }
}

///<summary> Запросы и очереди вариантов кроватей </summary>
public partial class RoomVariantBedTypeCommands
{
    ///<summary> Очередь получения вариантов кроватей в номере </summary>
    public class GetQuery : IRequest<IEnumerable<RoomVariantBedTypeDTO>>
    {
        ///<summary> Идентификатор варианта кровати </summary>
        public Guid? Id { get; set; }
        ///<summary> Идентификатор номера </summary>
        public Guid? RoomVariantId { get; set; }
    }

}