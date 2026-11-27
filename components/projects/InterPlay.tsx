import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';

/**
 * 시드로 로고가 달라지는 것을 페이지 안에서 보여주는 작은 데모.
 * 실제 생성기(generator.html)의 픽셀 변형을 그대로 옮긴 것은 아니고,
 * "같은 글자가 시드마다 다르게 흐트러진다"는 규칙만 재현한다.
 */
const SeedLogo: React.FC = () => {
 const OFFICIAL_SEED = 72228804;
 const [seed, setSeed] = React.useState(OFFICIAL_SEED);

 // 시드 하나로 결정되는 난수 (같은 시드 -> 항상 같은 모양)
 const rand = (n: number) => {
  const x = Math.sin(seed * 9301 + n * 49297) * 233280;
  return x - Math.floor(x);
 };

 const letters = 'InterPlay'.split('');

 return (
  <div className="w-full">
   <div className="border border-gray-100 bg-white px-6 py-14 flex items-center justify-center overflow-hidden">
    <div className="flex" aria-label="InterPlay">
     {letters.map((ch, i) => (
      <span
       key={i}
       className="text-4xl md:text-5xl leading-none transition-transform duration-500 ease-out"
       style={{
        fontStyle: 'italic',
        transform: `translateY(${(rand(i) - 0.5) * 22}px) rotate(${(rand(i + 20) - 0.5) * 24}deg) scaleY(${0.8 + rand(i + 40) * 0.5})`,
       }}
      >
       {ch}
      </span>
     ))}
    </div>
   </div>

   <div className="flex items-center gap-4 mt-6 flex-wrap">
    <button
     onClick={() => setSeed(Math.floor(Math.random() * 100000000))}
     className="subtext border border-gray-400 text-gray-500 hover:text-black hover:border-black transition-colors rounded-full px-4 py-1"
    >
     Generate
    </button>
    <button
     onClick={() => setSeed(OFFICIAL_SEED)}
     className="subtext text-gray-400 hover:text-black transition-colors"
    >
     Official seed
    </button>
    <span className="subtext text-gray-400 tabular-nums">
     seed : {seed}
    </span>
   </div>
  </div>
 );
};

