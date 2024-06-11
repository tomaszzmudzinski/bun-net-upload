There are two api applications

1) Web API written in .net 8 (c#) - we're trying to send request with image as a file in formdata to second application. Second app will convert and optimize the image and return webp in the response.

2) Http server written in bun - here we have one endpoint, it tries to get image file from formdata and convert it via sharp npm package. Then return result in the response if everything goes ok.

There are two scenarios:

1) If we send the image via Web Api written in .net 8 - it looks like bun has some problems with encrypting file (maybe it can't handle it's format)

2) If we send exactly the same image via Postman - it looks like bun works like a charm

