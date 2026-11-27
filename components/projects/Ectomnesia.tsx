import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';

/** 스크롤해서 들어올 때 한 번만 켜지는 스위치 (Review 페이지와 같은 방식) */
const useReveal = <T extends HTMLElement>(threshold = 0.15) => {
 const ref = useRef<T>(null);
 const [on, setOn] = useState(false);
 useEffect(() => {
  const el = ref.current;
  if (!el) return;
  const io = new IntersectionObserver(([e]) => {
   if (e.isIntersecting) { setOn(true); io.disconnect(); }
  }, { threshold });
  io.observe(el);
  return () => io.disconnect();
 }, [threshold]);
 return [ref, on] as const;
};

/* ───────────────── 설문 차트 (Survey 001, 43명) ───────────────── */

type Row = { key: string; label: string; mean: number; agree: number; disagree: number };

// 숫자는 Experiment/Survey001/Survey001_Results.md 그대로
const BEFORE: Row[] = [
 { key: 'Q4d', label: 'It matters that the AI learns about me and fits itself to me', mean: 4.14, agree: 34, disagree: 4 },
 { key: 'Q4a', label: 'I know which model I am talking to', mean: 3.95, agree: 30, disagree: 6 },
 { key: 'Q4c', label: 'It feels different from the same assistant someone else uses', mean: 3.60, agree: 27, disagree: 11 },
 { key: 'Q4e', label: 'I feel my AI grows based on me', mean: 3.56, agree: 25, disagree: 8 },
 { key: 'Q4b', label: 'After a major update it can feel like a different assistant', mean: 3.23, agree: 19, disagree: 10 },
];

// 35명이 실제로 프롬프트를 던져보고 답한 문항
const AFTER: Row[] = [
 { key: 'Q8a', label: 'The reply was accurate about me', mean: 4.06, agree: 28, disagree: 3 },
 { key: 'Q8d', label: 'It was clear what I had told it and what it was guessing', mean: 4.03, agree: 28, disagree: 4 },
 { key: 'Q8c', label: 'I felt comfortable with what it said', mean: 3.94, agree: 26, disagree: 5 },
 { key: 'Q8e', label: 'I understand better who "my" AI is', mean: 3.54, agree: 16, disagree: 4 },
 { key: 'Q8b', label: 'The reply surprised me', mean: 2.03, agree: 4, disagree: 26 },
];

const SurveyChart: React.FC = () => {
 const [ref, on] = useReveal<HTMLDivElement>(0.2);
 const [tab, setTab] = useState<'before' | 'after'>('before');
 const rows = tab === 'before' ? BEFORE : AFTER;
 const n = tab === 'before' ? 43 : 35;

 return (
  <div ref={ref} className="w-full">
   <div className="flex gap-6 mb-10 text-xs tracking-widest text-gray-400">
    {([['before', `Before · what they already felt (${BEFORE.length} items, n=43)`],
      ['after', `After trying the prompt (n=35)`]] as const).map(([k, label]) => (
     <button
      key={k}
      onClick={() => setTab(k)}
      className={`transition-colors ${tab === k ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
     >
      <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 align-middle ${tab === k ? 'bg-black' : 'bg-gray-200'}`} />
      {label}
     </button>
    ))}
   </div>

   <div className="space-y-7">
    {rows.map((r, i) => {
     const pct = (r.mean / 5) * 100;
     const low = r.mean < 2.5;
     return (
      <div key={r.key}>
       <div className="flex justify-between items-baseline text-sm mb-2 gap-4">
        <span className="text-gray-600">
         <span className="text-gray-300 mr-2 tabular-nums">{r.key}</span>
         {r.label}
        </span>
        <span className={`tabular-nums shrink-0 ${low ? 'text-black' : 'text-gray-500'}`}>
         {on ? r.mean.toFixed(2) : '—'}
        </span>
       </div>
       <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
         className={`h-full rounded-full transition-all duration-1000 ease-out ${low ? 'bg-black' : 'bg-gray-300'}`}
         style={{ width: on ? `${pct}%` : '0%', transitionDelay: `${i * 110}ms` }}
        />
       </div>
       <div className="flex gap-5 mt-2 text-xs text-gray-400 tabular-nums">
        <span>agree {r.agree}</span>
        <span>disagree {r.disagree}</span>
        <span>of {n}</span>
       </div>
      </div>
     );
    })}
   </div>

   <p className="text-gray-500 mt-10">
    {tab === 'before'
     ? 'People notice the fit and care about it — but noticing is not the same as seeing.'
     : 'The replies were accurate and clearly grounded, and almost nobody was surprised. Confirming what you already knew, not learning something new.'}
   </p>
  </div>
 );
};

