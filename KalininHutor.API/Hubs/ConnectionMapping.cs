namespace KalininHutor.API.Hubs;

///<summary> Коллекция подключений </summary>
public class ConnectionMapping<T> where T : notnull
{
    private readonly Dictionary<T, HashSet<string>> _connections =
        new Dictionary<T, HashSet<string>>();

    ///<summary> Количество подключений </summary>
    public int Count
    {
        get
        {
            lock (_connections) return _connections.Count;
        }
    }

    ///<summary> Добавить подключение </summary>
    public void Add(T key, string connectionId)
    {
        lock (_connections)
        {
            if (!_connections.TryGetValue(key, out var connections))
            {
                connections = new HashSet<string>();
                _connections.Add(key, connections);
            }

            lock (connections) connections.Add(connectionId);
        }
    }

    ///<summary> Получить подключения </summary>
    public IEnumerable<string> GetConnections(T key)
    {
        lock (_connections)
            return _connections.TryGetValue(key, out var connections) ? connections : Enumerable.Empty<string>();
    }

    ///<summary> Удалить подключение </summary>
    public void Remove(string connectionId)
    {
        lock (_connections)
            foreach (var pair in _connections.ToList())
            {
                var connections = pair.Value;
                lock (connections)
                    if (!connections.Remove(connectionId)) continue;
                if (connections.Count == 0) _connections.Remove(pair.Key);
                break;
            }
    }

    ///<summary> Удалить подключение </summary>
    public void Remove(T key, string connectionId)
    {
        lock (_connections)
        {
            if (!_connections.TryGetValue(key, out var connections)) return;

            lock (connections)
            {
                connections.Remove(connectionId);

                if (connections.Count == 0) _connections.Remove(key);
            }
        }
    }

    ///<summary> Получить ключи </summary>
    public T[] GetKeys()
    {
        lock (_connections)
            return _connections.Keys.ToArray();
    }
}