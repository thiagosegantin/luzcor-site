// Gera duas versões:
//  - dist/index.html: página inicial em arquivo único (prévia publicada como artefato)
//  - docs/: o site para o domínio, com páginas internas e arquivos separados (melhor cache e velocidade)
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { FAQ, PRODUCTS, CITIES, ADDRESS, SITE, INSTAGRAM, PINTEREST, PHONE_TEL, MAPS } from './src/data.js';

const req = createRequire(import.meta.url);
const nodePaths = ['/opt/npm-tools/node_modules'];
const define = { 'process.env.NODE_ENV': '"production"' };
const DATAURL = { '.jpg': 'dataurl', '.png': 'dataurl', '.woff': 'dataurl', '.jsx': 'jsx' };
const FILE = { '.jpg': 'file', '.png': 'file', '.woff': 'file', '.jsx': 'jsx' };

rmSync('dist', { recursive: true, force: true });
rmSync('docs', { recursive: true, force: true });
mkdirSync('docs/assets', { recursive: true });

const outName = (meta, ext, dir) => Object.keys(meta.outputs).find((k) => k.endsWith(ext) && k.startsWith(dir) && !k.endsWith('.map'));

async function ssr(loader, publicPath, tag) {
  await build({
    entryPoints: ['src/ssr.jsx'], bundle: true, platform: 'node', format: 'cjs', outdir: 'dist/tmp-' + tag,
    jsx: 'automatic', loader: { ...loader, '.css': 'empty' }, nodePaths, define, assetNames: '[name]-[hash]', publicPath,
  });
  const p = req.resolve('./dist/tmp-' + tag + '/ssr.js');
  delete req.cache[p];
  return req(p);
}

/* ---------------- textos e dados estruturados ---------------- */
const title = 'Luzcor | Loja de iluminação e material elétrico em Telêmaco Borba';
const desc = 'Luminárias, material elétrico e peças sob medida em Telêmaco Borba, com consultoria para arquitetos de Ponta Grossa e dos Campos Gerais.';
const STORE_ID = SITE + '#loja';
const LOGO = SITE + 'logo-luzcor.png', PHOTO = SITE + 'fachada-luzcor.jpg';

const storeLd = {
  '@type': ['Store', 'HomeGoodsStore', 'HardwareStore'],
  '@id': STORE_ID,
  name: 'Luzcor Iluminação',
  alternateName: ['LuzCor Iluminação', 'Luzcor'],
  description: 'Loja de iluminação e material elétrico em Telêmaco Borba (PR), com ateliê de luminárias sob medida e consultoria de iluminação para arquitetos de Ponta Grossa e dos Campos Gerais.',
  slogan: 'Luz que inspira',
  url: SITE, logo: LOGO, image: [PHOTO], telephone: PHONE_TEL, hasMap: MAPS,
  geo: { '@type': 'GeoCoordinates', latitude: -24.3299682, longitude: -50.6241206 },
  address: { '@type': 'PostalAddress', streetAddress: ADDRESS.street, addressLocality: ADDRESS.city, addressRegion: ADDRESS.uf, postalCode: ADDRESS.cep, addressCountry: 'BR' },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '13:00' },
  ],
  areaServed: [...CITIES.map((c) => ({ '@type': 'City', name: c.n + ', PR' })), { '@type': 'AdministrativeArea', name: 'Campos Gerais, Paraná' }],
  sameAs: [INSTAGRAM, PINTEREST, 'https://www.tiktok.com/@luzcor50', 'https://www.google.com/maps/place/?q=place_id:ChIJFfarNg2D6ZQRhCiCjMN6bbM'],
  knowsAbout: ['iluminação residencial e comercial', 'material elétrico', 'luminárias sob medida', 'perfis de LED', 'projeto luminotécnico', 'temperatura de cor', 'iluminação para arquitetos', 'iluminação de alto padrão'],
  employee: { '@type': 'Person', name: 'Thiago Segantin', jobTitle: 'Especialista em projetos luminotécnicos', worksFor: { '@id': STORE_ID } },
  hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Iluminação e material elétrico', itemListElement: PRODUCTS.map((p) => ({ '@type': 'OfferCatalog', name: p.name, description: p.text })) },
};

