namespace KalininHutor.Domain;

public interface IIllustratedEntity
{
    public void CreatePhoto(string fileName, string extension, string body, uint sortOrder = 0);
}

public interface IEntityWithPhotos : IIllustratedEntity
{
    public IReadOnlyList<FileObject>? Photos { get; }
}

public interface IEntityWithAvatar: IIllustratedEntity
{
    public FileObject? Avatar { get; }
}