export const InterPlay: React.FC = () => {
 useEffect(() => {
  window.scrollTo(0, 0);
 }, []);

 return (
  <div className="w-full min-h-screen bg-white text-black p-8 mt-12 md:mt-0 mx-auto">
   {/* Header / Navigation */}
   <header className="mb-8">
    <Link
     to="/"
     className="mb-8 text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-2 inline-block"
    >
     ← Back to Projects
    </Link>
    <h1 className="title mb-2">
     InterPlay
    </h1>
    <p className="subtitle text-gray-600 max-w-2xl">
     Exhibition Identity &amp; Website, 2026
    </p>
   </header>

   {/* Main Media & Overview */}
   <section className="layout-vertical-media">
    <div className="layout-vertical-media-left">
     <img
      src="/interplay/04-mobile.webp"
      alt="InterPlay home screen with the generative identity behind the logotype"
      className="w-full h-auto"
     />
    </div>

    <div className="layout-vertical-media-right">
     <div className="mb-12">
      <h2 className="mb-8 text-lg">Overview</h2>
      <ul className="space-y-4 text-gray-600">
       <li>
        <span className="block text-gray-400 tracking-wider mb-1 ">Role</span>
        Visual Director, Web Design &amp; Development
       </li>
       <li>
        <span className="block text-gray-400 tracking-wider mb-1 ">Year</span>
        2026
       </li>
       <li>
        <span className="block text-gray-400 tracking-wider mb-1 ">Organised by</span>
        UAL Creative Computing Institute
       </li>
       <li>
        <span className="block text-gray-400 tracking-wider mb-1 ">Built with</span>
        Vanilla HTML / CSS / JS, three.js, Canvas, GitHub Pages
       </li>
      </ul>
     </div>
     <div>
      <h2 className="mb-8 text-lg">Mission</h2>
      <div className="project-description space-y-6">
       <p>
        InterPlay is the postgraduate exhibition of UAL Creative Computing Institute,
        presenting 28 works by artists, designers and researchers from five continents.
        I led the visual direction and designed and built the exhibition website.
       </p>
       <p>
        The brief was awkward in a useful way: one identity had to hold 28 works that
        shared no medium — TouchDesigner installations, p5.js sketches, physical
        computing, games, moving image. Rather than flatten them under one fixed mark,
        the identity was made to vary.
       </p>
      </div>
     </div>
    </div>
   </section>

   {/* 1. Generative identity */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
     <div>
      <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
       One Logo, Many Seeds
      </h2>
      <div className="project-description space-y-6">
       <p>
        The logotype is generated, not drawn. A numeric seed decides how each letter is
        displaced and distorted, so the same word yields an endless family of marks while
        staying recognisable. The exhibition ships with one canonical variant — seed
        72228804 — and every committee member could generate their own.
       </p>
       <p>
        This turned the identity into something the team played with rather than policed.
        It also matched the exhibition&apos;s own argument: technology is treated as a
        material that talks back, not a neutral tool.
       </p>
      </div>
     </div>
     <div className="w-full h-full">
      <SeedLogo />
     </div>
    </div>
   </section>

   {/* 2. One dataset, 28 rooms */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
     <div className="w-full h-full md:order-1 flex items-top justify-top">
      <img
       src="/interplay/02-project.webp"
       alt="A work page — Post Literature, shown in the template every exhibit uses"
       className="w-full h-full object-cover"
      />
     </div>
     <div className="md:order-2">
      <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
       One Dataset, Twenty-Eight Rooms
      </h2>
      <div className="project-description space-y-6">
       <p>
        Every work page is the same template reading from a single JSON file. Each entry
        carries a statement, technical label, artist links and three media sets — final
        images, behind the scenes, artist photos — and the page adapts to whatever
        exists, falling back gracefully when a field is missing or a still is actually a
        video.
       </p>
       <p>
        Artists submitted media as folders, not as markup. A sync script walks the
        directory tree and rewrites the media paths in the JSON to match what is
        actually on disk, so adding footage never meant editing code. With 28 teams
        delivering on their own schedule, that was the difference between a website and
        a bottleneck.
       </p>
      </div>
     </div>
    </div>
   </section>

   {/* 3. Generative visual */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
     <div>
      <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
       A Background That Answers Back
      </h2>
      <div className="project-description space-y-6">
       <p>
        Behind the index sits a WebGL field of translucent blooms, rendered with three.js
        on a transparent canvas so the type and the work list stay plain HTML — legible,
        selectable, indexable. A raycaster tracks the pointer and the blooms respond,
        giving the page the feeling of a room you are walking through.
       </p>
       <p>
        Keeping the 3D strictly decorative was a deliberate constraint. The visual is the
        first thing you notice and the first thing that can be dropped: if WebGL fails,
        the exhibition still reads.
       </p>
      </div>
     </div>
     <div className="w-full h-full">
      <img
       src="/interplay/01-home.webp"
       alt="The index: generative blooms on the left, the list of 28 works on the right"
       className="w-full h-full object-cover"
      />
     </div>
    </div>
   </section>

   {/* Gallery */}
   <section className="mb-32 -mx-8 px-8 md:mx-0 md:px-0">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
     <div className="w-full overflow-hidden">
      <img src="/interplay/01-home.webp" alt="Index page" className="w-full h-full object-cover" />
     </div>
     <div className="w-full overflow-hidden">
      <img src="/interplay/03-generator.webp" alt="Logo generator for the exhibition committee" className="w-full h-full object-cover" />
     </div>
     <div className="w-full overflow-hidden">
      <img src="/interplay/02-project.webp" alt="Work detail page — Post Literature" className="w-full h-full object-cover" />
     </div>
    </div>
   </section>

   {/* Links */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-16">
     Links
    </h2>
    <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
     <div className="group">
      <h3 className="text-xl text-black mb-4">Exhibition</h3>
      <p className="text-lg leading-relaxed">
       <a target="_blank" rel="noreferrer" href="https://interplay-cci.co.uk/" className="link-underline">interplay-cci.co.uk</a>
       <br />
       <a target="_blank" rel="noreferrer" href="https://interplay-cci.co.uk/generator.html" className="link-underline">Logo generator</a>
      </p>
     </div>
     <div className="group">
      <h3 className="text-xl text-black mb-4">Source</h3>
      <p className="text-lg leading-relaxed">
       <a target="_blank" rel="noreferrer" href="https://github.com/zhenxhen/exhibition_web" className="link-underline">github.com/zhenxhen/exhibition_web</a>
       <br />
       <Link to="/project/post-literature" className="link-underline">Post Literature — my work in the show</Link>
      </p>
     </div>
    </div>
   </section>

   <Footer />
  </div>
 );
};
