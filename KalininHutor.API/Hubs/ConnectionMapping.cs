namespace KalininHutor.API.Hubs;

public class ConnectionMapping<T>
{
    private readonly Dictionary<T, HashSet<string>> _connections =
        new Dictionary<T, HashSet<string>>();

    public int Count
    {
        get
        {
            lock (_connections) return _connections.Count;
        }
    }

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

    public IEnumerable<string> GetConnections(T key)
    {
        lock (_connections)
            return _connections.TryGetValue(key, out var connections) ? connections : Enumerable.Empty<string>();
    }

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

    public T[] GetKeys()
    {
        lock (_connections)
            return _connections.Keys.ToArray();
    }
}