import React, { useState, useEffect } from 'react';
import { Search, Loader2, MapPin, Building2 } from 'lucide-react';
import { Input } from "./ui/input";

const InstituteSearch = ({ onSelect, className }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const fetchInstitutes = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }
            setIsSearching(true);
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/institutes/search?q=${query}`);
                const data = await res.json();
                setSuggestions(data);
                setShowSuggestions(true);
            } catch (err) {
                console.error("Failed to search institutes", err);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(fetchInstitutes, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSelect = (institute) => {
        setQuery(institute.name);
        setShowSuggestions(false);
        onSelect(institute);
    };

    return (
        <div className={`relative w-full ${className}`}>
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                    placeholder="Search your Institute (e.g. BIT Mesra, IIT Bombay)..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                    // onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
                    className="pl-12 h-14 text-lg bg-white border-slate-200 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl transition-all"
                    autoComplete="off"
                />
                {isSearching && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    </div>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute w-full z-50 bg-white border border-slate-200 rounded-xl mt-2 shadow-xl max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    <div className="p-2">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                            Found {suggestions.length} Institutes
                        </div>
                        {suggestions.map((inst) => (
                            <div
                                key={inst._id}
                                className="p-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 rounded-lg transition-colors group"
                                onClick={() => handleSelect(inst)}
                            >
                                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900">{inst.name}</div>
                                    <div className="flex items-center text-sm text-slate-500">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {inst.city}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showSuggestions && query.length >= 2 && suggestions.length === 0 && !isSearching && (
                <div className="absolute w-full z-50 bg-white border border-slate-200 rounded-xl mt-2 shadow-xl p-6 text-center">
                    <p className="text-slate-500">No institutes found matching "{query}"</p>
                </div>
            )}
        </div>
    );
};

export default InstituteSearch;
