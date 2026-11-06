import { useState } from 'react';
import { MEMBER_TYPES } from '../data/content.js';
import { SITE } from '../lib/config.js';
import { sendAdhesion, sendContact } from '../lib/api.js';
import { useFormSubmit, FormStatus } from './FormStatus.jsx';
import { Icon } from './Icons.jsx';

// Champ à étiquette flottante
function Field({ label, name, type = 'text', as = 'input', value, onChange, required, idSuffix = '', children, ...rest }) {
  const Tag = as;
  const id = `f-${name}-${idSuffix}`;
  return (
    <div className={`field${as === 'textarea' ? ' field--area' : ''}${as === 'select' ? ' field--select' : ''}`}>
      <Tag id={id} name={name} type={as === 'input' ? type : undefined} value={value}
        onChange={(e) => onChange(name, e.target.value)} required={required} placeholder=" " {...rest}>
        {children}
      </Tag>
      <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
    </div>
  );
}

const Honeypot = () => (
  <input type="text" name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
);

function useFields(initial) {
  const [values, setValues] = useState(initial);
  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }));
  const reset = () => setValues(initial);
  return [values, set, reset];
}

/* ---------- Adhésion ---------- */
const ADHESION_INIT = { name: '', email: '', phone: '', category: 'actif', profession: '', message: '' };

export function Adhesion() {
  const [v, set, reset] = useFields(ADHESION_INIT);
  const { status, message, submit } = useFormSubmit(sendAdhesion);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (e.currentTarget.website.value) return;
    const ok = await submit(v, 'Merci ! Votre demande d’adhésion a bien été reçue. Nous revenons vers vous très vite.');
    if (ok) reset();
  };

  return (
    <section className="section adhesion" id="adhesion" aria-labelledby="adhesion-title">
      <div className="container">
        <div className="adhesion__box" data-reveal>
          <div className="blob blob--1" aria-hidden="true" />
          <div className="blob blob--2" aria-hidden="true" />
          <div className="blob blob--3" aria-hidden="true" />
          <div className="adhesion__grid">
            <div className="adhesion__intro">
              <p className="eyebrow eyebrow--light">Adhésion</p>
              <h2 className="h2 h2--light" id="adhesion-title">Rejoignez le mouvement.</h2>
              <p>Chercheur, enseignant, étudiant, ingénieur ou simple curieux : votre place est parmi nous.</p>
              <ul className="member-types">
                {MEMBER_TYPES.map((m) => (
                  <li key={m.title}><Icon name="check" size={18} /><div><strong>{m.title}</strong><span>{m.text}</span></div></li>
                ))}
              </ul>
              <div className="fee">
                <span className="mono">Droit d'adhésion</span>
                <strong>{SITE.membershipFee}</strong>
              </div>
            </div>
            <form className="form form--glass" onSubmit={onSubmit}>
              <div className="form__row">
                <Field label="Nom complet" name="name" value={v.name} onChange={set} required autoComplete="name" maxLength={120} />
                <Field label="E-mail" name="email" type="email" value={v.email} onChange={set} required autoComplete="email" idSuffix="adh" />
              </div>
              <div className="form__row">
                <Field label="Téléphone" name="phone" type="tel" value={v.phone} onChange={set} autoComplete="tel" maxLength={30} />
                <Field label="Profession" name="profession" value={v.profession} onChange={set} maxLength={120} />
              </div>
              <fieldset className="radio-group">
                <legend>Catégorie de membre</legend>
                {[{ k: 'actif', l: 'Membre actif' }, { k: 'bienfaiteur', l: 'Membre bienfaiteur' }].map((o) => (
                  <label key={o.k} className={`radio${v.category === o.k ? ' is-checked' : ''}`}>
                    <input type="radio" name="category" value={o.k} checked={v.category === o.k} onChange={() => set('category', o.k)} />
                    {o.l}
                  </label>
                ))}
              </fieldset>
              <Field label="Votre motivation" name="message" as="textarea" rows={3} value={v.message} onChange={set} maxLength={2000} idSuffix="adh" />
              <Honeypot />
              <button className="btn btn--white btn--block magnetic" disabled={status === 'loading'}>
                {status === 'loading' ? <span className="spinner" aria-hidden="true" /> : null}
                {status === 'loading' ? 'Envoi…' : 'Envoyer ma demande'}
              </button>
              <FormStatus status={status} message={message} />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */
const CONTACT_INIT = { name: '', email: '', subject: '', message: '' };

export function Contact() {
  const [v, set, reset] = useFields(CONTACT_INIT);
  const { status, message, submit } = useFormSubmit(sendContact);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (e.currentTarget.website.value) return;
    const ok = await submit(v, 'Merci ! Votre message a bien été envoyé.');
    if (ok) reset();
  };

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div className="contact__info" data-reveal>
          <p className="eyebrow">Contact</p>
          <h2 className="h2" id="contact-title">Parlons science.</h2>
          <p>Une question, une idée de partenariat, une proposition d'intervention ? Écrivez-nous.</p>
          <ul className="contact__list">
            <li><span className="contact__icon"><Icon name="pin" /></span><div><span className="mono">Adresse</span>{SITE.address}</div></li>
            <li><span className="contact__icon"><Icon name="mail" /></span><div><span className="mono">E-mail</span><a href={`mailto:${SITE.email}`}>{SITE.email}</a></div></li>
            <li><span className="contact__icon"><Icon name="phone" /></span><div><span className="mono">Téléphone</span><a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{SITE.phone}</a></div></li>
          </ul>
        </div>
        <form className="form" onSubmit={onSubmit} data-reveal style={{ '--d': '120ms' }}>
          <div className="form__row">
            <Field label="Nom" name="name" value={v.name} onChange={set} required autoComplete="name" maxLength={120} idSuffix="ct" />
            <Field label="E-mail" name="email" type="email" value={v.email} onChange={set} required autoComplete="email" idSuffix="ct" />
          </div>
          <Field label="Sujet" name="subject" value={v.subject} onChange={set} required maxLength={160} />
          <Field label="Message" name="message" as="textarea" rows={5} value={v.message} onChange={set} required maxLength={5000} idSuffix="ct" />
          <Honeypot />
          <button className="btn btn--blue btn--block magnetic" disabled={status === 'loading'}>
            {status === 'loading' ? <span className="spinner" aria-hidden="true" /> : null}
            {status === 'loading' ? 'Envoi…' : <>Envoyer le message <Icon name="arrow" size={18} /></>}
          </button>
          <FormStatus status={status} message={message} />
        </form>
      </div>
    </section>
  );
}
