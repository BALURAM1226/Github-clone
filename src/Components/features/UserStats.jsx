import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Star, GitFork, Book, Code2, Trophy } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const UserStats = ({ repos, userProfile }) => {
    if (!repos || repos.length === 0) return null;

    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

    // Top Languages Logic
    const langCounts = {};
    repos.forEach(repo => {
        if (repo.language) {
            langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
        }
    });

    const sortedLangs = Object.entries(langCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const chartData = {
        labels: sortedLangs.map(l => l[0]),
        datasets: [{
            data: sortedLangs.map(l => l[1]),
            backgroundColor: [
                '#1f6feb', // GitHub Blue
                '#238636', // GitHub Green
                '#d29922', // GitHub Yellow
                '#da3633', // GitHub Red
                '#8b949e'  // GitHub Gray
            ],
            borderColor: '#0d1117',
            borderWidth: 2,
        }]
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#8b949e',
                    font: { size: 10, weight: 'bold' },
                    padding: 20
                }
            }
        },
        cutout: '70%'
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0d1117]/60 border border-github-border/30 p-4 rounded-2xl group hover:border-github-blue/30 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <Star size={16} className="text-yellow-500" />
                        </div>
                        <span className="text-[10px] font-black text-github-muted uppercase tracking-widest">Total Stars</span>
                    </div>
                    <p className="text-2xl font-black text-white">{totalStars}</p>
                </div>

                <div className="bg-[#0d1117]/60 border border-github-border/30 p-4 rounded-2xl group hover:border-github-blue/30 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-github-blue/10 rounded-lg">
                            <GitFork size={16} className="text-github-blue" />
                        </div>
                        <span className="text-[10px] font-black text-github-muted uppercase tracking-widest">Total Forks</span>
                    </div>
                    <p className="text-2xl font-black text-white">{totalForks}</p>
                </div>
            </div>

            <div className="bg-[#0d1117]/80 border border-github-border/40 p-6 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                        <Code2 size={16} className="text-github-blue" />
                        Language Mastery
                    </h3>
                    <Trophy size={16} className="text-github-muted" />
                </div>

                <div className="relative h-64 flex items-center justify-center">
                    <Doughnut data={chartData} options={chartOptions} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <p className="text-xs text-github-muted uppercase font-bold">Primary</p>
                        <p className="text-sm font-black text-white">{sortedLangs[0]?.[0] || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-github-blue/5 border border-github-blue/20 rounded-2xl flex flex-col items-center text-center">
                <p className="text-[10px] font-black text-github-blue uppercase tracking-widest mb-2">Developer Level</p>
                <h4 className="text-xl font-bold text-white mb-4">
                    {totalStars > 1000 ? "👑 Elite Maintainer" :
                        totalStars > 100 ? "🌟 Rising Star" : "💻 Active Contributor"}
                </h4>
                <div className="w-full h-1 bg-github-border/30 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-github-blue"
                        style={{ width: `${Math.min((totalStars / 500) * 100, 100)}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserStats;
