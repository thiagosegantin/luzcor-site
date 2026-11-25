export const SITE = 'https://www.luzcor.com.br/';
export const WHATS = '554232731964';
export const EMAIL = 'luzcortb@gmail.com';
export const PHONE_TXT = '(42) 3273-1964';
export const PHONE_TEL = '+554232731964';
export const ADDRESS = {
  street: 'Rua Professora Edith Gordan, 270',
  district: 'Centro',
  city: 'Telêmaco Borba',
  uf: 'PR',
  cep: '84261-230',
};
export const MAPS =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Luzcor Iluminação, Rua Professora Edith Gordan, 270, Centro, Telêmaco Borba - PR');
export const REVIEWS = 'https://www.google.com/maps/place/?q=place_id:ChIJFfarNg2D6ZQRhCiCjMN6bbM';
export const INSTAGRAM = 'https://www.instagram.com/luzcor.tb/';
export const PINTEREST = 'https://br.pinterest.com/luzcortb/';
export const HOURS = [
  ['Segunda a sexta', '8h às 18h'],
  ['Sábado', '8h às 13h'],
  ['Domingo', 'Fechado'],
];

export const wa = (text) => `https://wa.me/${WHATS}?text=${encodeURIComponent(text)}`;

export const GROUPS = {
  deco: 'Iluminação decorativa',
  tec: 'Iluminação técnica e LED',
  ext: 'Iluminação externa',
  comp: 'Lâmpadas e complementos',
};

export const PRODUCTS = [
  { id: 'lustres', g: 'deco', icon: 'lustre', name: 'Lustres', text: 'Peças de destaque para salas de jantar, halls e pés-direitos duplos. A joia do ambiente.' },
  { id: 'pendentes', g: 'deco', icon: 'pendente', name: 'Pendentes', text: 'Sobre ilhas, bancadas e mesas, em composição ou peça única, do minimalista ao escultural.' },
  { id: 'arandelas', g: 'deco', icon: 'arandela', name: 'Arandelas', text: 'Luz de parede interna e externa para corredores, cabeceiras, escadas, varandas e fachadas.' },
  { id: 'spots', g: 'tec', icon: 'spot', name: 'Spots embutidos e de sobrepor', text: 'Luz de destaque e de efeito, direcionável, para forro de gesso, laje e marcenaria.' },
  { id: 'trilhos', g: 'tec', icon: 'trilho', name: 'Trilhos eletrificados', text: 'Liberdade para mover e reorientar a luz sem obra. Ideal para salas, lojas e galerias.' },
  { id: 'perfis', g: 'tec', icon: 'perfil', name: 'Perfis e fitas de LED', text: 'Linhas de luz em sancas, nichos, marcenaria, rodapés e escadas, em vários tipos e medidas.' },
  { id: 'plafons', g: 'tec', icon: 'plafon', name: 'Plafons', text: 'Luz geral discreta e eficiente, de embutir ou sobrepor, para todos os cômodos.' },
  { id: 'abajures', g: 'deco', icon: 'abajur', name: 'Luminárias de mesa, piso e abajures', text: 'Luz de leitura e de aconchego, que acompanha a decoração e muda de lugar com ela.' },
  { id: 'externa', g: 'ext', icon: 'externa', name: 'Iluminação externa', text: 'Refletores, balizadores, espetos e luminárias urbanas para fachadas, jardins e áreas abertas.' },
  { id: 'lampadas', g: 'comp', icon: 'lampada', name: 'Lâmpadas', text: 'LED, alta potência e especiais, na temperatura de cor certa para cada ambiente.' },
  { id: 'tomadas', g: 'comp', icon: 'interruptor', name: 'Interruptores e tomadas', text: 'Acabamentos que acompanham o padrão do projeto, do clássico ao contemporâneo.' },
  { id: 'eletrico', g: 'comp', icon: 'interruptor', name: 'Material elétrico', text: 'Fios, cabos, disjuntores, fontes e drivers de LED e o que mais a instalação precisar, junto com a iluminação.' },
  { id: 'medida', g: 'deco', icon: 'pendente', name: 'Peças sob medida (ateliê)', text: 'Pendentes, perfis de LED e composições produzidos no tamanho exato do projeto, como um perfil de LED de 5 metros inteiro.' },
];

