// Páginas internas: uma por intenção de busca. Estáticas, leves, sem 3D.
// Quatro delas mantêm o endereço exato do site antigo, para não perder o que o Google já conhece.
import logoLight from '../assets-fonte/logo-light.png';
import storeImg from '../assets-fonte/destino.jpg';
import { Footer } from './App.jsx';
import { Expositor } from './expositor.jsx';
import { ADDRESS, CITIES, EMAIL, FAQ, HOURS, MAPS, PHONE_TXT, PHONE_TEL, REVIEWS, ROOMS, SITE, wa } from './data.js';

const WA = (m) => wa(m || 'Olá, Luzcor! Vim pelo site e gostaria de atendimento.');

function Header() {
  return (
    <header className="p-nav">
      <a href="/" className="p-logo" aria-label="Luzcor Iluminação, página inicial">
        <img src={logoLight} alt="Luzcor Iluminação" width="407" height="104" />
      </a>
      <nav aria-label="Principal">
        <a href="/luzcor-iluminacao-variedade-de-produtos/">Produtos</a>
        <a href="/atelie-luminarias-sob-medida/">Ateliê</a>
        <a href="/consultoria-de-iluminacao-em-telemaco-borba/">Consultoria</a>
        <a href="/parceria-com-arquitetos-telemaco-borba/">Arquitetos</a>
        <a href="/orcamento-iluminacao-para-arquitetos/">Envie seu projeto</a>
      </nav>
      <a className="p-wa" href={WA()} target="_blank" rel="noopener">WhatsApp</a>
    </header>
  );
}

function Visit() {
  return (
    <section className="p-visit" aria-labelledby="visit-t">
      <figure>
        <img src={storeImg} alt="Fachada da Luzcor Iluminação ao entardecer, com o showroom de luminárias aceso, no Centro de Telêmaco Borba" width="1500" height="750" loading="lazy" />
      </figure>
      <div>
        <h2 id="visit-t">Visite o showroom em Telêmaco Borba</h2>
        <address>
          <a href={MAPS} target="_blank" rel="noopener">{ADDRESS.street}, {ADDRESS.district}, {ADDRESS.city} – {ADDRESS.uf}, CEP {ADDRESS.cep}</a>
          <br />Telefone e WhatsApp: <a href={'tel:' + PHONE_TEL}>{PHONE_TXT}</a>
          <br />{HOURS.filter(([, h]) => h !== 'Fechado').map(([d, h]) => `${d}: ${h}`).join(' · ')}
        </address>
        <div className="p-cta">
          <a className="btn" href={WA()} target="_blank" rel="noopener">Chamar no WhatsApp</a>
          <a className="btn btn-line" href={MAPS} target="_blank" rel="noopener">Como chegar</a>
          <a className="btn btn-line" href={'tel:' + PHONE_TEL}>Ligar</a>
        </div>
        <p className="p-rev"><a href={REVIEWS} target="_blank" rel="noopener">Ver o que os clientes dizem no Google</a></p>
      </div>
    </section>
  );
}

function Shell({ crumb, h1, kicker, lead, children }) {
  return (
    <>
      <Header />
      <main className="p-main">
        <nav className="p-crumb" aria-label="Você está em">
          <a href="/">Início</a> <span aria-hidden="true">/</span> <span>{crumb}</span>
        </nav>
        <header className="p-head">
          <p className="chap-label">{kicker}</p>
          <h1>{h1}</h1>
          <p className="p-lead">{lead}</p>
        </header>
        {children}
        <Visit />
      </main>
      <Footer />
    </>
  );
}

const MAIL = (assunto) => `mailto:${EMAIL}?subject=${encodeURIComponent(assunto)}`;

