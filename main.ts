import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import data from "./data.json" assert { type: "json" };

const MAX_ITEMS = 5; 

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "test api";
  })
  .get("/api", (context) => {
    context.response.body = data;
  })
  //code for api/edit has been rewriten by chatgpt to fix errors 
  .post("/api/edit", async (context) => {
    const { name, points } = await context.request.body().value;
    const newItem = { name: String(name), score: String(points) };
    data.push(newItem);
    data.sort((a: { score: string }, b: { score: string }) => Number(b.score) - Number(a.score));
    if (data.length > MAX_ITEMS) {
      data.length = MAX_ITEMS;
    }
    Deno.writeTextFileSync('./data.json', JSON.stringify(data, null, 2), { append: false });


    context.response.body = { success: true, message: "Data updated successfully" };
  });

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
