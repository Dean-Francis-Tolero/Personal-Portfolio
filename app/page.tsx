export default function Home() {
  return (
    <main className="h-screen flex flex-col justify-center items-start">
      <div className="w-full p-6 grid grid-cols-2 font-bold">
        <div className="flex flex-col text-4xl">Digital Playground, Personal Portfolio,<br/>Design</div>
        <div className="flex flex-col text-2xl text-justify">I believe in documenting the journey, the ideas, the lessons, and the things we create along the way. This website is not only a portfolio of my work, but also a creative outlet where I explore new ideas, experiment with design, and bring concepts to life.</div>
      </div>

      <div className="p-6">
        <h1 className="text-[200px] font-bold">Concept</h1>
        <h2 className="text-[40px] text-right font-bold text-[#a7a7a7]">Dean Francis</h2>
      </div>
    </main>
  );
};