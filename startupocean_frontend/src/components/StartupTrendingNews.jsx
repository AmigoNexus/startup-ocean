import { useState, useEffect } from "react";
import { ExternalLink, TrendingUp, Globe, MapPin, CheckCircle2, Megaphone, Rocket } from "lucide-react";

export const startupOceanAds = [
    {
        id: "startup-ad-1",
        type: "promo",
        title: "Connect with India's Startups on StartupOcean!",
        description:
            "Discover innovative startups, find collaboration opportunities, and grow your network. Join thousands of entrepreneurs building the future together.",
        ctaText: "Explore Startups",
        ctaLink: "/search",
        isAd: true
    },
    {
        id: "startup-ad-2",
        type: "news",
        source: "StartupOcean Insights",
        title: "Startups finding perfect partners faster!",
        description:
            "StartupOcean platform enables entrepreneurs to discover collaboration opportunities, attend networking events, and connect with like-minded founders.",
        ctaText: "Join the Community",
        ctaLink: "/register",
        isAd: true
    },
    {
        id: "startup-ad-3",
        type: "promo",
        title: "Showcase Your Startup to Investors",
        description:
            "Create your company profile, highlight your achievements, and get discovered by investors and potential partners looking for innovative solutions.",
        ctaText: "Create Profile",
        ctaLink: "/register",
        isAd: true
    },
    {
        id: "startup-ad-4",
        type: "news",
        source: "Ecosystem Update",
        title: "Networking events connecting founders weekly!",
        description:
            "StartupOcean hosts regular meetups, pitch sessions, and networking events where entrepreneurs can share ideas and form strategic partnerships.",
        ctaText: "View Events",
        ctaLink: "/events",
        isAd: true
    },
    {
        id: "startup-ad-5",
        type: "promo",
        title: "Find Your Perfect Co-Founder",
        bulletPoints: [
            "Search by skills and expertise",
            "View detailed startup profiles",
            "Connect directly with founders",
            "Join collaboration projects"
        ],
        description:
            "Advanced search tools to help you find the right partners for your startup journey.",
        isAd: true
    },
    {
        id: "startup-ad-6",
        type: "news",
        source: "Platform News",
        title: "500+ successful collaborations formed!",
        description:
            "StartupOcean members are building innovative products together, sharing resources, and creating impactful ventures across industries.",
        isAd: true
    }
];

export default function StartupTrendingNews() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(
                    "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3Dstartup%2Btechnology%2Binnovation%2Bwhen%3A7d%26hl%3Den-IN%26gl%3DIN%26ceid%3DIN%3Aen"
                );
                const data = await response.json();

                if (data.status === "ok" && data.items) {
                    const sortedNews = data.items.slice(0, 15).map((item) => ({
                        id: item.guid || Math.random().toString(36).substr(2, 9),
                        title: item.title,
                        description: item.description.replace(/<[^>]*>?/gm, '').slice(0, 150) + "...",
                        url: item.link,
                        publishedAt: item.pubDate,
                        source: { name: item.author || "Tech News" },
                        category: item.categories?.[0] || "Startup News"
                    })).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
                    setNews(sortedNews);
                }
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const combinedItems = [];
    let adIndex = 0;

    news.forEach((item, index) => {
        combinedItems.push(item);
        if ((index + 1) % 1 === 0 && adIndex < startupOceanAds.length) {
            combinedItems.push(startupOceanAds[adIndex]);
            adIndex++;
        }
    });

    return (
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
            <div className="container px-4 mx-auto mb-8  ">
                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="flex items-center gap-2 px-4 py-2 mb-4 text-sm font-semibold text-teal-600 bg-teal-100 rounded-full">
                        <Rocket size={16} />
                        Latest Updates
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-2xl">
                        What's <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-600">Trending</span> in Startups
                    </h2>
                    <p className="max-w-2xl mt-4 text-sm text-gray-600">
                        Stay ahead with the latest news on startups, innovation, technology, and entrepreneurship from around the world.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-2xl h-[420px] animate-pulse shadow-sm"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {combinedItems.map((item) => (
                            item.isAd ? (
                                <AdCard key={item.id} ad={item} />
                            ) : (
                                <a
                                    key={item.id}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col overflow-hidden transition-all bg-white shadow-sm rounded-2xl hover:shadow-xl group cursor-pointer border border-gray-100"
                                >
                                    {item.urlToImage && (
                                        <div className="overflow-hidden h-48 bg-gray-100">
                                            <img
                                                src={item.urlToImage}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800";
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className="flex flex-col flex-1 p-6">
                                        <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1 font-medium">
                                                <Globe size={14} />
                                                {item.source.name}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                {new Date(item.publishedAt).toLocaleDateString('en-IN', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <h3 className="mb-3 text-base font-bold text-gray-900 line-clamp-2 group-hover:text-teal-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="mb-6 text-xs leading-relaxed text-gray-600 line-clamp-3">
                                            {item.description}
                                        </p>
                                        <div className="mt-auto">
                                            <div className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 group-hover:text-teal-700">
                                                Read Full Article
                                                <ExternalLink size={16} className="transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            )
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function AdCard({ ad }) {
    return (
        <a
            href={ad.ctaLink || "/"}
            target={ad.ctaLink?.startsWith('http') ? "_blank" : "_self"}
            rel={ad.ctaLink?.startsWith('http') ? "noopener noreferrer" : undefined}
            className="flex flex-col overflow-hidden transition-all bg-gradient-to-br from-teal-50 to-teal-50 border-2 border-teal-100 shadow-sm rounded-2xl hover:shadow-xl hover:border-teal-200 group relative cursor-pointer"
        >
            <div className="absolute top-0 right-0 px-3 py-1 text-[10px] font-bold text-white bg-gradient-to-r from-teal-600 to-teal-600 rounded-bl-lg uppercase tracking-wider z-10">
                {ad.type === "news" ? "Featured" : "StartupOcean"}
            </div>
            <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-teal-600">
                    {ad.type === "news" ? <Globe size={14} /> : <Megaphone size={14} />}
                    {ad.type === "news" ? ad.source : "Promoted"}
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-teal-700 transition-colors">
                    {ad.title}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-gray-700 line-clamp-4">
                    {ad.description}
                </p>

                {ad.bulletPoints && (
                    <div className="space-y-2 mb-6">
                        {ad.bulletPoints.map((point, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-teal-500 flex-shrink-0" />
                                <span className="text-xs text-gray-700 font-medium">{point}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-auto">
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 group-hover:text-teal-800">
                        {ad.ctaText || (ad.type === "news" ? "Learn More" : "Explore Now")}
                        <ExternalLink size={16} className="transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        </a>
    );
}