function EnvieProjeto({ origem }) {
  const msg = 'Olá, Luzcor! Sou arquiteto(a) e quero enviar um projeto para orçamento.' + (origem ? ' ' + origem : '');
  return (
    <section className="p-sec" id="envie-seu-projeto">
      <h2>Envie seu projeto para orçamento</h2>
      <p>
        Mande o projeto do seu cliente e a Luzcor devolve o orçamento completo da iluminação e do material elétrico
        em até 2 dias úteis.
      </p>
      <List items={[
        ['O que enviar', 'Planta luminotécnica, projeto em PDF ou DWG, ou uma lista de pontos e peças. Fotos e referências ajudam.'],
        ['O que você recebe', 'Iluminação e material elétrico orçados juntos, com alternativas por faixa de preço.'],
        ['Peças sob medida', 'Quando o projeto pede o que não existe pronto, o ateliê da Luzcor produz.'],
        ['Prazo', 'Retorno em até 2 dias úteis.'],
      ]} />
      <div className="p-cta">
        <a className="btn" href={wa(msg)} target="_blank" rel="noopener">Enviar projeto pelo WhatsApp</a>
        <a className="btn btn-line" href={MAIL('Projeto para orçamento')}>Enviar por e-mail</a>
      </div>
    </section>
  );
}

const SHOWROOM_MSG = 'Olá, Luzcor! Sou arquiteto(a) e quero um showroom de luz técnica no meu escritório. Meu escritório fica em:';

const List = ({ items }) => (
  <ul className="p-list">{items.map(([t, d]) => <li key={t}><strong>{t}</strong>{d && <span>{d}</span>}</li>)}</ul>
);

