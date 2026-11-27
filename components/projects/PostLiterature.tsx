import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';

/**
 * 작품 영상. 2.5MB라 페이지에 들어오자마자 받지 않고,
 * 화면에 가까워질 때 비로소 로드한다. 그 전에는 포스터 한 장(69KB)만 보인다.
 */
const Film: React.FC = () => {
 const wrapRef = useRef<HTMLDivElement>(null);
 const [load, setLoad] = useState(false);

 useEffect(() => {
  const el = wrapRef.current;
  if (!el) return;
  const io = new IntersectionObserver(([e]) => {
   if (e.isIntersecting) { setLoad(true); io.disconnect(); }
  }, { rootMargin: '200px' });
  io.observe(el);
  return () => io.disconnect();
 }, []);

 return (
  <div ref={wrapRef} className="w-full">
   {load ? (
    <video
     src="/post-literature/film.mp4"
     poster="/post-literature/poster.webp"
     autoPlay
     loop
     muted
     playsInline
     controls
     className="w-full h-auto"
    />
   ) : (
    <img
     src="/post-literature/poster.webp"
     alt="Post Literature installed — the arm, the printer, and the paper it has already made"
     className="w-full h-auto"
    />
   )}
  </div>
 );
};

export const PostLiterature: React.FC = () => {
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
     Post Literature
    </h1>
    <p className="subtitle text-gray-600 max-w-2xl">
     AI New Media Installation, 2026
    </p>
   </header>

   {/* Main Media & Overview */}
   <section className="layout-vertical-media">
    <div className="layout-vertical-media-left">
     <Film />
    </div>

    <div className="layout-vertical-media-right">
     <div className="mb-12">
      <h2 className="mb-8 text-lg">Overview</h2>
      <ul className="space-y-4 text-gray-600">
       <li>
        <span className="block text-gray-400 tracking-wider mb-1 ">Medium</span>
        Robotic Installation, Printed Matter
       </li>
       <li>
        <span className="block text-gray-400 tracking-wider mb-1 ">Year</span>
        2026
       </li>
       <li>
        <span className="block text-gray-400 tracking-wider mb-1 ">Tools</span>
        Robot Arm, SBC, Thermal Printer, Gemini API
       </li>
       <li>
        <span className="block text-gray-400 tracking-wider mb-1 ">Exhibition</span>
        InterPlay, UAL Creative Computing Institute
       </li>
      </ul>
     </div>
     <div>
      <h2 className="mb-8 text-lg">Mission</h2>
      <div className="project-description space-y-6">
       <p>
        &ldquo;What do you consider literature?&rdquo;
       </p>
       <p>
        We gather information, seek entertainment, and even find sorrow inside screens and
        endlessly scrolling media. Post Literature moves past the traditional act of
        <em> reading</em> literature and looks instead at the <em>viewing</em> of
        literature we consume today.
       </p>
      </div>
     </div>
    </div>
   </section>

   {/* 1. Premise */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
     <div>
      <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
       Where Is Literature Today?
      </h2>
      <div className="project-description space-y-6">
       <p>
        Until now we have approached literature primarily through the act of reading. But
        in a world dominated by social media, we turn to the endless stream of content on
        these platforms to gather information, find entertainment, and even discover
        moments of sadness.
       </p>
       <p>
        Today&apos;s modern literature exists right inside our smartphones. The work takes
        that claim literally and asks what it would mean to treat a feed as a text worth
        printing and keeping.
       </p>
      </div>
     </div>
     <div className="w-full h-full">
      <img
       src="/post-literature/s2.webp"
       alt="The phone on the plinth, a feed playing under the arm"
       className="w-full h-full object-cover"
      />
     </div>
    </div>
   </section>

   {/* 2. The machine */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
     <div>
      <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
       A Reader That Never Stops Scrolling
      </h2>
      <div className="project-description space-y-6">
       <p>
        A robot arm scrolls a phone the way a hand does — steadily, without deciding when
        to stop. The screen is captured over ADB, read by a language model, and a thermal
        printer turns that reading into a continuous strip of paper. A Raspberry Pi 5 holds
        the three devices together on three USB ports and keeps the loop running.
       </p>
       <p>
        Nothing in the loop is exotic: an arm, a single-board computer, a receipt printer.
        The familiarity is the argument. The gestures we perform without noticing are
        given a body, a sound, and a residue that piles up on the floor.
       </p>
      </div>
     </div>
     <div className="w-full h-full">
      <img
       src="/post-literature/s4.webp"
       alt="Close up — the arm over the phone, a printed strip running out beneath it"
       className="w-full h-auto mb-8"
      />
      <ul className="border-t border-gray-100">
       {[
        ['Robot Arm', 'Performs the scroll — the gesture under examination'],
        ['Single-Board Computer', 'Drives the loop and holds it running for hours'],
        ['Gemini API', 'Reads what the screen shows and writes it back as text'],
        ['Thermal Printer', 'Makes the feed physical, continuous, and impossible to scroll past'],
       ].map(([name, role]) => (
        <li key={name} className="border-b border-gray-100 py-5">
         <span className="block text-black mb-1">{name}</span>
         <span className="text-gray-500">{role}</span>
        </li>
       ))}
      </ul>
     </div>
    </div>

   </section>

   {/* 3. 루프 — 다이어그램과 설명을 좌우로 */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <div className="grid grid-cols-1 dt:grid-cols-2 gap-10 lg:gap-24 items-top mb-4">
     <div className="w-full">
      <img
       src="/post-literature/diagram.webp"
       alt="System diagram — swipe, capture over ADB, read by the model, print out, repeat"
       className="w-full max-w-sm h-auto mx-auto dt:mx-0"
      />
     </div>
     <div>
      <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
       The Loop
      </h2>
      <div className="project-description mb-10">
       <p>
        A Raspberry Pi 5 holds the three devices on three USB ports and keeps one cycle
        running. Nothing in it waits for a person — the work only stops when the paper
        runs out.
       </p>
      </div>
      <ol className="border-t border-gray-100">
       {[
        ['Swipe', 'A Python script drives the arm over USB #1. The arm touches the screen the way a thumb does'],
        ['Capture', 'The phone is read over ADB on USB #2 — whatever the feed is showing at that moment'],
        ['Read', 'A language model turns that screen into a sentence: not a caption, a reading'],
        ['Print out', 'A second script sends it to the thermal printer on USB #3, and the strip grows'],
        ['Again', 'The arm swipes once more. The loop has no end condition'],
       ].map(([step, text], i) => (
        <li key={step} className="border-b border-gray-100 py-5 flex gap-5">
         <span className="text-gray-300 tabular-nums shrink-0 w-7">{String(i + 1).padStart(2, '0')}</span>
         <span>
          <span className="block text-black mb-1">{step}</span>
          <span className="text-gray-500">{text}</span>
         </span>
        </li>
       ))}
      </ol>
     </div>
    </div>
   </section>

   {/* Gallery */}
   <section className="mb-32 -mx-8 px-8 md:mx-0 md:px-0">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
     {[
      ['s1', 'A visitor reading the strip the machine has just printed'],
      ['s3', 'The work photographed by a visitor'],
      ['s6', 'The paper gathering on the gallery floor'],
     ].map(([f, alt]) => (
      <div key={f} className="w-full overflow-hidden">
       <img src={`/post-literature/${f}.webp`} alt={alt} className="w-full h-full object-cover" />
      </div>
     ))}
    </div>
    <p className="text-gray-400 text-sm mt-4">
     InterPlay, UAL Creative Computing Institute, 2026.
    </p>
   </section>

   {/* Links */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-16">
     Exhibition
    </h2>
    <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
     <div className="group">
      <h3 className="text-xl text-black mb-4">Shown at</h3>
      <p className="text-lg leading-relaxed">
       <a target="_blank" rel="noreferrer" href="https://interplay-cci.co.uk/project.html?id=14" className="link-underline">InterPlay, UAL CCI (2026)</a>
      </p>
     </div>
     <div className="group">
      <h3 className="text-xl text-black mb-4">Related</h3>
      <p className="text-lg leading-relaxed">
       <Link to="/project/interplay" className="link-underline">InterPlay — exhibition identity &amp; website</Link>
      </p>
     </div>
    </div>
   </section>

   <Footer />
  </div>
 );
};
