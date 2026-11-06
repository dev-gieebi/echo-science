import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Blog from './pages/Blog.jsx';
import Article from './pages/Article.jsx';
import NotFound from './pages/NotFound.jsx';
import { AboutPage, ActivitiesPage, AdhesionPage, ContactPage, MissionsPage, TeamPage } from './pages/Pages.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/activites" element={<ActivitiesPage />} />
          <Route path="/equipe" element={<TeamPage />} />
          <Route path="/adhesion" element={<AdhesionPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Article />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
