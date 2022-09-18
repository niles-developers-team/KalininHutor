using KalininHutor.Domain;

namespace KalininHutor.API.DTO;

public class FileObjectDTO
{
    public Guid Id { get; protected set; }
    public string Name { get; protected set; }
    public string Extension { get; protected set; }
    public byte[] Body { get; protected set; }
    public DateTime CreatedAt { get; protected set; }
    public bool Read { get; protected set; }
}