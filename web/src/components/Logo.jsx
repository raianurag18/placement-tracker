import React from 'react';
import { GraduationCap, TrendingUp } from 'lucide-react';

const Logo = ({ className = "", collapsed = false, variant = "dark" }) => {
    // variant 'light' = For Dark Backgrounds (White Text)
    // variant 'dark'  = For Light Backgrounds (Dark Text)

    // Icon Logic: We want a brand mark that works on both.
    // We'll use a White Circle background for the icon if on Dark Mode to make it pop?
    // Or just keep the gradient.

    return (
        <div className={`flex items-center gap-3 ${className} group select-none`}>
            {/* 
                ICON CONTAINER 
                - flex-shrink-0 is CRITICAL to prevent the "squishing" issue the user reported.
            */}
            <div className="relative flex-shrink-0">
                {/* Main Brand Shape */}
                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <GraduationCap className="h-6 w-6 text-white stroke-[2.5]" />
                </div>

                {/* The "Growth" Accent - Overlaid */}
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 border-2 border-slate-900/5 shadow-sm">
                    <TrendingUp className="h-3.5 w-3.5 text-green-500 stroke-[3]" />
                </div>
            </div>

            {/* TEXT BRANDING */}
            {!collapsed && (
                <div className="flex flex-col">
                    <h1 className={`font-black text-xl tracking-tight leading-none ${variant === 'light' ? 'text-white' : 'text-slate-900'
                        }`}>
                        PLACERRA
                    </h1>
                    <span className={`text-[0.65rem] font-bold uppercase tracking-widest ${variant === 'light' ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                        Placement Tracker
                    </span>
                </div>
            )}
        </div>
    );
};

export default Logo;
