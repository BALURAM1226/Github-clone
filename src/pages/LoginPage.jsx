import React from 'react';
import { Github, Code, Users, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = ({ githubSignIn }) => {
    return (
        <div className="min-h-screen bg-github-dark flex flex-col md:flex-row items-center justify-center p-6 gap-12 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-github-blue opacity-[0.05] rounded-full blur-3xl pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center md:text-left z-10 max-w-lg"
            >
                <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                    <Github className="text-white" size={48} />
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">GitHub Clone</h1>
                </div>

                <h2 className="text-2xl font-bold text-github-text mb-4">The new way to build software.</h2>
                <p className="text-github-muted mb-8 text-lg">
                    Join over 100 million developers to build, ship, and maintain their software on the world’s most advanced development platform.
                </p>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-github-text">
                        <Code className="text-github-blue" size={20} />
                        <span>Collaborate on thousands of open-source projects.</span>
                    </div>
                    <div className="flex items-center gap-3 text-github-text">
                        <Users className="text-github-blue" size={20} />
                        <span>Scale with organizational features.</span>
                    </div>
                    <div className="flex items-center gap-3 text-github-text">
                        <Star className="text-github-blue" size={20} />
                        <span>Star and fork repositories to your heart's content.</span>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-md bg-github-bg border border-github-border rounded-xl shadow-2xl p-8 z-10 glass"
            >
                <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-white mb-2">Sign in to GitHub Clone</h3>
                    <p className="text-sm text-github-muted">Please continue with your GitHub account</p>
                </div>

                <button
                    onClick={githubSignIn}
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-[#010409] font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg mb-6 group"
                >
                    <Github size={20} />
                    <span>Sign in with GitHub</span>
                    <ArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={18} />
                </button>

                <p className="text-xs text-center text-github-muted pb-4 border-b border-github-border mb-4">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>

                <div className="flex justify-center gap-6">
                    <div className="text-center">
                        <p className="font-bold text-white text-lg">100M+</p>
                        <p className="text-[10px] text-github-muted uppercase tracking-wider">Developers</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-white text-lg">330M+</p>
                        <p className="text-[10px] text-github-muted uppercase tracking-wider">Repositories</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-white text-lg">4M+</p>
                        <p className="text-[10px] text-github-muted uppercase tracking-wider">Organizations</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
