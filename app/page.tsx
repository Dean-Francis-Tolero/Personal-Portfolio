export default async function Home() {
  await new Promise((resolve) => setTimeout(resolve, 4000));

  return (
    <main className="pt-30 min-h-dvh md:h-dvh overflow-y-auto md:overflow-hidden relative flex flex-col">
      <div className="flex-1 flex flex-col justify-center pt-30 px-10 pb-10"> 
        <div className="w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col text-4xl font-bold">Digital Playground, Personal Portfolio, Design</div>
          <div className="flex flex-col text-2xl text-justify">I believe in documenting the journey, the ideas, the lessons, and the things we create along the way. This website is not only a portfolio of my work, but also a creative outlet where I explore new ideas, experiment with design, and bring concepts to life.</div>
        </div>

        <div className="p-6 md:p-4">
          <h1 className="text-[80px] sm:text-[120px] md:text-[160px] lg:text-[200px] font-bold">Concept</h1>
          <h2 className="text-[40px] text-right font-bold text-[#a7a7a7]">Dean Francis</h2>
        </div>
      </div>

      <div className="flex-1 bg-black text-white py-5 px-6 ">
        <h1 className="text-center">test</h1>
      </div>
    </main>
  );
};