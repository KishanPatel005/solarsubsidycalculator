const baseUrl = process.env.BASE_URL || "http://localhost:3020";
const pages = ["/calculator", "/solar-rooftop-price-list"];

const jsonLdRe = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;

for (const page of pages) {
  const res = await fetch(`${baseUrl}${page}`);
  const html = await res.text();
  const matches = [...html.matchAll(jsonLdRe)];

  console.log(`${page} status=${res.status} scripts=${matches.length}`);

  matches.forEach((m, i) => {
    const body = m[1].trim();
    try {
      JSON.parse(body);
      console.log(`  ok[${i}] bytes=${body.length}`);
    } catch (e) {
      console.log(`  bad[${i}] ${e?.message || e}`);
      console.log(body.slice(0, 220));
    }
  });
}

