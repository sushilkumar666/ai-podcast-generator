import { useState, useEffect } from "react";

interface Podcast {
    id: string;
    topic: string;
    audioUrl: string;
    script: string;
    comments: string[];
    timestamp: string;
}

export default function PodcastForm() {
    const [topic, setTopic] = useState("");
    const [currentAudio, setCurrentAudio] = useState<Podcast | null>(null);
    const [history, setHistory] = useState<Podcast[]>([]);
    const [showScript, setShowScript] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<string | null>(null);
    const [darkMode, setDarkMode] = useState(false);

    // Load saved data on initial render
    useEffect(() => {
        const savedHistory = localStorage.getItem('podcastHistory');
        const savedCurrentAudio = localStorage.getItem('currentPodcast');
        const savedDarkMode = localStorage.getItem('darkMode');

        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Error loading history:", e);
            }
        }

        if (savedCurrentAudio) {
            try {
                setCurrentAudio(JSON.parse(savedCurrentAudio));
            } catch (e) {
                console.error("Error loading current podcast:", e);
            }
        }

        if (savedDarkMode === 'true') {
            setDarkMode(true);
        }
    }, []);

    // Save data whenever it changes
    useEffect(() => {
        if (history.length > 0) {
            localStorage.setItem('podcastHistory', JSON.stringify(history));
        }
    }, [history]);

    useEffect(() => {
        if (currentAudio) {
            localStorage.setItem('currentPodcast', JSON.stringify(currentAudio));
        }
    }, [currentAudio]);

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode.toString());
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    // Format current date for timestamp
    const getTimestamp = () => {
        const now = new Date();
        return now.toLocaleString();
    };

    // Generate unique ID
    const generateId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!topic.trim() || isLoading) return;

        setIsLoading(true);

        const newPodcastId = generateId();

        // Show loading state
        setCurrentAudio({
            id: newPodcastId,
            topic: topic,
            audioUrl: "",
            script: "Generating your podcast...",
            comments: [],
            timestamp: getTimestamp()
        });

        setSelectedHistoryItem(newPodcastId);

        const generatePodcast = async () => {
            try {
                // Simulate API call with timeout for demo
                const res = await fetch("http://localhost:5000/api/podcast/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ topic }),
                });

                const data = await res.json();

                if (data.audioUrl && data.script) {
                    const newPodcast = {
                        id: newPodcastId,
                        topic,
                        audioUrl: data.audioUrl,
                        script: data.script,
                        comments: data.comments || [],
                        timestamp: getTimestamp()
                    };

                    setCurrentAudio(newPodcast);
                    // Add to history
                    setHistory(prev => [newPodcast, ...prev]);
                    setTopic("");
                    setShowScript(true);
                }
            } catch (error) {
                console.error("Failed to generate podcast:", error);
                //@ts-ignore
                setCurrentAudio(prev => ({
                    ...prev,
                    script: "Failed to generate podcast. Please try again."
                }));
            } finally {
                setIsLoading(false);
            }
        };

        generatePodcast();
    };

    const selectHistoryItem = (id: string) => {
        setSelectedHistoryItem(id);
    };

    const toggleScript = () => {
        setShowScript(!showScript);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Get the selected podcast based on ID
    const selectedPodcast = selectedHistoryItem
        ? (currentAudio?.id === selectedHistoryItem ? currentAudio : history.find(item => item.id === selectedHistoryItem))
        : null;

    // All podcasts for the sidebar (current + history)
    const allPodcasts = currentAudio
        ? [currentAudio, ...history.filter(item => item.id !== currentAudio.id)]
        : history;

    return (
        <div className={`flex flex-col md:flex-row h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            {/* Left Sidebar - History */}
            <div className={`md:w-1/4 border-r ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-4 overflow-y-auto`}>
                {/* Header & Dark Mode Toggle */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-indigo-800'}`}>
                        Podcast History
                    </h2>
                    <button
                        onClick={toggleDarkMode}
                        className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-800'}`}
                    >
                        {darkMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* New Podcast Input */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Enter podcast topic"
                            className={`w-full p-2 pr-16 rounded-lg focus:outline-none focus:ring-2 ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-indigo-500 placeholder-gray-400'
                                : 'border border-gray-300 focus:ring-indigo-500'
                                }`}
                            disabled={isLoading}
                        />
                        <button
                            //@ts-ignore
                            onClick={handleSubmit}
                            disabled={isLoading || !topic.trim()}
                            className={`absolute right-0 top-0 h-full px-3 rounded-r-lg transition duration-200 flex items-center justify-center ${isLoading || !topic.trim()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : darkMode
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </span>
                            ) : (
                                <span>🎙️</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* History List */}
                <div className="space-y-2">
                    {allPodcasts.map((podcast) => (
                        <div
                            key={podcast.id}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedHistoryItem === podcast.id
                                ? darkMode
                                    ? 'bg-gray-700 border-l-4 border-indigo-500'
                                    : 'bg-indigo-100 border-l-4 border-indigo-500'
                                : darkMode
                                    ? 'hover:bg-gray-700'
                                    : 'hover:bg-gray-100'
                                }`}
                            onClick={() => selectHistoryItem(podcast.id)}
                        >
                            <h3 className={`font-medium truncate ${darkMode ? 'text-gray-100' : selectedHistoryItem === podcast.id ? 'text-indigo-800' : 'text-gray-800'
                                }`}>
                                {podcast.topic}
                            </h3>
                            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {podcast.timestamp}
                            </p>
                        </div>
                    ))}

                    {allPodcasts.length === 0 && (
                        <div className={`text-center p-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No podcasts yet. Create your first one!
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 p-4 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                {selectedPodcast ? (
                    <div className="max-w-3xl mx-auto">
                        {/* Podcast Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h1 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-indigo-900'}`}>
                                {selectedPodcast.topic}
                            </h1>
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {selectedPodcast.timestamp}
                            </span>
                        </div>

                        {/* Loading Indicator */}
                        {isLoading && currentAudio?.id === selectedHistoryItem && (
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-indigo-50'} p-6 rounded-lg mb-6 text-center`}>
                                <div className="flex items-center justify-center space-x-2">
                                    <svg className={`animate-spin h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-indigo-800'}`}>
                                        Generating your podcast, please wait...
                                    </span>
                                </div>
                                <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Our AI is crafting a podcast based on: "{topic}"
                                </p>
                            </div>
                        )}

                        {/* Audio Player */}
                        {selectedPodcast.audioUrl && (!isLoading || currentAudio?.id !== selectedHistoryItem) && (
                            <div className={`${darkMode
                                ? 'bg-gradient-to-r from-gray-800 to-gray-700'
                                : 'bg-gradient-to-r from-indigo-50 to-purple-50'
                                } p-6 rounded-lg shadow-md mb-6`}>
                                <div className="flex items-center justify-center">
                                    <audio
                                        controls
                                        src={`http://localhost:5000${selectedPodcast.audioUrl}`}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Script Section */}
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md mb-6`}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                    📝 Podcast Script
                                </h2>
                                <button
                                    onClick={toggleScript}
                                    className={`${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} flex items-center`}
                                >
                                    {showScript ? "Hide" : "Show"}
                                    <span className="ml-1">{showScript ? "▲" : "▼"}</span>
                                </button>
                            </div>

                            {showScript && (
                                <div className={`${darkMode
                                    ? 'bg-gray-700 border-gray-600'
                                    : 'bg-gray-50 border-gray-200'
                                    } p-4 rounded-lg whitespace-pre-wrap max-h-96 overflow-y-auto border`}>
                                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                        {selectedPodcast.script}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Comments Section */}
                        {selectedPodcast.comments && selectedPodcast.comments.length > 0 && (
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
                                <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                    💬 Listener Comments
                                </h2>
                                <div className="space-y-3">
                                    {selectedPodcast.comments.map((comment, index) => (
                                        <div key={index} className={`${darkMode
                                            ? 'bg-gray-700 border-l-4 border-amber-500'
                                            : 'bg-amber-50 border-l-4 border-amber-300'
                                            } p-4 rounded-lg`}>
                                            <p className={darkMode ? 'text-gray-300' : 'text-amber-800'}>
                                                {comment}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className={`text-center p-8 rounded-lg shadow-md max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'
                            }`}>
                            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-gray-100' : 'text-indigo-800'}`}>
                                Welcome to AI Podcast Generator
                            </h2>
                            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Create a new podcast or select one from your history to get started.
                            </p>
                            <div className="flex justify-center">
                                <svg className={`w-24 h-24 ${darkMode ? 'text-indigo-400' : 'text-indigo-400'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}