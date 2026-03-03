import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Search, Plus, Bell, LogOut, Menu, Settings, User, Book, Star, Clock, History, Trash2 } from 'lucide-react';
import { auth, signOut } from '../../services/firebase';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ username, userpic, onUserSearch = () => { } }) => {
    const [searchValue, setSearchValue] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('recent_github_searches') || '[]');
        setRecentSearches(saved);
    }, []);

    const handleSignOut = () => {
        signOut(auth).then(() => {
            localStorage.clear();
            window.location.href = "/";
        }).catch((error) => {
            console.error("Sign out error:", error);
        });
    };

    const addToHistory = (name) => {
        const updated = [name, ...recentSearches.filter(s => s !== name)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recent_github_searches', JSON.stringify(updated));
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchValue.trim()) {
            if (typeof onUserSearch === 'function') {
                onUserSearch(searchValue.trim());
                addToHistory(searchValue.trim());
            }
            setIsSearchFocused(false);
            setSearchValue('');
        }
    };

    const clearHistory = (e) => {
        e.stopPropagation();
        setRecentSearches([]);
        localStorage.removeItem('recent_github_searches');
    };

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-2.5 bg-[#010409]/90 border-b border-github-border backdrop-blur-xl">
            <div className="flex items-center gap-4 flex-1">
                <Menu className="lg:hidden text-github-text cursor-pointer hover:text-white transition-colors" size={20} />
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link to="/" onClick={() => typeof onUserSearch === 'function' && onUserSearch(username)}>
                        <Github className="text-white cursor-pointer" size={32} />
                    </Link>
                </motion.div>

                <div className="hidden md:flex items-center ml-4 relative flex-1 max-w-xl">
                    <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'max-w-2xl' : 'max-w-md'}`}>
                        <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isSearchFocused ? 'text-github-blue' : 'text-github-muted'}`} size={14} />
                        <input
                            type="text"
                            placeholder="Type a username to reach..."
                            className="w-full bg-[#0d1117] border border-github-border rounded-lg pl-10 pr-12 py-1.5 text-sm md:text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-github-blue/40 focus:border-github-blue transition-all placeholder:text-github-muted"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={handleSearch}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <span className="border border-github-border rounded px-1.5 py-0.5 text-[10px] text-github-muted bg-github-dark font-mono">/</span>
                        </div>

                        {/* Recent Search Dropdown */}
                        <AnimatePresence>
                            {isSearchFocused && recentSearches.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-[#161b22] border border-github-border rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden py-2 z-[60]"
                                >
                                    <div className="px-4 py-2 flex items-center justify-between border-b border-github-border/30 mb-1">
                                        <span className="text-[10px] font-black text-github-muted uppercase tracking-widest flex items-center gap-2">
                                            <History size={12} />
                                            Recent Explorations
                                        </span>
                                        <button onClick={clearHistory} className="text-[10px] text-red-400/70 hover:text-red-400 font-bold transition-colors">Clear All</button>
                                    </div>
                                    {recentSearches.map((s) => (
                                        <div
                                            key={s}
                                            onClick={() => {
                                                if (typeof onUserSearch === 'function') {
                                                    onUserSearch(s);
                                                    addToHistory(s);
                                                }
                                                setIsSearchFocused(false);
                                            }}
                                            className="px-4 py-2.5 flex items-center gap-3 hover:bg-github-blue/10 cursor-pointer group transition-colors"
                                        >
                                            <User size={14} className="text-github-muted group-hover:text-github-blue hover:scale-110 transition-transform" />
                                            <span className="text-sm font-bold text-github-text group-hover:text-white">@{s}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-6 ml-4 text-xs font-bold uppercase tracking-widest text-github-muted">
                    <a href="#" className="hover:text-white transition-colors">Pull requests</a>
                    <a href="#" className="hover:text-white transition-colors">Issues</a>
                    <a href="#" className="hover:text-white transition-colors border-b-2 border-github-blue pb-0.5 text-white">Explore</a>
                </div>
            </div>

            <div className="flex items-center gap-5">
                <div className="hidden sm:flex items-center gap-4 border-r border-github-border pr-5">
                    <div className="relative cursor-pointer group">
                        <Bell className="text-github-muted group-hover:text-white transition-colors" size={18} />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-github-blue rounded-full border-2 border-github-dark"></span>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer group text-github-muted hover:text-white transition-colors">
                        <Plus size={18} />
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 16 16"><path d="M4.427 7.427l3.396 3.396 3.396-3.396a.25.25 0 01.354 0l.707.707a.25.25 0 010 .354l-4.276 4.276a.25.25 0 01-.354 0L3.366 8.488a.25.25 0 010-.354l.707-.707a.25.25 0 01.354 0z" /></svg>
                    </div>
                </div>

                <div className="flex items-center gap-2 group relative">
                    <button className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-github-blue/50 rounded-full p-0.5 transition-all">
                        <img
                            src={userpic || "https://github.com/identicons/jasonlong.png"}
                            alt={username}
                            className="w-8 h-8 rounded-full border border-github-border group-hover:opacity-80 transition-all shadow-lg"
                        />
                        <svg className="w-3 h-3 fill-github-muted group-hover:fill-white transition-colors" viewBox="0 0 16 16"><path d="M4.427 7.427l3.396 3.396 3.396-3.396a.25.25 0 01.354 0l.707.707a.25.25 0 010 .354l-4.276 4.276a.25.25 0 01-.354 0L3.366 8.488a.25.25 0 010-.354l.707-.707a.25.25 0 01.354 0z" /></svg>
                    </button>

                    <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-[#161b22] border border-github-border rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:visible group-hover:scale-100 transition-all duration-200 py-3 z-50 overflow-hidden ring-1 ring-white/5">
                        <div className="px-5 py-3 border-b border-github-border mb-2 bg-[#0d1117]/50">
                            <p className="text-[10px] text-github-muted uppercase font-black tracking-widest mb-1">Signed in as</p>
                            <p className="text-sm font-bold truncate text-white">@{username}</p>
                        </div>

                        <div className="space-y-0.5 px-2">
                            <Link to="/" onClick={() => typeof onUserSearch === 'function' && onUserSearch(username)} className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-github-text hover:bg-github-blue/10 hover:text-github-blue rounded-lg transition-colors group/item">
                                <User size={14} className="text-github-muted group-hover/item:text-github-blue" />
                                Your Profile
                            </Link>
                            <a href="#" className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-github-text hover:bg-github-blue/10 hover:text-github-blue rounded-lg transition-colors group/item">
                                <Book size={14} className="text-github-muted group-hover/item:text-github-blue" />
                                Your Repositories
                            </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-github-text hover:bg-github-blue/10 hover:text-github-blue rounded-lg transition-colors group/item border-b border-github-border/30 pb-3 mb-1">
                                <Settings size={14} className="text-github-muted group-hover/item:text-github-blue" />
                                Settings
                            </a>

                            <button
                                onClick={handleSignOut}
                                className="w-full text-left px-4 py-3 text-xs font-black text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all flex items-center gap-3 mt-1"
                            >
                                <LogOut size={14} />
                                SIGN OUT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
