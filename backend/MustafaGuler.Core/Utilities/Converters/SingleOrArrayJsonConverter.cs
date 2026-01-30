using System.Text.Json;
using System.Text.Json.Serialization;

namespace MustafaGuler.Core.Utilities.Converters
{
    public class SingleOrArrayJsonConverter<T> : JsonConverter<List<T>>
    {
        public override List<T> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            // Handles Inconsistent API behavior where a property can be returned as either a single object OR an array.

            // If it's the start of an array
            if (reader.TokenType == JsonTokenType.StartArray)
            {
                return JsonSerializer.Deserialize<List<T>>(ref reader, options) ?? new List<T>();
            }

            // If it's start of an object
            if (reader.TokenType == JsonTokenType.StartObject)
            {
                var item = JsonSerializer.Deserialize<T>(ref reader, options);
                return item != null ? new List<T> { item } : new List<T>();
            }

            // Handle null
            return new List<T>();
        }

        public override void Write(Utf8JsonWriter writer, List<T> value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize(writer, value, options);
        }
    }
}
