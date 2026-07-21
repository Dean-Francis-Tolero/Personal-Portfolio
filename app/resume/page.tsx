"use client";

import { motion } from "motion/react";
import { LINK_UNDERLINE } from "../../lib/styles";
import { useCurtainEntranceVariants } from "../../lib/curtain_entrance";

export default function ResumePage() {
    const { container, fadeRise } = useCurtainEntranceVariants();

    return (
        <motion.main
            variants={container}
            initial="initial"
            animate="animate"
            className="min-h-screen flex flex-col items-center"
        >

            <div className="px-20 pt-30 flex-1 w-full flex items-center justify-center p-6 text-xl">
                <div className="w-full flex flex-col 2xl:flex-row justify-center gap-10 lg:gap-20">

                    <motion.div variants={fadeRise} className="shrink-0">
                        <h3 className="text-muted font-bold">Information</h3>
                        <div className="mt-4 font-semibold">
                            <p>Dean Francis Tolero</p>
                            <p>+971 56 138 4834</p>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeRise} className="w-full lg:w-500px">
                        <h3 className="text-muted font-bold">Personal Story</h3>
                        <p className="mt-4 font-semibold">
                            I started programming at the age of 16, and since then, I have been passionate about creating innovative solutions through code. My journey has taken me through various programming languages and frameworks, allowing me to develop a diverse skill set. I am constantly seeking new challenges
                            and opportunities to grow as a developer and contribute to meaningful projects. I am now 22 years old, and I am excited to continue my journey in the world of technology, pushing the boundaries of what is possible with code.
                        </p>
                    </motion.div>

                    <motion.div variants={fadeRise} className="shrink-0">
                        <h3 className="text-muted font-bold">Connect</h3>
                        <div className="mt-4 font-semibold">
                            <p className="mt-4 font-semibold">
                            Feel free to reach out for opportunities, collaborations,
                            or just to connect.</p>
                        </div>


                        <a
                            href="mailto:deanfrancistolero@gmail.com"
                            className={`${LINK_UNDERLINE} mt-2 hover:text-muted transition-colors font-semibold`}
                        >
                            deanfrancistolero@gmail.com
                        </a>
                    </motion.div>

                </div>
            </div>

            <motion.footer variants={fadeRise} className="w-full px-6 py-6 flex justify-center items-center text-sm font-bold">

                <div className="flex gap-6">

                    <a
                        href="https://github.com/Dean-Francis-Tolero"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${LINK_UNDERLINE} hover:text-muted transition-colors`}
                    >
                        GitHub
                    </a>

                    <a
                        href="https://www.linkedin.com/in/deanfrancistolero"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${LINK_UNDERLINE} hover:text-muted transition-colors`}
                    >
                        LinkedIn
                    </a>

                    <a
                        href="/Dean_Francis_Tolero_Resume.pdf"
                        download
                        className={`${LINK_UNDERLINE} hover:text-muted transition-colors`}
                    >
                        Download Resume
                    </a>

                </div>

            </motion.footer>

        </motion.main>
    )
}