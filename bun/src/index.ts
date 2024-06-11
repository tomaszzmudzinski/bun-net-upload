import sharp from "sharp";

const port = 3005;

const server = Bun.serve({
  port: port,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/api/optimize") {
      try {
        const formData = await req.formData();

        const imageFile = formData.get("image");

        // very strange chars are displayed in the console if we send data from .net 8 web api
        // it looks very different if we send the data from the postman
        
        // example console log result from .net 8 (a lot of chars like)- v��IDAT������������������������������������)v�a���IEND�B`�
        
        // example console log result from postman - 
        // imageFile Blob (3.16 MB) {
        //   type: "image/png"
        // }
        console.log('imageFile', imageFile); 

        if (imageFile == null || imageFile == undefined) {
          console.log('image file not exist');
          return new Response("image file not exist")
        }
  
        const blob = new Blob([imageFile]);

        // blob has some weight in each scenario - around 5 MB
        console.log('blob', blob);

        const arrayBuffer = await blob.arrayBuffer();

        let imageBuffer = await sharp(arrayBuffer)
          .rotate()
          .resize({ width: 1920, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        let response = new Response(imageBuffer);
  
        response.headers.set("Content-Type", "image/webp");
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS"
        );
  
        return response;
      }
      catch (e: any) {
        return new Response(e.message);
      }
    }

    return new Response("Bun server is running!");
  },
});

console.log(`Listening on http://localhost:${port}`);
