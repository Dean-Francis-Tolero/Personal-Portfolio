export default function ResumePage() {
    return (
        <main className="min-h-screen flex flex-col items-center">

            {/* Main Content */}
            <div className="flex-1 w-full flex items-center justify-center p-6">
                <div className="w-full flex flex-col lg:flex-row justify-center gap-10 lg:gap-20 font-bold">

                    {/* Information */}
                    <div className="shrink-0">
                        <h3 className="text-[#a7a7a7]">Information</h3>
                        <p className="mt-4">Dean Francis Tolero</p>
                    </div>

                    {/* Personal Story */}
                    <div className="w-full lg:w-[500px]">
                        <h3 className="text-[#a7a7a7]">Personal Story</h3>
                        <p className="mt-4">
                            I believe in documenting the journey — the ideas, the lessons,
                            and the things we create along the way. My curiosity for
                            technology grew into a passion for building software, exploring
                            ideas, and creating meaningful digital experiences. This website
                            is a reflection of my journey — a place where I share what I
                            build, what I learn, and what inspires me.
                        </p>
                    </div>

                    {/* Connect */}
                    <div className="shrink-0">
                        <h3 className="text-[#a7a7a7]">Connect</h3>

                        <p className="mt-4">
                            Feel free to reach out for opportunities, collaborations,
                            or just to connect.
                        </p>

                        <a
                            href="mailto:deanfrancistolero@gmail.com"
                            className="block mt-2 hover:text-[#a7a7a7] transition-colors"
                        >
                            deanfrancistolero@gmail.com
                        </a>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <footer className="w-full px-6 py-6 flex justify-between items-center text-sm font-bold">

                <p className="text-[#a7a7a7]">
                    © 2026 Dean Francis Tolero
                </p>

                <div className="flex gap-6">

                    <a
                        href="https://github.com/Dean-Francis"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#a7a7a7] transition-colors"
                    >
                        GitHub
                    </a>

                    <a
                        href="https://www.linkedin.com/in/deanfrancistolero"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#a7a7a7] transition-colors"
                    >
                        LinkedIn
                    </a>

                    <a
                        href="/resume.pdf"
                        download
                        className="hover:text-[#a7a7a7] transition-colors"
                    >
                        Resume
                    </a>

                </div>

            </footer>

        </main>
    )
}