export const ROOMS = [
  { name: 'Sala de estar', k: '2700K – 3000K', tip: 'Luz em camadas: geral suave, indireta em sancas ou perfis e um abajur para leitura. Dimerizar faz toda a diferença.' },
  { name: 'Sala de jantar', k: '2700K – 3000K', tip: 'O pendente ou lustre manda na cena. Centralize na mesa, a cerca de 75 a 85 cm do tampo, sem ofuscar quem está sentado.' },
  { name: 'Cozinha', k: '3000K – 4000K', tip: 'Luz geral bem distribuída e luz de tarefa sob os armários com perfil de LED, sem sombra na bancada.' },
  { name: 'Quartos', k: '2700K', tip: 'Luz indireta e quente para descansar, com arandelas ou pendentes de cabeceira para ler sem acordar ninguém.' },
  { name: 'Banheiro e lavabo', k: '3000K – 4000K', tip: 'Luz frontal no espelho e IRC alto (90 ou mais) para ver as cores da pele como elas são.' },
  { name: 'Área gourmet e varanda', k: '2700K – 3000K', tip: 'Pendentes sobre a bancada e arandelas com grau de proteção adequado ao tempo.' },
  { name: 'Fachada e jardim', k: '2700K – 3000K', tip: 'Balizadores, espetos e refletores com proteção IP65 ou mais valorizam a arquitetura à noite.' },
  { name: 'Lojas e escritórios', k: '3000K – 4000K', tip: 'Trilhos e spots com IRC alto para destacar produtos, e luz geral confortável para quem trabalha.' },
];

export const STEPS = [
  { t: 'Conversa', d: 'Entendemos o projeto, a planta, o estilo e como cada ambiente vai ser usado.' },
  { t: 'Projeto luminotécnico', d: 'Definimos os pontos de luz, os efeitos e a temperatura de cor de cada ambiente.' },
  { t: 'Escolha das peças', d: 'Você escolhe no showroom, com as luminárias de perto, e com orientação técnica.' },
  { t: 'Execução', d: 'Compra integrada e indicação de eletricistas parceiros para a instalação.' },
];

export const CITIES = [
  { n: 'Telêmaco Borba', lat: -24.324, lon: -50.616, main: true },
  { n: 'Ponta Grossa', lat: -25.095, lon: -50.162, big: true },
  { n: 'Castro', lat: -24.791, lon: -50.012 },
  { n: 'Carambeí', lat: -24.952, lon: -50.097 },
  { n: 'Tibagi', lat: -24.509, lon: -50.414 },
  { n: 'Imbaú', lat: -24.448, lon: -50.753 },
  { n: 'Reserva', lat: -24.65, lon: -50.846 },
  { n: 'Ortigueira', lat: -24.208, lon: -50.949 },
  { n: 'Curiúva', lat: -24.033, lon: -50.458 },
  { n: 'Ventania', lat: -24.246, lon: -50.243 },
];

export const TESTIMONIALS = [
  { n: 'Lavínia Souto', t: 'Ótima! Ambiente e atendimento superou minhas expectativas.' },
  { n: 'João Henrique Matos', t: 'Espetacular, além de uma loja linda tem tudo que você precisa em iluminação.' },
  { n: 'Luiz Nascimento', t: 'Loja completa de iluminação e atendimento VIP.' },
];