const head = ({ t, d, url, ld, css, extra = '' }) => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t}</title>
<meta name="description" content="${d}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#3c1309">
<meta name="geo.region" content="BR-PR">
<meta name="geo.placename" content="Telêmaco Borba">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Luzcor Iluminação">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${PHOTO}">
<meta property="og:image:width" content="1500">
<meta property="og:image:height" content="750">
<meta name="twitter:card" content="summary_large_image">
${extra}
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
${css}
<script async src="https://www.googletagmanager.com/gtag/js?id=G-K1ESEMBD6X"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-K1ESEMBD6X');document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href*="wa.me"]');if(a){gtag('event','whatsapp_click',{link_url:a.href,page_path:location.pathname});}var t=e.target.closest&&e.target.closest('a[href^="tel:"]');if(t){gtag('event','phone_click',{page_path:location.pathname});}},true);</script>
</head>`;

const homeLd = {
  '@context': 'https://schema.org',
  '@graph': [
    storeLd,
    { '@type': 'WebSite', '@id': SITE + '#site', url: SITE, name: 'Luzcor Iluminação', inLanguage: 'pt-BR', publisher: { '@id': STORE_ID } },
    { '@type': 'WebPage', '@id': SITE + '#inicio', url: SITE, name: title, description: desc, isPartOf: { '@id': SITE + '#site' }, about: { '@id': STORE_ID }, primaryImageOfPage: PHOTO, inLanguage: 'pt-BR' },
  ],
};

/* ---------------- 1. prévia em arquivo único ---------------- */
{
  await build({ entryPoints: ['src/client.jsx'], bundle: true, minify: true, format: 'iife', target: 'es2020', outdir: 'dist/c', jsx: 'automatic', loader: DATAURL, nodePaths, define, legalComments: 'none' });
  const { render } = await ssr(DATAURL, undefined, 'a');
  const js = readFileSync('dist/c/client.js', 'utf8').replace(/<\/script/gi, '<\\/script');
  const css = readFileSync('dist/c/client.css', 'utf8');
  const fav = 'data:image/png;base64,' + readFileSync('assets-fonte/favicon.png').toString('base64');
  const html = `${head({ t: title, d: desc, url: SITE, ld: homeLd, css: `<style>${css}</style>`, extra: `<link rel="icon" href="${fav}">\n<script>document.documentElement.classList.add('js')</script>` })}
<body>
<div id="root">${render()}</div>
<script>${js}</script>
</body>
</html>`;
  writeFileSync('dist/index.html', html);
  console.log('prévia', (html.length / 1024).toFixed(0) + ' KB');
}

/* ---------------- 2. site para o domínio ---------------- */
{
  const r1 = await build({
    entryPoints: ['src/client.jsx'], bundle: true, minify: true, format: 'iife', target: 'es2020', outdir: 'docs/assets',
    entryNames: 'app-[hash]', assetNames: '[name]-[hash]', publicPath: '/assets/', jsx: 'automatic', loader: FILE, nodePaths, define, legalComments: 'none', metafile: true,
  });
  const r2 = await build({
    entryPoints: ['src/sub-entry.js'], bundle: true, minify: true, outdir: 'docs/assets',
    entryNames: 'pagina-[hash]', assetNames: '[name]-[hash]', publicPath: '/assets/', loader: FILE, legalComments: 'none', metafile: true,
  });
  const appJs = '/' + outName(r1.metafile, '.js', 'docs/assets').replace('docs/', '');
  const appCss = '/' + outName(r1.metafile, '.css', 'docs/assets').replace('docs/', '');
  const subCss = '/' + outName(r2.metafile, '.css', 'docs/assets').replace('docs/', '');
  rmSync('docs/assets/' + outName(r2.metafile, '.js', 'docs/assets').split('/').pop(), { force: true });
  const fonts = Object.keys(r1.metafile.outputs).filter((k) => k.endsWith('.woff')).map((k) => '/' + k.replace('docs/', ''));
  const preload = fonts.filter((f) => /cardo-|montserrat/.test(f)).map((f) => `<link rel="preload" href="${f}" as="font" type="font/woff" crossorigin>`).join('\n');
  const icons = '<link rel="icon" type="image/png" href="/favicon.png">\n<link rel="apple-touch-icon" href="/favicon.png">';

  const { render, pages } = await ssr(FILE, '/assets/', 'b');
  const home = `${head({ t: title, d: desc, url: SITE, ld: homeLd, css: `<link rel="stylesheet" href="${appCss}">`, extra: `${icons}\n${preload}\n<script>document.documentElement.classList.add('js')</script>` })}
