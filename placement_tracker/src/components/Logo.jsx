import React from 'react';
import { GraduationCap } from 'lucide-react';

const Logo = ({ className = "", collapsed = false, variant = "dark" }) => {
    const textColor = variant === "light" ? "text-white" : "text-slate-900";
    const iconColor = "text-blue-600";

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="bg-blue-600/10 p-2 rounded-lg border border-blue-600/20 flex items-center justify-center">
                <GraduationCap className={`h-6 w-6 ${iconColor}`} />
            </div>
            {!collapsed && (
                <span className={`font-bold text-xl tracking-tight ${textColor}`}>
                    Placerra
                </span>
            )}
        </div>
    );
};

export default Logo;