export const FAQ = [
  {
    q: 'Sou arquiteto(a). Como envio um projeto para a Luzcor orçar?',
    a: 'Envie o projeto pelo WhatsApp (42) 3273-1964 ou pelo e-mail luzcortb@gmail.com: planta luminotécnica, PDF, DWG ou uma lista de pontos e peças. A Luzcor devolve em até 2 dias úteis o orçamento da iluminação e do material elétrico juntos, com alternativas por faixa de preço e peças sob medida do ateliê quando o projeto pedir. Atendemos escritórios de Telêmaco Borba, Ponta Grossa e de todos os Campos Gerais.',
  },
  {
    q: 'A Luzcor entrega em Ponta Grossa e em outras cidades?',
    a: 'Sim. A Luzcor entrega na obra em Ponta Grossa, Castro, Carambeí, Tibagi, Imbaú, Reserva, Curiúva, Ortigueira, Ventania, Curitiba e em toda a região, quantas vezes a obra precisar. Orçamento, aprovação, pagamento e entrega se resolvem à distância, pelo WhatsApp (42) 3273-1964, sem precisar ir à loja. O frete é grátis para pedidos acima de um valor mínimo, informado no orçamento.',
  },
  {
    q: 'Onde fica a Luzcor Iluminação?',
    a: 'A Luzcor fica na Rua Professora Edith Gordan, 270, no Centro de Telêmaco Borba, Paraná (CEP 84261-230). O showroom abre de segunda a sexta, das 8h às 18h, e aos sábados, das 8h às 13h.',
  },
  {
    q: 'A Luzcor atende Ponta Grossa e outras cidades dos Campos Gerais?',
    a: 'Sim. A Luzcor atende clientes, arquitetos e obras de Telêmaco Borba, Ponta Grossa e de toda a região dos Campos Gerais, como Castro, Carambeí, Tibagi, Imbaú, Reserva, Ortigueira, Curiúva e Ventania. O primeiro atendimento e os orçamentos podem ser feitos pelo WhatsApp (42) 3273-1964.',
  },
  {
    q: 'A Luzcor faz projeto luminotécnico?',
    a: 'Sim. A consultoria de iluminação é conduzida por Thiago Segantin, especialista em projetos luminotécnicos. Ela inclui o planejamento dos pontos de luz, a escolha das temperaturas de cor e a seleção das luminárias para cada ambiente.',
  },
  {
    q: 'Que produtos a Luzcor vende?',
    a: 'Lustres, pendentes, arandelas internas e externas, spots embutidos e de sobrepor, trilhos eletrificados, perfis e fitas de LED, plafons, luminárias de mesa e de piso, abajures, refletores e iluminação externa, lâmpadas LED e de alta potência, além de interruptores e tomadas. Para casas, lojas, escritórios e obras.',
  },
  {
    q: 'A Luzcor tem material elétrico?',
    a: 'Sim. A Luzcor é uma das poucas lojas de iluminação da região que também vende material elétrico, como fios, cabos, disjuntores, fontes e drivers de LED. Assim a iluminação e a parte elétrica do projeto saem no mesmo lugar.',
  },
  {
    q: 'A Luzcor faz luminárias sob medida?',
    a: 'Sim. Além de loja, a Luzcor funciona como um ateliê de iluminação e produz peças personalizadas para projetos específicos, como um perfil de LED de 5 metros inteiro ou um pendente no comprimento exato da mesa.',
  },
  {
    q: 'Como a Luzcor trabalha com arquitetos?',
    a: 'A Luzcor foi pensada para trabalhar com arquitetos, inclusive de Ponta Grossa e de outras cidades dos Campos Gerais. Oferece consultoria de iluminação para o arquiteto e para o cliente dele, apresenta projeto luminotécnico quando o escritório precisa, desenvolve soluções técnicas, produz peças sob medida e tem condições especiais para parceiros. Eletricistas também têm condições especiais e treinamentos.',
  },
  {
    q: 'Qual a melhor temperatura de cor para casa?',
    a: 'Para salas e quartos, luz quente entre 2700K e 3000K deixa o ambiente aconchegante. Em cozinhas, banheiros e áreas de trabalho, 3000K a 4000K ajuda na visibilidade. O ideal é combinar luz geral, luz de destaque e luz indireta; a equipe da Luzcor ajuda a definir isso para o seu projeto.',
  },
];

// Coleção em destaque no site conceito (as luminárias que acendem com o fio)
export const COLLECTION = [
  { id: 'lustres', lamp: 'lustre', name: 'Lustres', text: 'O centro da cena. Peças de presença para salas de jantar, halls e pés-direitos duplos.' },
  { id: 'pendentes', lamp: 'pendente', name: 'Pendentes', text: 'Sobre a ilha, a bancada ou a mesa. De linhas simples a peças esculturais, também no comprimento exato que o projeto pede.' },
  { id: 'arandelas', lamp: 'arandela', name: 'Arandelas', text: 'A parede ganha luz: corredores, cabeceiras, escadas, varandas e fachadas.' },
  { id: 'spots', lamp: 'trilho', name: 'Spots e trilhos', text: 'Luz que aponta. Destaque para a arte, a textura, a marcenaria, o detalhe.' },
  { id: 'perfis', lamp: 'perfil', name: 'Perfis e fitas de LED', text: 'Linhas de luz em sancas, nichos, rodapés e marcenaria, cortadas na medida do projeto.' },
  { id: 'externa', lamp: 'lanterna', name: 'Iluminação externa', text: 'A arquitetura também vive à noite: jardins, fachadas, piscinas e varandas.' },
];
