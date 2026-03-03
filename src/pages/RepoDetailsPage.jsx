import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ExternalLink, Star, GitFork, Eye, BookOpen, Clock, ChevronLeft, Github, Globe, Terminal, Activity, FileText, Code2 } from 'lucide-react';
import Navbar from '../Components/layout/Navbar';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const RepoDetailsPage = () => {
    const { user, repoId } = useParams();
    const [repoData, setRepoData] = useState(null);
    const [readme, setReadme] = useState('');
    const [languages, setLanguages] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Repo Main Data
                const repoRes = await axios.get(`https://api.github.com/repos/${user}/${repoId}`);
                setRepoData(repoRes.data);

                // Fetch Languages
                const langRes = await axios.get(`https://api.github.com/repos/${user}/${repoId}/languages`);
                setLanguages(langRes.data);

                // Fetch README
                try {
                    const readmeRes = await axios.get(`https://api.github.com/repos/${user}/${repoId}/readme`, {
                        headers: { Accept: 'application/vnd.github.v3.raw' }
                    });
                    setReadme(readmeRes.data);
                } catch (e) {
                    setReadme('No README.md found for this repository.');
                }

            } catch (error) {
                console.error("Error fetching repository data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, repoId]);

    if (loading || !repoData) {
        return (
            <div className="min-h-screen bg-github-dark flex items-center justify-center font-sans">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-github-blue/20 border-t-github-blue rounded-full animate-spin" />
                    <Github className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-github-blue/50" size={24} />
                </div>
            </div>
        );
    }

    const totalLines = Object.values(languages).reduce((a, b) => a + b, 0);

    return (
        <div className="min-h-screen bg-github-dark font-sans text-github-text">
            <Navbar username={repoData.owner.login} userpic={repoData.owner.avatar_url} />

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-github-blue hover:text-blue-400 font-bold mb-6 group transition-colors">
                        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to dashboard
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0d1117] border border-github-border/50 rounded-2xl p-8 glass shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                            <Github size={200} />
                        </div>

                        <div className="flex items-center gap-6 z-10">
                            <motion.img
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={repoData.owner.avatar_url}
                                alt={repoData.owner.login}
                                className="w-20 h-20 rounded-2xl border-2 border-github-border shadow-2xl"
                            />
                            <div>
                                <div className="flex flex-wrap items-center gap-2 text-xl font-medium text-github-muted mb-2">
                                    <BookOpen size={20} className="text-github-blue/70" />
                                    <span className="hover:text-github-blue cursor-pointer transition-colors">{repoData.owner.login}</span>
                                    <span className="text-github-border">/</span>
                                    <span className="text-white font-black text-2xl tracking-tight">{repoData.name}</span>
                                    <span className="text-[10px] uppercase font-black text-github-muted border border-github-border/50 px-2.5 py-1 rounded-lg tracking-widest ml-2 bg-github-dark">
                                        {repoData.visibility}
                                    </span>
                                </div>
                                <p className="text-github-text/80 max-w-2xl leading-relaxed">{repoData.description || "⚡ No description provided for this project."}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 z-10">
                            <button className="github-button-secondary py-2 px-4 shadow-lg group">
                                <Star size={18} className="group-hover:text-yellow-500 transition-colors" />
                                Star
                                <span className="bg-[#30363d] px-2.5 py-0.5 rounded-full text-xs font-bold ml-1">{repoData.stargazers_count}</span>
                            </button>
                            <button className="github-button-secondary py-2 px-4 shadow-lg group">
                                <GitFork size={18} className="group-hover:text-github-blue transition-colors" />
                                Fork
                                <span className="bg-[#30363d] px-2.5 py-0.5 rounded-full text-xs font-bold ml-1">{repoData.forks_count}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Readme Section */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-[#0d1117] border border-github-border/50 rounded-2xl overflow-hidden shadow-xl">
                            <div className="bg-[#161b22] px-6 py-4 border-b border-github-border/50 flex items-center justify-between">
                                <div className="flex items-center gap-3 font-bold text-sm">
                                    <FileText size={18} className="text-github-blue" />
                                    <span className="uppercase tracking-widest">README.md</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Terminal size={14} className="text-github-muted" />
                                    <span className="text-[10px] font-mono text-github-muted uppercase">{repoData.default_branch}</span>
                                </div>
                            </div>
                            <div className="p-8 md:p-12 prose prose-invert max-w-none prose-pre:bg-github-dark prose-a:text-github-blue prose-headings:text-white prose-strong:text-github-blue">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {readme}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-6">
                        <div className="bg-[#0d1117] border border-github-border/50 rounded-2xl p-6 shadow-xl glass">
                            <h3 className="font-black text-white mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
                                <Code2 size={18} className="text-github-blue" />
                                Languages
                            </h3>

                            {/* Language Bar */}
                            <div className="flex h-3 w-full rounded-full overflow-hidden mb-6 bg-github-dark border border-github-border/30">
                                {Object.entries(languages).map(([lang, lines], idx) => (
                                    <div
                                        key={lang}
                                        style={{
                                            width: `${(lines / totalLines) * 100}%`,
                                            backgroundColor: idx === 0 ? '#1f6feb' : idx === 1 ? '#3fb950' : idx === 2 ? '#d29922' : '#8b949e'
                                        }}
                                        className="h-full"
                                    />
                                ))}
                            </div>

                            <div className="space-y-4">
                                {Object.entries(languages).map(([lang, lines], idx) => (
                                    <div key={lang} className="flex items-center justify-between group cursor-default">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: idx === 0 ? '#1f6feb' : idx === 1 ? '#3fb950' : idx === 2 ? '#d29922' : '#8b949e' }}
                                            />
                                            <span className="text-sm font-bold text-github-text group-hover:text-white transition-colors">{lang}</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-github-muted font-bold">
                                            {((lines / totalLines) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#0d1117] border border-github-border/50 rounded-2xl p-6 shadow-xl">
                            <h3 className="font-black text-white mb-6 text-sm uppercase tracking-widest">About</h3>
                            <div className="space-y-5 text-sm">
                                <div className="flex items-center gap-3 text-github-text hover:text-github-blue transition-colors group">
                                    <Globe size={18} className="text-github-muted group-hover:text-github-blue" />
                                    <a href={repoData.homepage || repoData.html_url} target="_blank" rel="noreferrer" className="truncate font-medium underline decoration-dotted underline-offset-4">
                                        {repoData.homepage ? new URL(repoData.homepage).hostname : 'Website'}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-github-text hover:text-github-blue transition-colors group">
                                    <Github size={18} className="text-github-muted group-hover:text-github-blue" />
                                    <a href={repoData.html_url} target="_blank" rel="noreferrer" className="font-medium">
                                        View on GitHub
                                    </a>
                                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="pt-4 border-t border-github-border/20 space-y-4">
                                    <div className="flex items-center gap-3 text-github-muted">
                                        <Clock size={16} />
                                        <span className="text-xs">Created: {new Date(repoData.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-github-muted">
                                        <Activity size={16} />
                                        <span className="text-xs">Last updated: {new Date(repoData.updated_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-github-muted">
                                        <Eye size={16} />
                                        <span className="text-xs">{repoData.subscribers_count} watching</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RepoDetailsPage;
