using Microsoft.AspNetCore.Mvc;

namespace NetWebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class UploadController(IHttpClientFactory httpClientFactory) : ControllerBase
{
    private const string RelativePath = "Images/example.png";
    private const string Url = "http://localhost:3005/api/optimize";

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var httpClient = httpClientFactory.CreateClient();
        
        var imagePath = Path.Combine(Directory.GetCurrentDirectory(), RelativePath);
        
        var imageAsBytesArray = await System.IO.File.ReadAllBytesAsync(imagePath);

        using var formData = new MultipartFormDataContent();

        var content = new ByteArrayContent(imageAsBytesArray);
        
        formData.Add(content, "image");
        
        var response = await httpClient.PostAsync(Url, formData);
        
        response.EnsureSuccessStatusCode();

        var contentType = response.Content.Headers.ContentType;
        
        if (contentType?.MediaType != "image/webp")
        {
            return Problem($"Unexpected response content type: {contentType}");
        }
        
        return Ok();
    }
}