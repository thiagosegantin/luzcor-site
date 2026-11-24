import { useEffect, useRef, useState } from 'react';
import logoLight from '../assets-fonte/logo-light.png';
import {
  ADDRESS, CITIES, COLLECTION, HOURS, INSTAGRAM, MAPS, PHONE_TEL, PHONE_TXT, PINTEREST, REVIEWS, wa,
} from './data.js';

const WA_HELLO = 'Olá, Luzcor! Vim pelo site e gostaria de atendimento.';

// mesma projeção do mapa usada na cena 3D
const MAPBOX = { minLat: -25.2, maxLat: -23.95, minLon: -51.05, maxLon: -49.9 };
export const cityPt = (c) => [
  40 + ((c.lon - MAPBOX.minLon) / (MAPBOX.maxLon - MAPBOX.minLon)) * 480,
  30 + ((MAPBOX.maxLat - c.lat) / (MAPBOX.maxLat - MAPBOX.minLat)) * 460,
];

function useLife() {
  const canvas = useRef(null);
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveal = [...document.querySelectorAll('[data-reveal]')];
    let io;
    if (reduce) reveal.forEach((el) => el.setAttribute('data-in', ''));
    else {
      io = new IntersectionObserver(
        (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.setAttribute('data-in', ''); io.unobserve(e.target); } }),
        { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
      );
      reveal.forEach((el) => io.observe(el));
    }
    let stop = () => {};
    let alive = true;
    import('./gl3d.js')
      .then(({ startScene, storeImg }) => {
        if (!alive) return;
        const dest = document.querySelector('.dest-img');
        if (dest) dest.style.backgroundImage = `url(${storeImg})`;
        try {
          stop = startScene(canvas.current, { cities: CITIES, cityPt });
          root.classList.add('has3d');
        } catch (e) {
          root.classList.add('no3d');
          document.querySelectorAll('[data-st]').forEach((el) => el.setAttribute('data-lit', ''));
        }
      });
    const nav = document.querySelector('.nav');
    const onScroll = () => nav && nav.toggleAttribute('data-solid', window.scrollY > window.innerHeight * 0.6);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { alive = false; stop(); io && io.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);
  return canvas;
}

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [['#colecao', 'Coleção'], ['#atelie', 'Ateliê'], ['#consultoria', 'Consultoria'], ['#arquitetos', 'Arquitetos'], ['#visite', 'Visite']];
  return (
    <header className="nav" data-open={open ? '' : undefined}>
      <a href="#inicio" className="nav-logo" aria-label="Luzcor Iluminação, início">
        <img src={logoLight} alt="Luzcor Iluminação" width="407" height="104" />
      </a>
      <nav aria-label="Principal" className="nav-links">
        {links.map(([h, t]) => <a key={h} href={h} onClick={() => setOpen(false)}>{t}</a>)}
      </nav>
      <a className="nav-wa" href={wa(WA_HELLO)} target="_blank" rel="noopener">WhatsApp</a>
      <button type="button" className="nav-menu" aria-expanded={open} aria-label={open ? 'Fechar menu' : 'Abrir menu'} onClick={() => setOpen(!open)}>
        <span /><span />
      </button>
    </header>
  );
}

function Hero() {
  return (
    <section id="inicio" className="hero" data-st="0" aria-labelledby="h1">
      <div className="hero-logo">
        <img src={logoLight} alt="Luzcor Iluminação" width="407" height="104" />
      </div>
      <h1 id="h1" className="hero-title">
        <span className="t">Luz que <em>inspira.</em></span>
        <span className="s">Loja de iluminação e material elétrico em Telêmaco Borba, com peças sob medida, para Ponta Grossa e todos os Campos Gerais</span>
      </h1>
      <p className="hero-hello">Da escolha de uma lâmpada ao projeto completo, a gente ajuda você a encontrar a luz certa.</p>
      <div className="hero-cta">
        <a className="btn" href="#colecao">Siga a luz</a>
        <a className="btn btn-line" href={wa(WA_HELLO)} target="_blank" rel="noopener">Falar com a Luzcor</a>
      </div>
      <div className="hero-cue" aria-hidden="true">role devagar</div>
    </section>
  );
}

