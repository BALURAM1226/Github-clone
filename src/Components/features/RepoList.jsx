import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, GitFork, BookOpen, Clock, ChevronLeft, ChevronRight, Search, Filter, ArrowUpDown, ChevronDown, Package, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RepoList = ({ username }) => {
    const [apiData, setApiData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');
    const [sortBy, setSortBy] = useState('updated');
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (!username) return;
        setLoading(true);
        setError(null);
        try {
            // Fetch total count first if page is 1
            if (page === 1) {
                const totalRes = await fetch(`https://api.github.com/users/${username}/repos`);
                const totalData = await totalRes.json();
                if (Array.isArray(totalData)) {
                    setTotalItems(totalData.length);
                }
            }

            // Fetch current page
            const res = await fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=30&sort=${sortBy}`);
            const data = await res.json();

            if (res.status === 403) {
                setError("API Limit Reached");
                setApiData([]);
            } else if (Array.isArray(data)) {
                setApiData(data);
            } else {
                setApiData([]);
            }
        } catch (err) {
            console.error(err);
            setError("Network Error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchData();
    }, [username, sortBy]);

    useEffect(() => {
        fetchData();
    }, [page]);

    const filteredRepos = apiData.filter(repo =>
        repo.name.toLowerCase().includes(filterText.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(filterText.toLowerCase()))
    );

    const totalPages = Math.ceil(totalItems / 30);

    return (
        <div className="p-8 md:p-12">
            {/* Header / Search Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 border-b border-github-border/20 pb-10">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-github-blue/10 rounded-2xl">
                        <Package className="text-github-blue" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white flex items-center gap-3">
                            Source Space
                            <span className="bg-[#21262d] text-github-blue px-2.5 py-1 rounded-lg text-[10px] border border-github-blue/20">
                                {totalItems}
                            </span>
                        </h1>
                        <p className="text-[10px] text-github-muted font-bold uppercase tracking-widest mt-1">Repository Ecosystem</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-github-muted" size={14} />
                        <input
                            type="text"
                            placeholder="Find a repository..."
                            className="bg-[#010409] border border-github-border/40 rounded-xl pl-12 pr-6 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-github-blue/30 transition-all w-64"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        [1, 2, 4, 4, 5, 6].map(i => (
                            <div key={i} className="h-44 bg-white/5 border border-github-border/20 rounded-3xl animate-pulse" />
                        ))
                    ) : error ? (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
                            <AlertCircle className="text-github-muted mb-4" size={48} />
                            <h3 className="text-lg font-black text-white mb-2">{error}</h3>
                            <button onClick={fetchData} className="github-button text-xs gap-2">
                                <RefreshCw size={14} /> Try Refresh
                            </button>
                        </div>
                    ) : filteredRepos.length === 0 ? (
                        <div className="col-span-full py-32 text-center">
                            <h3 className="text-xl font-black text-white">No results found</h3>
                            <p className="text-github-muted text-sm mt-2 font-bold uppercase tracking-widest">Adjust your search criteria</p>
                        </div>
                    ) : (
                        filteredRepos.map((repo, idx) => (
                            <motion.div
                                key={repo.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group p-8 bg-[#010409]/40 hover:bg-[#0d1117] border border-github-border/20 hover:border-github-blue/30 rounded-3xl transition-all h-full flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <Link to={`/repo/${repo.owner.login}/${repo.name}`} className="text-lg font-black text-github-blue hover:text-white transition-colors truncate pr-4 underline decoration-github-blue/30">
                                        {repo.name}
                                    </Link>
                                    <span className="text-[9px] uppercase font-black text-github-muted border border-github-border/40 px-2 py-0.5 rounded-md">
                                        {repo.visibility}
                                    </span>
                                </div>
                                <p className="text-[13px] text-github-muted line-clamp-2 mb-8 h-10 leading-relaxed font-medium">
                                    {repo.description || "Experimental source code and engineering logic."}
                                </p>
                                <div className="mt-auto flex items-center justify-between text-[10px] font-black text-github-muted uppercase tracking-widest pt-6 border-t border-github-border/10">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1.5"><Star size={14} /> {repo.stargazers_count}</span>
                                        {repo.language && <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-github-blue" /> {repo.language}</span>}
                                    </div>
                                    <span className="font-bold opacity-50">{new Date(repo.updated_at).toLocaleDateString()}</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Pagination Area */}
            {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-6">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="github-button-secondary disabled:opacity-20 px-6 py-3 rounded-2xl"><ChevronLeft size={20} /></button>
                    <span className="text-[10px] font-black text-white px-8 py-3 bg-[#0d1117] rounded-full border border-github-border/50 uppercase tracking-widest">Page {page} of {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="github-button-secondary disabled:opacity-20 px-6 py-3 rounded-2xl"><ChevronRight size={20} /></button>
                </div>
            )}
        </div>
    );
};

export default RepoList;