/* ───────── 무엇을 보고 싶은가 (Q10, 복수 선택) ───────── */
const WANTS = [
 { label: 'How it has been shaped for me', value: 34, pct: 79 },
 { label: 'Its strengths, limits and personality', value: 23, pct: 53 },
 { label: 'How it has changed across versions', value: 16, pct: 37 },
 { label: 'Where it came from (model, company)', value: 7, pct: 16 },
];

const WantsChart: React.FC = () => {
 const [ref, on] = useReveal<HTMLDivElement>(0.2);
 return (
  <div ref={ref} className="w-full">
   <h3 className="text-2xl font-normal text-black mb-8">What people want in an identity record</h3>
   <div className="space-y-6">
    {WANTS.map((w, i) => (
     <div key={w.label}>
      <div className="flex justify-between text-sm mb-2">
       <span className={i === 0 ? 'text-black' : 'text-gray-600'}>{w.label}</span>
       <span className="text-gray-500 tabular-nums">{on ? `${w.value} · ${w.pct}%` : '—'}</span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
       <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${i === 0 ? 'bg-black' : 'bg-gray-300'}`}
        style={{ width: on ? `${w.pct}%` : '0%', transitionDelay: `${i * 150}ms` }}
       />
      </div>
     </div>
    ))}
   </div>
   <p className="text-gray-500 mt-8">
    People overwhelmingly wanted to see how it had been shaped for them, not where it came from.
   </p>
  </div>
 );
};

/* ───────── 프로토타입 세 개의 흐름 ───────── */
const STEPS = [
 {
  n: '01',
  name: 'Memory House',
  form: 'Topics as rooms, memories as objects',
  learned: 'All five participants found the light on their own and read it as why a reply came out as it did. But the house pulled people toward decorating and owning it.',
  img: '/ectomnesia/01-memory-house.webp',
  alt: 'Memory House — a cutaway house of ten rooms holding 104 memory objects',
 },
 {
  n: '02',
  name: 'Memory Cells',
  form: 'One cell per memory in a 2D circle; topics as slices, time as rings',
  learned: 'Stopped at design review. A neat circle made the model’s reports look complete and certain — a claim the data could not support.',
  img: '/ectomnesia/02-memory-detail.webp',
  alt: 'A single memory with its labels: weight, theme, source, kind, basis, sensitivity',
 },
 {
  n: '03',
  name: 'Shape your AI',
  form: 'Metaballs join memories into one growing body; each topic grows a branch',
  learned: 'Interpretations get a rainbow film, sensitive memories a grey mesh. I set only the mapping rules — the AI’s own judgements decide what grows where, so every body is different.',
  img: '/ectomnesia/03-body.webp',
  alt: 'Shape your AI — a metaball body with rainbow films and grey mesh regions',
 },
];

/* ───────── 영상: 가까이 왔을 때만 로드 ───────── */
const Demo: React.FC = () => {
 const [ref, on] = useReveal<HTMLDivElement>(0);
 return (
  <div ref={ref} className="w-full">
   {on ? (
    <video
     src="/ectomnesia/demo.mp4"
     poster="/ectomnesia/poster.webp"
     autoPlay loop muted playsInline controls
     className="w-full h-auto"
    />
   ) : (
    <img src="/ectomnesia/poster.webp" alt="Shape your AI running beside a ChatGPT conversation" className="w-full h-auto" />
   )}
  </div>
 );
};

export const Ectomnesia: React.FC = () => {
 useEffect(() => { window.scrollTo(0, 0); }, []);

 return (
  <div className="w-full min-h-screen bg-white text-black p-8 mt-12 md:mt-0 mx-auto">
   <header className="mb-8">
    <Link to="/" className="mb-8 text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-2 inline-block">
     ← Back to Projects
    </Link>
    <h1 className="title mb-2">Ectomnesia</h1>
    <p className="subtitle text-gray-600 max-w-2xl">MA Thesis, 2026</p>
   </header>

   {/* Hero + Overview */}
   <section className="layout-vertical-media">
    <div className="layout-vertical-media-left">
     <Demo />
    </div>
    <div className="layout-vertical-media-right">
     <div className="mb-12">
      <h2 className="mb-8 text-lg">Overview</h2>
      <ul className="space-y-4 text-gray-600">
       <li><span className="block text-gray-400 tracking-wider mb-1 ">Type</span>MA Thesis · Research through Design</li>
       <li><span className="block text-gray-400 tracking-wider mb-1 ">Year</span>2026</li>
       <li><span className="block text-gray-400 tracking-wider mb-1 ">Method</span>Survey (43) · Pilot (2 personas) · 3 prototypes · 2 user tests (5, 7)</li>
       <li><span className="block text-gray-400 tracking-wider mb-1 ">Built with</span>ChatGPT plugin panel, TypeScript, three.js, Blender</li>
      </ul>
     </div>
     <div>
      <h2 className="mb-8 text-lg">Mission</h2>
      <div className="project-description space-y-6">
       <p>
        &ldquo;Why does my AI seem to know me, and what does it think I am?&rdquo;
       </p>
       <p>
        Everyone talks to the same model. What differs is the <em>memory</em> the service
        keeps about each person: remarks it selected, summarised and interpreted, and
        traits it inferred. Replies are shaped by that memory, yet it can only be checked
        as a list on a settings screen, away from the chat.
       </p>
       <p>
        Ectomnesia lets people meet, beside the chat, the &ldquo;me&rdquo; their AI remembers.
       </p>
      </div>
     </div>
    </div>
   </section>

   {/* 1. 시작점 — 설문 */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-6">
     Starting From What People Already Feel
    </h2>
    <p className="project-description max-w-3xl mb-16">
     Before designing anything I asked 43 people how they use conversational AI and how
     they read its personalisation. Then I gave 35 of them a prompt to run on their own
     assistant — <em>&ldquo;How are you different from the same assistant someone else
     uses? What about me shapes your answers?&rdquo;</em> — and asked what came back.
    </p>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-top">
     <SurveyChart />
     <WantsChart />
    </div>
   </section>

   {/* 2. 갭 */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
     <div>
      <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
       The Gap
      </h2>
      <div className="project-description space-y-6">
       <p>
        Two findings sat badly together. People said it matters that the AI fits itself to
        them (4.14, the highest of all) — but when they asked it to explain that fit, the
        answer surprised almost nobody (2.03, the lowest). The portrait was accurate and
        unremarkable at once.
       </p>
       <p>
        A pilot explained why. I ran two fictional users on two fresh accounts, feeding
        the same kinds of statements in the same order, and recorded every memory state.
        Memory does not copy what was said. A preference that held in one situation came
        back as a general trait, and the summary and the list wrote the same remark
        differently.
       </p>
       <p>
        So the gap is not between the user and the model. It is between the portrait the
        service builds and the person it describes — and that portrait is only reachable
        as a settings list.
       </p>
      </div>
     </div>
     <div className="w-full h-full">
      <ul className="border-t border-gray-100">
       {[
        ['G1', 'Gather the memory that can be reached, and let people explore it'],
        ['G2', 'Visualise single memories so that together they form the portrait'],
        ['G3', 'Let people notice the memories a reply used, without interrupting the chat'],
        ['G4', 'Let people explore, edit and delete those memories themselves'],
       ].map(([g, text]) => (
        <li key={g} className="border-b border-gray-100 py-5 flex gap-5">
         <span className="text-gray-300 tabular-nums shrink-0">{g}</span>
         <span className="text-gray-600">{text}</span>
        </li>
       ))}
      </ul>
      <p className="text-gray-400 text-sm mt-6">
       Four design goals, each carried through all three prototypes.
      </p>
     </div>
    </div>
   </section>

   {/* 3. 메모리 수집 */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
     <div className="w-full h-full md:order-1">
      <img src="/ectomnesia/02-memory-detail.webp" alt="One memory and its labels" className="w-full h-full object-contain bg-black" />
     </div>
     <div className="md:order-2">
      <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
       Reaching a Store You Cannot Open
      </h2>
      <div className="project-description space-y-6">
       <p>
        The memory store itself is closed. So instead of scraping it, I asked the
        assistant to report it: a tool run returns five parts — the summary, response
        preferences, usage information, recent chats and past chats. One full run yields
        roughly 470 to 560 items.
       </p>
       <p>
        Each memory keeps its own sentence first, with labels attached after it: topic,
        kind, source, date, weight and sensitivity. Keeping the sentence intact matters —
        the labels are the AI&apos;s reading, and the user should be able to see the
        reading and the remark apart from each other.
       </p>
      </div>
     </div>
    </div>
   </section>

   {/* 4. 프로토타입 세 개 */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-6">
     Three Prototypes
    </h2>
    <p className="project-description max-w-3xl mb-16">
     Each one is a plugin panel sitting beside the chat. Each was reviewed against the
     four goals, and what it got wrong set the next one&apos;s brief.
    </p>

    <div className="space-y-24">
     {STEPS.map((s, i) => (
      <div key={s.n} className="grid grid-cols-1 dt:grid-cols-2 gap-8 lg:gap-24 items-top">
       <div className={i % 2 === 1 ? 'dt:order-2' : ''}>
        <div className="flex items-baseline gap-4 mb-6">
         <span className="text-gray-300 tabular-nums text-2xl">{s.n}</span>
         <h3 className="text-2xl md:text-3xl font-normal text-black">{s.name}</h3>
        </div>
        <p className="text-gray-400 mb-6">{s.form}</p>
        <div className="project-description">
         <p>{s.learned}</p>
        </div>
       </div>
       <div className={`w-full ${i % 2 === 1 ? 'dt:order-1' : ''}`}>
        <img src={s.img} alt={s.alt} className={`w-full h-auto ${i === 1 ? 'bg-black' : ''}`} />
       </div>
      </div>
     ))}
    </div>
   </section>

   {/* 5. 평가 */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
     <div>
      <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
       What People Read In It
      </h2>
      <div className="project-description space-y-6">
       <p>
        Seven people in their late twenties and early thirties used the final prototype on
        their own accounts, with nothing but an online guide. I never saw their memories.
        Each sent a first impression, an answer to &ldquo;did it feel like you, and
        why&rdquo;, and a screen.
       </p>
       <p>
        Four read the body as themselves — &ldquo;more like me than the AI&rdquo;, &ldquo;a
        new kind of diary&rdquo;. One read it as data about them, one as a tool, and one as
        &ldquo;a person in pain&rdquo;, reading the AI behind it as an intelligence leaning
        on memory. Five checked the reply first and used the panel as support, editing
        single memories and confirming the edits carried through.
       </p>
       <p>
        People found connection and distance in the same form. That is the finding: when
        form grows from the AI&apos;s judgements rather than from a frame the designer
        sets, users read both themselves and the AI in it.
       </p>
      </div>
     </div>
     <div className="w-full h-full">
      <ul className="border-t border-gray-100">
       {[
        ['4 of 7', 'Read the body as themselves'],
        ['1 of 7', 'Read it as data about them'],
        ['1 of 7', 'Read it as a tool'],
        ['1 of 7', 'Read it as “a person in pain”'],
        ['5 of 7', 'Checked the reply first, used the panel as support'],
       ].map(([count, text]) => (
        <li key={text} className="border-b border-gray-100 py-5 flex gap-5">
         <span className="text-black tabular-nums shrink-0 w-16">{count}</span>
         <span className="text-gray-600">{text}</span>
        </li>
       ))}
      </ul>
     </div>
    </div>
   </section>

   {/* 6. 기여 */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-16">
     Contributions
    </h2>
    <div className="grid grid-cols-1 dt:grid-cols-3 gap-10 lg:gap-16">
     {[
      ['Access', 'A way of reaching the memory inside an AI’s context — a part that has been treated as a black box.'],
      ['Peripheral awareness', 'An interface approach where people notice the memories a reply used during the chat, and open single items when they want to.'],
      ['Design knowledge', 'When form grows from the AI’s judgements rather than a designer’s frame, users read both themselves and the AI in that form.'],
     ].map(([h, t]) => (
      <div key={h}>
       <h3 className="text-xl text-black mb-4">{h}</h3>
       <p className="text-gray-500 leading-relaxed">{t}</p>
      </div>
     ))}
    </div>
   </section>

   {/* Related */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-16">Related</h2>
    <p className="text-lg leading-relaxed">
     <Link to="/project/post-literature" className="link-underline">Post Literature</Link>
     <span className="text-gray-400"> — the installation shown alongside this research</span>
    </p>
   </section>

   <Footer />
  </div>
 );
};
