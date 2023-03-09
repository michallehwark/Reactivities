namespace API;

public class WeatherForecast
{
    public DateOnly Date { get; set; }

    public int TemperatureC { get; set; }

    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);

// question mark next to string'?' means taht its optional
    public string Summary { get; set; }
}