/* ---------------- conteúdo ---------------- */
export const PAGES = [
  {
    path: 'luzcor-iluminacao-variedade-de-produtos/',
    crumb: 'Produtos',
    title: 'Luminárias e material elétrico em Telêmaco Borba | Luzcor',
    desc: 'Lustres, pendentes, arandelas, spots, trilhos, perfis de LED, lâmpadas e material elétrico em Telêmaco Borba. Do essencial ao exclusivo, para todo projeto.',
    service: null,
    body: () => (
      <Shell
        crumb="Produtos"
        kicker="Loja de iluminação e material elétrico"
        h1="Luminárias, lâmpadas e material elétrico em Telêmaco Borba"
        lead="A Luzcor reúne iluminação e material elétrico na mesma loja. Das linhas do dia a dia às peças de destaque, para casas, lojas, escritórios e obras de Telêmaco Borba, Ponta Grossa e dos Campos Gerais."
      >
        <section className="p-sec">
          <h2>Iluminação decorativa</h2>
          <List items={[
            ['Lustres', 'Peças de presença para salas de jantar, halls e pés-direitos duplos.'],
            ['Pendentes', 'Sobre ilhas, bancadas e mesas, de linhas simples a peças esculturais.'],
            ['Arandelas internas e externas', 'Para corredores, cabeceiras, escadas, varandas e fachadas.'],
            ['Abajures e luminárias de mesa e de piso', 'Luz de leitura e de aconchego, que acompanha a decoração.'],
          ]} />
        </section>
        <section className="p-sec">
          <h2>Iluminação técnica e LED</h2>
          <List items={[
            ['Spots embutidos e de sobrepor', 'Luz de destaque e de efeito para forro de gesso, laje e marcenaria.'],
            ['Trilhos eletrificados', 'Para mover e reorientar a luz sem obra, em casas, lojas e galerias.'],
            ['Perfis e fitas de LED', 'Linhas de luz em sancas, nichos, rodapés e marcenaria, cortadas na medida.'],
            ['Plafons', 'Luz geral discreta e eficiente, de embutir ou sobrepor.'],
            ['Lâmpadas', 'LED, alta potência e especiais, na temperatura de cor certa para cada ambiente.'],
          ]} />
        </section>
        <section className="p-sec">
          <h2>Iluminação externa</h2>
          <p>Refletores, balizadores, espetos de jardim e luminárias urbanas para fachadas, jardins, piscinas e áreas abertas.</p>
        </section>
        <section className="p-sec">
          <h2>Material elétrico</h2>
          <p>
            A Luzcor é uma das poucas lojas de iluminação da região que também tem material elétrico: fios, cabos,
            disjuntores, interruptores, tomadas, fontes e drivers de LED. A iluminação e a parte elétrica do projeto saem
            juntas, no mesmo pedido.
          </p>
        </section>
        <section className="p-sec">
          <h2>Não existe pronto? Produzimos sob medida</h2>
          <p>
            Quando a peça certa não está no mercado, o ateliê da Luzcor produz: um perfil de LED de 5 metros inteiro, um
            pendente no comprimento exato da mesa, uma composição exclusiva. <a href="/atelie-luminarias-sob-medida/">Conheça o ateliê</a>.
          </p>
        </section>
      </Shell>
    ),
  },
  {
    path: 'atelie-luminarias-sob-medida/',
    crumb: 'Ateliê',
    title: 'Luminárias e perfis de LED sob medida | Ateliê Luzcor',
    desc: 'O ateliê da Luzcor produz luminárias personalizadas: perfis de LED de 5 metros inteiros, pendentes no comprimento exato e peças exclusivas.',
    service: { name: 'Luminárias e perfis de LED sob medida', type: 'Fabricação de luminárias personalizadas' },
    body: () => (
      <Shell
        crumb="Ateliê"
        kicker="Ateliê de iluminação"
        h1="Luminárias e perfis de LED sob medida"
        lead="Além de loja, a Luzcor funciona como um ateliê de iluminação. Quando a peça certa não existe pronta no mercado, a gente produz, no tamanho, no acabamento e na luz que o projeto pede."
      >
        <section className="p-sec">
          <h2>O que o ateliê produz</h2>
          <List items={[
            ['Perfis de LED em peça única', 'Como um perfil de 5 metros inteiro, sem emendas aparentes, para sancas, marcenaria ou pendentes lineares.'],
            ['Pendentes no comprimento exato', 'Para mesas, ilhas e bancadas com medidas fora do padrão.'],
            ['Composições exclusivas', 'Conjuntos de peças pensados para um pé-direito duplo, um hall ou um projeto específico.'],
          ]} />
        </section>
        <section className="p-sec">
          <h2>Para quem é</h2>
          <p>
            Para arquitetos e designers que precisam de uma solução que não está no catálogo de ninguém, e para clientes
            que querem uma peça feita para a sua casa. A consultoria de iluminação da Luzcor ajuda a definir medidas,
            acabamento e temperatura de cor.
          </p>
          <a className="btn" href={WA('Olá, Luzcor! Preciso de uma peça sob medida para um projeto:')} target="_blank" rel="noopener">Pedir uma peça sob medida</a>
        </section>
      </Shell>
    ),
  },
  {
    path: 'consultoria-de-iluminacao-em-telemaco-borba/',
    crumb: 'Consultoria',
    title: 'Consultoria e projeto luminotécnico em Telêmaco Borba | Luzcor',
    desc: 'Consultoria de iluminação com Thiago Segantin para arquitetos e clientes de Telêmaco Borba e Ponta Grossa: pontos de luz, temperatura de cor e peças.',
    service: { name: 'Consultoria de iluminação e projeto luminotécnico', type: 'Consultoria de iluminação' },
    body: () => (
      <Shell
        crumb="Consultoria"
        kicker="Consultoria de iluminação"
        h1="Consultoria e projeto luminotécnico em Telêmaco Borba"
        lead="A consultoria da Luzcor é conduzida por Thiago Segantin, especialista em projetos luminotécnicos. Ela atende arquitetos, designers e clientes finais de Telêmaco Borba, Ponta Grossa e de toda a região dos Campos Gerais."
      >
        <section className="p-sec">
          <h2>Como a consultoria ajuda</h2>
          <List items={[
            ['Para o arquiteto', 'Apoio técnico na definição dos pontos de luz, das temperaturas de cor e das peças.'],
            ['Para o cliente do arquiteto', 'Atendimento no showroom, com as peças de perto e alinhado ao que o projeto pede.'],
            ['Projeto luminotécnico', 'Quando o escritório precisa, apresentamos o projeto de iluminação completo.'],
            ['Soluções técnicas', 'Nem todo escritório tem foco em iluminação. A parte técnica, a gente resolve junto.'],
          ]} />
        </section>
        <section className="p-sec">
          <h2>Como funciona</h2>
          <ol className="p-steps">
            <li><strong>Conversa.</strong> Entendemos o projeto, a planta, o estilo e como cada ambiente vai ser usado.</li>
            <li><strong>Projeto luminotécnico.</strong> Definimos os pontos de luz, os efeitos e a temperatura de cor de cada ambiente.</li>
            <li><strong>Escolha das peças.</strong> No showroom, com as luminárias de perto e orientação técnica.</li>
            <li><strong>Execução.</strong> Iluminação e material elétrico no mesmo pedido, e indicação de eletricistas parceiros.</li>
          </ol>
        </section>
        <section className="p-sec">
          <h2>Temperatura de cor para cada ambiente</h2>
          <p>Um guia rápido do que usamos nos projetos. Quanto menor o número em Kelvin, mais quente e acolhedora a luz.</p>
          <table className="p-table">
            <thead><tr><th>Ambiente</th><th>Temperatura</th><th>Dica</th></tr></thead>
            <tbody>{ROOMS.map((r) => <tr key={r.name}><td>{r.name}</td><td>{r.k}</td><td>{r.tip}</td></tr>)}</tbody>
          </table>
          <a className="btn" href={WA('Olá! Quero conversar sobre consultoria de iluminação com a Luzcor.')} target="_blank" rel="noopener">Agendar uma conversa</a>
        </section>
      </Shell>
    ),
  },
  {
    path: 'parceria-com-arquitetos-telemaco-borba/',
    crumb: 'Arquitetos',
    title: 'Parceria com arquitetos em Telêmaco Borba e Ponta Grossa | Luzcor',
    desc: 'A Luzcor trabalha com arquitetos de Telêmaco Borba, Ponta Grossa e Campos Gerais: consultoria, projeto luminotécnico, peças sob medida e condições especiais.',
    service: { name: 'Parceria com arquitetos e designers de interiores', type: 'Programa de parceria' },
    body: () => (
      <Shell
        crumb="Arquitetos"
        kicker="Parceria com arquitetos"
        h1="Parceria com arquitetos em Telêmaco Borba e Ponta Grossa"
        lead="A Luzcor nasceu para trabalhar com arquitetos. Muito do que fazemos, nem todo escritório sabe: consultoria para você e para o seu cliente, projeto luminotécnico, peças sob medida e a parte elétrica da obra no mesmo pedido."
      >
        <EnvieProjeto />
        <section className="p-sec">
          <h2>O que o escritório parceiro recebe</h2>
          <List items={[
            ['Condições especiais', 'Descontos exclusivos para o escritório parceiro.'],
            ['Consultoria para você e para o seu cliente', 'Apoio técnico ao arquiteto e atendimento ao cliente no showroom.'],
            ['Projeto luminotécnico', 'Apresentamos o projeto de iluminação quando o escritório precisar.'],
            ['Peças sob medida', 'Produzidas no ateliê da Luzcor, como perfis de LED de 5 metros e pendentes no comprimento exato.'],
            ['Pedido único', 'Iluminação e material elétrico da obra juntos.'],
            ['Treinamentos', 'Sobre novidades e tecnologias em iluminação.'],
          ]} />
        </section>
        <section className="p-sec">
          <h2>Arquitetos de Ponta Grossa e dos Campos Gerais</h2>
          <p>
            Atendemos escritórios e obras de Ponta Grossa, Castro, Carambeí, Tibagi e de toda a região. A conversa começa
            pelo WhatsApp e continua no showroom, em Telêmaco Borba. <a href="/iluminacao-ponta-grossa/">Veja como atendemos Ponta Grossa</a>.
          </p>
          <a className="btn" href={WA('Olá! Sou arquiteto(a) e quero conhecer a parceria com a Luzcor. Meu escritório fica em:')} target="_blank" rel="noopener">Quero ser parceiro</a>
        </section>
      </Shell>
    ),
  },
  {
    path: 'parceria-com-eletricista-em-telemaco-borba/',
    crumb: 'Eletricistas',
    title: 'Parceria com eletricistas em Telêmaco Borba | Luzcor',
    desc: 'Eletricistas parceiros da Luzcor têm condições especiais, orientação técnica e treinamentos, com iluminação e material elétrico na mesma loja.',
    service: { name: 'Parceria com eletricistas', type: 'Programa de parceria' },
    body: () => (
      <Shell
        crumb="Eletricistas"
        kicker="Parceria com eletricistas"
        h1="Parceria com eletricistas em Telêmaco Borba"
        lead="Iluminação e material elétrico na mesma loja, com orientação técnica e condições especiais para quem instala."
      >
        <section className="p-sec">
          <h2>O que o eletricista parceiro recebe</h2>
          <List items={[
            ['Condições especiais', 'Descontos exclusivos em produtos.'],
            ['Orientação técnica', 'Ajuda na escolha dos produtos certos para cada instalação.'],
            ['Treinamentos e workshops', 'Sobre novas tecnologias de iluminação e boas práticas.'],
          ]} />
        </section>
        <section className="p-sec">
          <h2>Iluminação e material elétrico no mesmo balcão</h2>
          <p>
            Luminárias, lâmpadas, perfis e fitas de LED, fontes e drivers, fios, cabos, disjuntores, interruptores e
            tomadas na mesma loja. Menos idas a fornecedores diferentes e a obra anda. Quando o cliente precisa de uma
            peça que não existe pronta, o <a href="/atelie-luminarias-sob-medida/">ateliê da Luzcor</a> produz sob medida.
          </p>
          <a className="btn" href={WA('Olá! Sou eletricista e quero conhecer a parceria com a Luzcor.')} target="_blank" rel="noopener">Quero ser parceiro</a>
        </section>
      </Shell>
    ),
  },
  {
    path: 'iluminacao-ponta-grossa/',
    crumb: 'Ponta Grossa',
    title: 'Loja de iluminação para Ponta Grossa e Campos Gerais | Luzcor',
    desc: 'Arquitetos e obras de Ponta Grossa contam com a Luzcor: luminárias, material elétrico, peças sob medida e consultoria de iluminação.',
    service: { name: 'Iluminação para projetos em Ponta Grossa e Campos Gerais', type: 'Venda de iluminação e consultoria' },
    body: () => (
      <Shell
        crumb="Ponta Grossa"
        kicker="Ponta Grossa e Campos Gerais"
        h1="Iluminação para arquitetos e obras de Ponta Grossa"
        lead="A Luzcor fica em Telêmaco Borba e atende projetos em Ponta Grossa e em todos os Campos Gerais. Para escritórios de arquitetura, somos um parceiro de iluminação completo: produtos, material elétrico, peças sob medida e consultoria."
      >
        <EnvieProjeto origem="Meu escritório fica em Ponta Grossa." />
        <section className="p-sec">
          <h2>Por que arquitetos de Ponta Grossa trabalham com a Luzcor</h2>
          <List items={[
            ['Peças sob medida', 'O ateliê produz o que não existe pronto, como perfis de LED de 5 metros inteiros.'],
            ['Consultoria de iluminação', 'Para o arquiteto e para o cliente do arquiteto, com projeto luminotécnico quando necessário.'],
            ['Iluminação e material elétrico', 'Tudo da obra num pedido só.'],
            ['Do essencial ao exclusivo', 'Opções para todo tipo de projeto e orçamento.'],
          ]} />
        </section>
        <section className="p-sec">
          <h2>Como funciona o atendimento</h2>
          <p>
            O primeiro contato é pelo WhatsApp: você envia o projeto ou a necessidade e a gente orienta. Para escolher as
            peças de perto, o showroom fica no Centro de Telêmaco Borba. Também atendemos{' '}
            {CITIES.filter((c) => !c.main && !c.big).map((c) => c.n).join(', ')}.
          </p>
          <a className="btn" href={WA('Olá, Luzcor! Sou arquiteto(a) de Ponta Grossa e quero enviar um projeto para orçamento.')} target="_blank" rel="noopener">Enviar projeto para orçar</a>
        </section>
      </Shell>
    ),
  },
  {
    path: 'orcamento-iluminacao-para-arquitetos/',
    crumb: 'Envie seu projeto',
    title: 'Orçamento de iluminação para arquitetos: envie seu projeto | Luzcor',
    desc: 'Arquitetos de Telêmaco Borba, Ponta Grossa e Campos Gerais: envie o projeto e receba em até 2 dias úteis o orçamento da iluminação e do material elétrico juntos.',
    service: { name: 'Orçamento de iluminação e material elétrico para projetos de arquitetura', type: 'Orçamento para arquitetos' },
    body: () => (
      <Shell
        crumb="Envie seu projeto"
        kicker="Para arquitetos"
        h1="Envie seu projeto: a Luzcor orça a iluminação e a elétrica juntas"
        lead="Para escritórios de Telêmaco Borba, Ponta Grossa e dos Campos Gerais. Você manda o projeto do cliente e recebe, num pedido só, o orçamento das luminárias, dos perfis e fitas de LED, dos drivers e do material elétrico."
      >
        <EnvieProjeto />
        <section className="p-sec">
          <h2>Por que orçar o projeto inteiro num fornecedor só</h2>
          <List items={[
            ['Um pedido, não cinco', 'Luminárias, perfis, fitas, drivers, fios, disjuntores, tomadas e interruptores no mesmo orçamento.'],
            ['Conjunto que conversa', 'Fonte certa para cada fita, temperatura de cor coerente entre os ambientes e peças que combinam entre si.'],
            ['Alternativas por faixa de preço', 'Para o seu cliente decidir com você, sem refazer o projeto.'],
            ['O que não existe pronto', 'O ateliê da Luzcor produz peças sob medida, como perfis de LED de 5 metros inteiros.'],
          ]} />
        </section>
        <section className="p-sec">
          <h2>Como funciona</h2>
          <ol className="p-steps">
            <li>Você envia o projeto pelo WhatsApp ou por e-mail.</li>
            <li>A Luzcor revisa e, se faltar alguma informação, fala com você antes de orçar.</li>
            <li>Você recebe o orçamento em até 2 dias úteis.</li>
            <li>Se o cliente quiser ver as peças de perto, o showroom fica no Centro de Telêmaco Borba.</li>
          </ol>
        </section>
        <section className="p-sec">
          <h2>O que ajuda a orçar mais rápido</h2>
          <List items={[
            ['Pontos de luz', 'Planta com a posição de cada ponto e o tipo de peça.'],
            ['Especificação ou referência', 'Modelo, marca ou uma foto do efeito que você quer.'],
            ['Temperatura de cor', 'A que o projeto pede em cada ambiente.'],
            ['Medidas', 'Comprimento de sancas, nichos, marcenaria e perfis.'],
          ]} />
          <p>
            Veja também a <a href="/parceria-com-arquitetos-telemaco-borba/">parceria com arquitetos</a> e o{' '}
            <a href="/perfil-de-led-sob-medida/">perfil de LED sob medida</a>.
          </p>
        </section>
      </Shell>
    ),
  },
  {
    path: 'perfil-de-led-sob-medida/',
    crumb: 'Perfil de LED sob medida',
    title: 'Perfil de LED sob medida para projetos de arquitetura | Luzcor',
    desc: 'Perfis de LED no comprimento exato do projeto, como peças de 5 metros inteiros, produzidos pelo ateliê da Luzcor para arquitetos de Telêmaco Borba, Ponta Grossa e região.',
    service: { name: 'Perfil de LED sob medida', type: 'Fabricação de luminárias sob medida' },
    body: () => (
      <Shell
        crumb="Perfil de LED sob medida"
        kicker="Ateliê Luzcor"
        h1="Perfil de LED sob medida para o seu projeto"
        lead="Quando o projeto pede uma linha de luz inteira de 5 metros, um comprimento fora do padrão ou um pendente linear no tamanho exato, o ateliê da Luzcor produz a peça."
      >
        <section className="p-sec">
          <h2>O que especificar no projeto</h2>
          <List items={[
            ['Comprimento', 'A medida exata e se a peça deve ser inteira, sem emendas aparentes.'],
            ['Instalação', 'Embutido no forro ou na marcenaria, de sobrepor ou pendente.'],
            ['Temperatura de cor e IRC', 'O tom da luz em Kelvin e a fidelidade de cor que o ambiente pede.'],
            ['Potência e driver', 'Watts por metro e onde a fonte vai ficar escondida.'],
            ['Acabamento', 'Cor do perfil e tipo de difusor.'],
          ]} />
        </section>
        <section className="p-sec">
          <h2>Por que sob medida</h2>
          <p>
            Perfil cortado e emendado na obra deixa marcas na linha de luz. Feito no comprimento certo, a peça chega
            pronta para instalar e o efeito do projeto aparece como foi desenhado. Veja mais sobre o{' '}
            <a href="/atelie-luminarias-sob-medida/">ateliê de luminárias sob medida</a>.
          </p>
        </section>
        <EnvieProjeto origem="O projeto tem perfil de LED sob medida." />
      </Shell>
    ),
  },
  {
    path: 'showroom-de-luz-tecnica-no-seu-escritorio/',
    // Página reservada: sem link no site, fora do sitemap e com noindex. Só é aberta por quem recebe o link.
    private: true,
    crumb: 'Showroom no seu escritório',
    title: 'Showroom de luz técnica no seu escritório, sem custo | Luzcor',
    desc: 'Para arquitetos: a Luzcor fabrica e instala um expositor de luz técnica no seu escritório, padrão ou personalizado, sem custo.',
    service: { name: 'Showroom de luz técnica no escritório de arquitetura', type: 'Programa para arquitetos' },
    body: () => (
      <>
        <Header />
        <main className="sh">
          <section className="sh-hero">
            <div className="sh-copy">
              <p className="chap-label">Convite para escritórios de arquitetura</p>
              <h1>Um showroom de luz técnica <em>no seu escritório.</em></h1>
              <p className="sh-lead">Fabricado e instalado pela Luzcor. <strong>Sem custo.</strong></p>
              <a className="btn" href={wa(SHOWROOM_MSG)} target="_blank" rel="noopener">Quero no meu escritório</a>
            </div>
            <figure className="sh-fig">
              <Expositor />
              <figcaption>Expositor ilustrativo · 1 m × 2 m</figcaption>
            </figure>
          </section>

          <section className="sh-cards" aria-label="Por que ter">
            <div><span>01</span><h2>Seu cliente vê a luz</h2><p>Quente ou fria, destaque ou geral. Ao vivo, na reunião.</p></div>
            <div><span>02</span><h2>Padrão ou do seu jeito</h2><p>Nosso modelo ou um personalizado para o seu espaço.</p></div>
            <div><span>03</span><h2>Sem custo</h2><p>Você não paga o móvel nem a instalação.</p></div>
          </section>

          <section className="sh-steps" aria-labelledby="sh-como">
            <h2 id="sh-como">Como funciona</h2>
            <ol>
              <li><b>1</b>Você pede</li>
              <li><b>2</b>A gente conversa</li>
              <li><b>3</b>Fabricamos</li>
              <li><b>4</b>Instalamos</li>
            </ol>
          </section>

          <section className="sh-deal">
            <p className="chap-label">Em troca</p>
            <p className="sh-deal-t">Só uma coisa: a Luzcor na sua lista de orçamentos.</p>
            <p>Mande seus projetos para a gente orçar. Fechar é sempre escolha sua.</p>
          </section>

          <section className="sh-end">
            <p className="sh-vagas">Vagas limitadas · Telêmaco Borba, Ponta Grossa e Campos Gerais</p>
            <div className="p-cta">
              <a className="btn" href={wa(SHOWROOM_MSG)} target="_blank" rel="noopener">Quero no meu escritório</a>
              <a className="btn btn-line" href={MAIL('Showroom de luz técnica no meu escritório')}>Pedir por e-mail</a>
            </div>
          </section>
        </main>
        <Footer />
      </>
    ),
  },
  {
    path: 'perguntas-frequentes/',
    crumb: 'Perguntas frequentes',
    title: 'Perguntas frequentes | Luzcor Iluminação, Telêmaco Borba',
    desc: 'Endereço, horário, região atendida, material elétrico, peças sob medida, consultoria e parceria com arquitetos: as respostas sobre a Luzcor Iluminação.',
    faq: true,
    body: () => (
      <Shell
        crumb="Perguntas frequentes"
        kicker="Dúvidas"
        h1="Perguntas frequentes sobre a Luzcor"
        lead="O que mais nos perguntam antes de visitar a loja ou começar um projeto."
      >
        <section className="p-sec p-faq">
          {FAQ.map((f) => (
            <div key={f.q}>
              <h2>{f.q}</h2>
              <p>{f.a}</p>
            </div>
          ))}
        </section>
      </Shell>
    ),
  },
];

export { SITE };
