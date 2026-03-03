import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, GithubAuthProvider, signInWithPopup } from '../services/firebase';
import Navbar from '../Components/layout/Navbar';
import LoginPage from './LoginPage';
import RepoList from '../Components/features/RepoList';
import UserStats from '../Components/features/UserStats';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Github, MapPin, Link as LinkIcon, Calendar, BookOpen, Star, GitFork, Pin, LayoutDashboard, BarChart3, Info, Globe, Activity, ShieldCheck, AlertCircle, RefreshCcw } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [user, loadingAuth] = useAuthState(auth);
    const [currentUser, setCurrentUser] = useState(window.localStorage.getItem('login') || '');
    const [userPic, setUserPic] = useState(window.localStorage.getItem('userpic') || '');
    const [searchUser, setSearchUser] = useState(currentUser);
    const [userProfile, setUserProfile] = useState(null);
    const [allRepos, setAllRepos] = useState([]);
    const [trendingRepos, setTrendingRepos] = useState([]);
    const [pinnedRepos, setPinnedRepos] = useState([]);

    const [loadingTrending, setLoadingTrending] = useState(true);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [apiError, setApiError] = useState(null);

    // 1. Initial State Sync & Fallback Derivation
    useEffect(() => {
        if (user && !currentUser) {
            // Try different paths for GitHub username in Firebase object
            const login =
                user.reloadUserInfo?.screenName ||
                user.displayName?.replace(/\s+/g, '') ||
                user.email?.split('@')[0] ||
                "";

            if (login) {
                console.log("Derived user:", login);
                setCurrentUser(login);
                setSearchUser(login);
                setUserPic(user.photoURL);
                window.localStorage.setItem('login', login);
                window.localStorage.setItem('userpic', user.photoURL);
            }
        }
    }, [user, currentUser]);

    // Force sync searchUser if currentUser finally loads
    useEffect(() => {
        if (currentUser && !searchUser) {
            setSearchUser(currentUser);
        }
    }, [currentUser, searchUser]);

    // 2. Fetching Logic with Error Handling
    const fetchDashboardData = async () => {
        if (!searchUser) return;
        setLoadingProfile(true);
        setApiError(null);
        try {
            // Fetch Profile
            const profileRes = await axios.get(`https://api.github.com/users/${searchUser}`);
            setUserProfile(profileRes.data);

            // Fetch Top Repos for Featured
            const reposRes = await axios.get(`https://api.github.com/users/${searchUser}/repos?sort=stars&per_page=30`);
            setAllRepos(reposRes.data);

            const sorted = [...reposRes.data].sort((a, b) => b.stargazers_count - a.stargazers_count);
            setPinnedRepos(sorted.slice(0, 4));
        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
            if (err.response?.status === 403) {
                setApiError("GitHub API Rate Limit Reached. Please try again in a few minutes.");
            } else {
                setApiError("Failed to connect to GitHub. Please check your username.");
            }
        } finally {
            setLoadingProfile(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [searchUser]);

    useEffect(() => {
        const fetchTrending = async () => {
            setLoadingTrending(true);
            try {
                const res = await axios.get('https://api.github.com/search/repositories?q=stars:>10000&sort=stars&per_page=5');
                setTrendingRepos(res.data.items);
            } catch (err) {
                console.error("Trending Error:", err);
            } finally {
                setLoadingTrending(false);
            }
        };
        fetchTrending();
    }, []);

    if (loadingAuth) return (
        <div className="min-h-screen bg-[#010409] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-github-blue/20 border-t-github-blue rounded-full animate-spin" />
        </div>
    );

    if (!user) return <LoginPage githubSignIn={() => signInWithPopup(auth, new GithubAuthProvider())} />;

    return (
        <div className="min-h-screen bg-[#010409] font-sans text-github-text">
            <Navbar username={currentUser} userpic={userPic} onUserSearch={(u) => { setSearchUser(u); setActiveTab('overview'); }} />

            <main className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- SIDEBAR --- */}
                <aside className="lg:col-span-3 space-y-6">

                    {/* User Profile Card - ALWAYS VISIBLE SHELL */}
                    <div className="bg-[#0d1117] border border-github-border/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden min-h-[400px]">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Github size={100} /></div>

                        {loadingProfile ? (
                            <div className="animate-pulse space-y-4">
                                <div className="w-24 h-24 bg-github-border/40 rounded-3xl" />
                                <div className="h-6 bg-github-border/40 rounded-lg w-3/4" />
                                <div className="h-4 bg-github-border/40 rounded-lg w-1/2" />
                            </div>
                        ) : apiError ? (
                            <div className="flex flex-col items-center justify-center text-center py-10">
                                <AlertCircle className="text-red-500 mb-4" size={40} />
                                <p className="text-xs font-bold text-github-muted mb-4">{apiError}</p>
                                <button onClick={fetchDashboardData} className="github-button text-[10px] px-4 py-2 flex items-center gap-2">
                                    <RefreshCcw size={12} /> Retry
                                </button>
                            </div>
                        ) : userProfile && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <img src={userProfile.avatar_url} className="w-24 h-24 rounded-3xl border-4 border-github-border mb-6 shadow-xl" />
                                <h2 className="text-2xl font-black text-white">{userProfile.name || userProfile.login}</h2>
                                <p className="text-github-blue font-bold text-sm mb-6 flex items-center gap-2">@{userProfile.login}</p>
                                <p className="text-sm text-github-muted italic mb-8 border-l-2 border-github-blue/40 pl-4 leading-relaxed">
                                    {userProfile.bio || "Crafting digital tools for the modern web."}
                                </p>
                                <div className="space-y-4 text-xs font-bold text-github-muted">
                                    <div className="flex items-center gap-3"><MapPin size={16} /> {userProfile.location || "Earth"}</div>
                                    <div className="flex items-center gap-3"><Users size={16} /> {userProfile.followers} Followers</div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="bg-[#0d1117] p-1.5 rounded-2xl border border-github-border/50 flex flex-col gap-1">
                        <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-4 px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'overview' ? 'bg-github-blue/10 text-github-blue border border-github-blue/20' : 'text-github-muted hover:bg-white/5'}`}>
                            <LayoutDashboard size={16} /> Overview
                        </button>
                        <button onClick={() => setActiveTab('stats')} className={`flex items-center gap-4 px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'stats' ? 'bg-github-blue/10 text-github-blue border border-github-blue/20' : 'text-github-muted hover:bg-white/5'}`}>
                            <BarChart3 size={16} /> Analytics
                        </button>
                    </div>

                    {/* Trending (Always rendering shell) */}
                    <div className="bg-[#0d1117] border border-github-border/50 rounded-3xl p-8 min-h-[300px]">
                        <h3 className="text-[10px] font-black text-github-blue uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                            <TrendingUp size={16} /> Trending
                        </h3>
                        <div className="space-y-5">
                            {loadingTrending ? [1, 2, 3].map(i => <div key={i} className="h-4 bg-white/5 rounded animate-pulse" />) : (
                                trendingRepos.map(repo => (
                                    <Link key={repo.id} to={`/repo/${repo.owner.login}/${repo.name}`} className="block group">
                                        <p className="text-xs font-bold group-hover:text-github-blue truncate">{repo.name}</p>
                                        <p className="text-[9px] text-github-muted mt-1 uppercase">@{repo.owner.login}</p>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </aside>

                {/* --- MAIN CONTENT --- */}
                <div className="lg:col-span-9 space-y-10">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' ? (
                            <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">

                                {/* Featured / Pinned - ALWAYS VISIBLE SHELL */}
                                <section className="min-h-[200px]">
                                    <div className="flex items-center gap-4 mb-6">
                                        <Pin size={18} className="text-github-blue" />
                                        <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Featured</h3>
                                        <div className="h-px bg-github-border flex-grow mt-1 opacity-20" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {loadingProfile ? [1, 2].map(i => <div key={i} className="h-40 bg-white/5 rounded-3xl animate-pulse" />) :
                                            pinnedRepos.length > 0 ? pinnedRepos.map(repo => (
                                                <Link key={repo.id} to={`/repo/${repo.owner.login}/${repo.name}`} className="group p-6 bg-[#0d1117] border border-github-border/40 hover:border-github-blue/40 rounded-3xl transition-all shadow-xl">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-github-blue font-black text-sm group-hover:text-white flex items-center gap-2">
                                                            <BookOpen size={14} /> {repo.name}
                                                        </span>
                                                        <Star size={12} className="text-yellow-500" />
                                                    </div>
                                                    <p className="text-xs text-github-muted line-clamp-2">{repo.description || "Project source code."}</p>
                                                </Link>
                                            )) : (
                                                <div className="col-span-full py-20 bg-white/5 rounded-3xl border border-dashed border-github-border flex flex-col items-center justify-center">
                                                    <Github className="opacity-10 mb-4" size={40} />
                                                    <p className="text-[10px] font-black uppercase text-github-muted">No Top Repositories Found</p>
                                                </div>
                                            )}
                                    </div>
                                </section>

                                {/* Main Repository List */}
                                <div className="bg-[#0d1117] border border-github-border/40 rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[600px]">
                                    <RepoList username={searchUser} />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="st" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-10">
                                <UserStats repos={allRepos} userProfile={userProfile} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
