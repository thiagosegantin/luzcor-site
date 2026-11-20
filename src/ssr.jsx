import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { PAGES } from './pages.jsx';
export const render = () => renderToString(<App />);
export const pages = PAGES.map((p) => ({ ...p, html: renderToString(p.body()) }));