function Block({ st, label, id, title, children, className = '', more }) {
  return (
    <div className={'block ' + className} data-st={st}>
      <h2 className="chap-title" id={id}>
        <span className="chap-label">{label}</span>
        <span className="tt">{title}</span>
      </h2>
      {children}
      {more && <a className="more" href={more[0]}>{more[1]} →</a>}
    </div>
  );
}

const PILLARS = [
  ['Do essencial ao exclusivo', 'Da lâmpada do dia a dia à peça de destaque, para todo projeto e todo orçamento.', '#colecao'],
  ['Material elétrico completo', 'Fios, cabos, disjuntores, fontes e drivers de LED, junto com a iluminação.', '#energia'],
  ['Ateliê de peças sob medida', 'O que não existe pronto no mercado, a gente produz.', '#atelie'],
  ['Consultoria para arquitetos', 'Apoio técnico ao arquiteto e ao cliente dele, do projeto à obra.', '#consultoria'],
];

function Born() {
  return (
    <section className="stage born" aria-label="O que a Luzcor faz">
      <Block st="1" label="Iluminação e material elétrico" id="energia" more={['/luzcor-iluminacao-variedade-de-produtos/', 'Ver produtos e material elétrico']} title={<>Da energia à luz, <em>o projeto inteiro num lugar só.</em></>}>
        <p className="lead">
          A Luzcor é uma loja de iluminação que também tem material elétrico, coisa rara na região. A mesma equipe que
          ajuda a escolher o lustre separa o cabo, o disjuntor e o driver do LED. O projeto sai completo, sem idas e vindas.
        </p>
        <ul className="pillars">
          {PILLARS.map(([t, d, h]) => (
            <li key={t}><a href={h}><strong>{t}</strong><span>{d}</span></a></li>
          ))}
        </ul>
      </Block>
    </section>
  );
}

