import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { startupOceanAds } from "./StartupTrendingNews";

export default function StartupTrendingNewsMini() {
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const rssUrl =
          "https://news.google.com/rss/search?q=startup+technology+innovation&hl=en-IN&gl=IN&ceid=IN:en";

        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
          rssUrl
        )}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === "ok") {
          const newsItems = data.items.slice(0, 5).map((item) => ({
            id: item.guid,
            title: item.title,
            description: item.description
              .replace(/<[^>]*>?/gm, "")
              .slice(0, 120),
            link: item.link,
            isAd: false,
          }));

          const combined = [];
          let adIndex = 0;

          newsItems.forEach((n) => {
            combined.push(n);

            if (adIndex < startupOceanAds.length) {
              combined.push(startupOceanAds[adIndex]);
              adIndex++;
            }
          });

          setItems(combined);
        }
      } catch (err) {
        console.error("Mini Trending Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [items]);

  const handleClick = (item) => {
    if (item.isAd) {
      navigate(item.ctaLink);
    } else {
      window.open(item.link, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4  ">
        <div className="p-6 text-center text-gray-500">
          Loading Trending News...
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4  ">
        <div className="p-6 text-center text-red-500">
          News not available right now.
        </div>
      </div>
    );
  }

  const item = items[current];

  return (
    <div className="container mx-auto px-4  ">
      <div
      onClick={() => handleClick(item)}
      className="bg-white rounded-xl shadow-md border p-5 cursor-pointer hover:shadow-lg transition"
    >
      <h3 className="text-base font-bold text-center text-teal-600 mb-4">
        Trending Updates
      </h3>
      {item.isAd && (
        <p className="text-xs font-bold text-white bg-teal-600 px-3 py-1 rounded-full inline-block mb-3">
          StartupOcean
        </p>
      )}
      <h2 className="text-sm font-semibold text-gray-800 mb-3 line-clamp-2">
        {item.title}
      </h2>
      <p className="text-xs text-gray-600 mb-4 line-clamp-3">
        {item.description}...
      </p>
      <div className="flex justify-center items-center gap-2 text-sm font-semibold text-teal-600">
        {item.isAd ? item.ctaText || "Explore →" : "Read Full Article"}
        <ExternalLink size={16} />
      </div>
      <div className="flex justify-center gap-2 mt-5">
        {items.map((_, idx) => (
          <span
            key={idx}
            className={`w-2.5 h-2.5 rounded-full ${idx === current ? "bg-teal-600" : "bg-gray-300"
              }`}
          />
        ))}
      </div>
    </div>
    </div>
  );
}