<body>
<div id="root">${render()}</div>
<script src="${appJs}" defer></script>
</body>
</html>`;
  writeFileSync('docs/index.html', home);

  for (const p of pages) {
    const url = SITE + p.path;
    const graph = [
      { '@type': 'WebPage', '@id': url + '#pagina', url, name: p.title, description: p.desc, inLanguage: 'pt-BR', isPartOf: { '@id': SITE + '#site' }, about: { '@id': STORE_ID }, primaryImageOfPage: PHOTO },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Início', item: SITE }, { '@type': 'ListItem', position: 2, name: p.crumb, item: url }] },
      { ...storeLd },
    ];
    if (p.service && !p.private) graph.push({ '@type': 'Service', name: p.service.name, serviceType: p.service.type, provider: { '@id': STORE_ID }, areaServed: storeLd.areaServed, url });
    if (p.faq) graph.push({ '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
    let html = `${head({ t: p.title, d: p.desc, url, ld: { '@context': 'https://schema.org', '@graph': graph }, css: `<link rel="stylesheet" href="${subCss}">`, extra: `${icons}\n${preload.split('\n').filter((l) => /cardo|montserrat/.test(l)).join('\n')}` })}
<body>
${p.html}
</body>
</html>`;
    if (p.private) html = html.replace('content="index, follow, max-image-preview:large"', 'content="noindex, nofollow, noarchive"');
    mkdirSync('docs/' + p.path, { recursive: true });
    writeFileSync('docs/' + p.path + 'index.html', html);
  }

  copyFileSync('assets-fonte/destino.jpg', 'docs/fachada-luzcor.jpg');
  copyFileSync('assets-fonte/logo-light.png', 'docs/logo-luzcor.png');
  copyFileSync('assets-fonte/favicon.png', 'docs/favicon.png');
  const urls = [SITE, ...pages.filter((p) => !p.private).map((p) => SITE + p.path)];
  writeFileSync('docs/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
  writeFileSync('docs/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u, i) => `  <url><loc>${u}</loc><lastmod>2026-11-24</lastmod><priority>${i ? '0.8' : '1.0'}</priority></url>`).join('\n')}\n</urlset>\n`);
  writeFileSync('docs/llms.txt', `# Luzcor Iluminação

> Loja de iluminação e material elétrico em Telêmaco Borba, Paraná, que atende Ponta Grossa e toda a região dos Campos Gerais. Tem produtos do essencial ao exclusivo, um ateliê que produz luminárias sob medida e consultoria de iluminação para arquitetos e seus clientes.

- Endereço: ${ADDRESS.street}, ${ADDRESS.district}, ${ADDRESS.city} - ${ADDRESS.uf}, CEP ${ADDRESS.cep}
- Telefone e WhatsApp: (42) 3273-1964
- Horário: segunda a sexta, 8h às 18h; sábado, 8h às 13h
- Instagram: @luzcor.tb
- Região atendida: ${CITIES.map((c) => c.n).join(', ')} e Campos Gerais (PR)
- Consultoria de iluminação: conduzida por Thiago Segantin, especialista em projetos luminotécnicos
- Material elétrico: uma das poucas lojas de iluminação da região que também vende material elétrico
- Ateliê: produz peças sob medida, como um perfil de LED de 5 metros inteiro ou um pendente no comprimento exato
- Arquitetos: consultoria para o arquiteto e para o cliente do arquiteto, apresentação de projeto luminotécnico, soluções técnicas e condições especiais para parceiros, inclusive de Ponta Grossa
- Eletricistas: condições especiais e treinamentos

## Páginas
- [Início](${SITE})
${pages.filter((p) => !p.private).map((p) => `- [${p.title.split(' | ')[0]}](${SITE + p.path}): ${p.desc}`).join('\n')}

## Produtos
${PRODUCTS.map((p) => `- ${p.name}: ${p.text}`).join('\n')}

## Perguntas frequentes
${FAQ.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}
`);
  writeFileSync('docs/404.html', home.replace(/<title>.*?<\/title>/, '<title>Página não encontrada | Luzcor Iluminação</title>').replace('content="index, follow, max-image-preview:large"', 'content="noindex"'));
  console.log('site: home', (home.length / 1024).toFixed(0) + ' KB,', pages.length, 'páginas internas');
}
rmSync('dist/tmp-a', { recursive: true, force: true });
rmSync('dist/tmp-b', { recursive: true, force: true });
rmSync('dist/c', { recursive: true, force: true });
writeFileSync('docs/CNAME', 'www.luzcor.com.br\n');
mkdirSync('docs/midia', { recursive: true });
for (const f of readdirSync('assets-fonte/midia')) copyFileSync('assets-fonte/midia/' + f, 'docs/midia/' + f);
writeFileSync('docs/.nojekyll', '');
