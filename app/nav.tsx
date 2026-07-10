export default function Nav() {
  return (
    <nav className="bg-[#959494] text-white p-6 shadow-md font-[Varela Round]">
      <ul className="flex gap-6 justify-center">
        <li><a href="/">Home</a></li>
        <li><a href="/projects">Projects</a></li>
        <li><a href="/resume">Resume</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  );
};