function Collection() {
  return (
    <section className="collection" aria-labelledby="col-t">
      <div className="col-head">
        <h2 className="chap-title" id="col-t"><span className="chap-label" id="colecao">Lustres, pendentes e luminárias</span><span className="tt">Do essencial <em>ao exclusivo.</em></span></h2>
        <p className="lead">Linhas do dia a dia e peças de destaque, para todo tipo de projeto e orçamento. Siga o cabo: cada uma acende quando a energia chega.</p>
      </div>
      <ul className="pieces">
        {COLLECTION.map((c, i) => (
          <li key={c.id} className="stage piece">
            <div className="block piece-text" data-st={2 + i}>
              <span className="piece-n">{String.fromCharCode(8544 + i)}</span>
              <h3>{c.name}</h3>
              <p>{c.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="also">
        E também plafons, abajures, luminárias de mesa e de piso, lâmpadas, fitas e fontes de LED, interruptores, tomadas e todo o material elétrico da obra.{' '}
        <a href={wa('Olá, Luzcor! Estou procurando uma peça específica:')} target="_blank" rel="noopener">Procurando uma peça específica? Pergunte.</a>
      </p>
    </section>
  );
}

function Atelier() {
  return (
    <section className="stage atelier" aria-labelledby="ate-t">
      <Block st="8" label="Luminárias sob medida" id="atelie" more={['/atelie-luminarias-sob-medida/', 'Como funciona o ateliê']} title={<span id="ate-t">Ateliê Luzcor: <em>quando a peça certa não existe, a gente produz.</em></span>}>
        <p className="lead">
          Além de loja, a Luzcor funciona como um ateliê de iluminação. Produzimos peças personalizadas para projetos
          específicos: um perfil de LED de 5 metros inteiro, um pendente no comprimento exato da mesa, uma composição
          exclusiva para um pé-direito duplo. Peças que não se encontram prontas no mercado.
        </p>
        <a className="btn" href={wa('Olá, Luzcor! Preciso de uma peça sob medida para um projeto:')} target="_blank" rel="noopener">Pedir uma peça sob medida</a>
      </Block>
    </section>
  );
}

const CONSULT = [
  ['Para o arquiteto', 'Apoio técnico na definição dos pontos de luz, das temperaturas de cor e das peças.'],
  ['Para o cliente do arquiteto', 'Atendimento no showroom, com as peças de perto e alinhado ao que o projeto pede.'],
  ['Projeto luminotécnico', 'Quando o escritório precisa, apresentamos o projeto de iluminação completo.'],
  ['Soluções técnicas', 'Nem todo escritório tem foco em iluminação. A parte técnica, a gente resolve junto.'],
];

function Project() {
  return (
    <section className="stage project" aria-labelledby="proj-t">
      <Block st="9" label="Consultoria e projeto luminotécnico" id="consultoria" more={['/consultoria-de-iluminacao-em-telemaco-borba/', 'Saiba mais sobre a consultoria']} title={<span id="proj-t">Consultoria de iluminação, <em>para quem projeta e para quem vai morar.</em></span>}>
        <p className="lead">
          A consultoria é conduzida por <strong>Thiago Segantin</strong>, especialista em projetos luminotécnicos.
          Ela entra onde o projeto precisar:
        </p>
        <ul className="pillars plain">
          {CONSULT.map(([t, d]) => <li key={t}><strong>{t}</strong><span>{d}</span></li>)}
        </ul>
        <a className="btn" href={wa('Olá! Quero conversar sobre consultoria de iluminação com a Luzcor.')} target="_blank" rel="noopener">Agendar uma conversa</a>
      </Block>
    </section>
  );
}

const FOR_ARCH = [
  'Condições especiais e descontos exclusivos para o escritório',
  'Consultoria para você e para o seu cliente',
  'Projeto luminotécnico quando o escritório precisar',
  'Peças sob medida produzidas no nosso ateliê',
  'Iluminação e material elétrico da obra num pedido só',
  'Treinamentos sobre novidades em iluminação',
];

function Partners() {
  return (
    <section className="stage partners" aria-labelledby="par-t">
      <Block st="10" label="Parceria com arquitetos" id="arquitetos" more={['/parceria-com-arquitetos-telemaco-borba/', 'Conheça a parceria']} title={<span id="par-t">A Luzcor nasceu para <em>trabalhar com arquitetos.</em></span>}>
        <p className="lead">Muito do que fazemos, nem todo escritório sabe. Para o arquiteto parceiro:</p>
        <ul className="checks">{FOR_ARCH.map((x) => <li key={x}>{x}</li>)}</ul>
        <a className="btn" href="/orcamento-iluminacao-para-arquitetos/">Envie seu projeto para orçamento</a>{' '}
        <a className="btn btn-line" href={wa('Olá! Sou arquiteto(a) e quero conhecer a parceria com a Luzcor.')} target="_blank" rel="noopener">Quero ser parceiro</a>
        <p className="note">
          Eletricistas também têm condições especiais e treinamentos.{' '}
          <a href="/parceria-com-eletricista-em-telemaco-borba/">Parceria com eletricistas</a>
        </p>
      </Block>
    </section>
  );
}

function Region() {
  return (
    <section className="stage region" aria-labelledby="reg-t">
      <Block st="11" label="Ponta Grossa e Campos Gerais" id="regiao" more={['/iluminacao-ponta-grossa/', 'Atendimento em Ponta Grossa']} title={<span id="reg-t">Arquitetos de Ponta Grossa, <em>a Luzcor também é para vocês.</em></span>}>
        <p className="lead">
          Atendemos projetos em Ponta Grossa, Castro, Carambeí, Tibagi, Imbaú, Reserva, Ortigueira, Curiúva, Ventania
          e em todos os Campos Gerais. A conversa começa pelo WhatsApp e continua no showroom, em Telêmaco Borba.
        </p>
        <a className="btn" href={wa('Olá, Luzcor! Sou arquiteto(a) de outra cidade e quero enviar um projeto para orçamento. Minha cidade:')} target="_blank" rel="noopener">Enviar projeto para orçar</a>
      </Block>
    </section>
  );
}

function Arrival() {
  return (
    <section className="stage arrival" aria-labelledby="vis-t">
      <Block st="12" label="Showroom em Telêmaco Borba" id="visite" title={<span id="vis-t">Bem-vindo à <em>Luzcor.</em></span>}>
        <p className="lead">Rua Professora Edith Gordan, 270, Centro de Telêmaco Borba.</p>
        <figure className="dest">
          <div className="dest-img" role="img" aria-label="Fachada da Luzcor Iluminação à noite, com o showroom de lustres e pendentes aceso, no Centro de Telêmaco Borba" />
        </figure>
      </Block>
      <div className="block visit">
        <address className="visit-info">
          <div>
            <span className="lbl">Endereço</span>
            <a href={MAPS} target="_blank" rel="noopener">{ADDRESS.street}<br />{ADDRESS.district}, {ADDRESS.city} – {ADDRESS.uf}<br />CEP {ADDRESS.cep}</a>
          </div>
          <div>
            <span className="lbl">Horário</span>
            <dl>{HOURS.map(([d, h]) => <div key={d}><dt>{d}</dt><dd>{h}</dd></div>)}</dl>
          </div>
          <div>
            <span className="lbl">Telefone e WhatsApp</span>
            <a href={'tel:' + PHONE_TEL}>{PHONE_TXT}</a>
            <span className="lbl gap">Redes</span>
            <a href={INSTAGRAM} target="_blank" rel="noopener">Instagram @luzcor.tb</a> · <a href={PINTEREST} target="_blank" rel="noopener">Pinterest</a>
            <span className="lbl gap">Avaliações</span>
            <a href={REVIEWS} target="_blank" rel="noopener">Ler no Google</a>
          </div>
        </address>
        <div className="visit-cta">
          <a className="btn" href={wa(WA_HELLO)} target="_blank" rel="noopener">Chamar no WhatsApp</a>
          <a className="btn btn-line" href={MAPS} target="_blank" rel="noopener">Como chegar</a>
          <a className="btn btn-line" href={'tel:' + PHONE_TEL}>Ligar</a>
        </div>
      </div>
    </section>
  );
}

export const PAGES_NAV = [
  ['/luzcor-iluminacao-variedade-de-produtos/', 'Luminárias e material elétrico'],
  ['/atelie-luminarias-sob-medida/', 'Luminárias sob medida'],
  ['/consultoria-de-iluminacao-em-telemaco-borba/', 'Consultoria e projeto luminotécnico'],
  ['/parceria-com-arquitetos-telemaco-borba/', 'Parceria com arquitetos'],
  ['/orcamento-iluminacao-para-arquitetos/', 'Arquiteto: envie seu projeto'],
  ['/perfil-de-led-sob-medida/', 'Perfil de LED sob medida'],
  ['/parceria-com-eletricista-em-telemaco-borba/', 'Parceria com eletricistas'],
  ['/iluminacao-ponta-grossa/', 'Atendimento em Ponta Grossa'],
  ['/perguntas-frequentes/', 'Perguntas frequentes'],
];

export function Footer() {
  return (
    <footer className="foot">
      <img src={logoLight} alt="Luzcor Iluminação" width="407" height="104" loading="lazy" />
      <p className="foot-sig">Luz que inspira.</p>
      <nav className="foot-nav" aria-label="Páginas">
        {PAGES_NAV.map(([h, t]) => <a key={h} href={h}>{t}</a>)}
      </nav>
      <p className="foot-nap">
        Luzcor Iluminação · Loja de iluminação e material elétrico · {ADDRESS.street}, {ADDRESS.district}, {ADDRESS.city} – {ADDRESS.uf}, CEP {ADDRESS.cep} · {PHONE_TXT}
      </p>
      <p className="credit">Site por Thiago Segantin — design, iluminação e branding</p>
    </footer>
  );
}

export default function App() {
  const canvas = useLife();
  return (
    <>
      <canvas ref={canvas} className="scene" aria-hidden="true" />
      <div className="veil" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Born />
        <Collection />
        <Atelier />
        <Project />
        <Partners />
        <Region />
        <Arrival />
      </main>
      <Footer />
    </>
  );
}
