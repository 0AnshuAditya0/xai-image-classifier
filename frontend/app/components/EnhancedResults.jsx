'use client';

export default function EnhancedResults({ result, imagePreview, imageMetadata, onBack, onAnalyzeAnother }) {
    const isAttacked = result.metadata?.stress_active;

    const sourceImageSrc = isAttacked && result.visualizations?.perturbed_image
        ? `data:image/png;base64,${result.visualizations.perturbed_image}`
        : imagePreview;

    const heatmapSrc = result.visualizations?.main
        ? `data:image/png;base64,${result.visualizations.main}`
        : null;

    const predictions = result.prediction.top_predictions.slice(0, 5);

    const primaryColorClass = isAttacked ? 'bg-red-600' : 'bg-[#3B82F6]';
    const secondaryColorClass = isAttacked ? 'bg-red-900/40' : 'bg-[#3B82F6]/30';
    const textColorClass = isAttacked ? 'text-red-500' : 'text-[#3B82F6]';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isAttacked && (
                <div className="flex items-center gap-3 p-4 border border-red-900/50 bg-red-950/20 mb-8 rounded-sm animate-pulse">
                    <span className="material-symbols-outlined text-red-500 text-sm" data-icon="warning">warning</span>
                    <span className="text-[10px] text-red-400 font-bold tracking-widest uppercase">
                        Stress test active: The AI is being tested with a modified image.
                    </span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="border border-[#1E293B] bg-[#111111] p-1 h-full flex flex-col hover:border-[#3B82F6]/30 transition-colors duration-500">
                        <div className="p-4 border-b border-[#1E293B] flex justify-between items-center bg-[#0A0A0A]">
                            <span className="text-[10px] font-bold text-white tracking-widest uppercase">Original Photo</span>
                            <span className="text-[10px] font-medium text-slate-600 tracking-widest uppercase truncate ml-2">ID: {result.analysis_id || 'LOCAL'}</span>
                        </div>
                        <div className="relative flex-grow bg-black flex items-center justify-center p-2 min-h-[300px]">
                            {sourceImageSrc ? (
                                <img src={sourceImageSrc} alt="Source" className={`max-w-full max-h-full object-contain transition-all duration-700 ${isAttacked ? 'opacity-90 grayscale-0' : 'grayscale opacity-80'}`} />
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="border border-[#1E293B] bg-[#111111] p-1 h-full flex flex-col hover:border-[#3B82F6]/30 transition-colors duration-500">
                        <div className="p-4 border-b border-[#1E293B] flex justify-between items-center bg-[#0A0A0A]">
                            <span className="text-[10px] font-bold text-white tracking-widest uppercase">XAI Focus Map</span>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 ${primaryColorClass} animate-pulse`}></div>
                                <span className="text-[10px] font-medium text-slate-600 tracking-widest uppercase">XAI Logic Map</span>
                            </div>
                        </div>
                        <div className="relative flex-grow bg-black flex items-center justify-center p-2 min-h-[300px]">
                            {heatmapSrc ? (
                                <img src={heatmapSrc} alt="Heatmap" className="max-w-full max-h-full object-contain grayscale opacity-60 mix-blend-screen transition-opacity duration-1000" />
                            ) : (
                                <span className="text-slate-600 text-xs tracking-widest uppercase">Loading map...</span>
                            )}
                            <div className={`absolute inset-0 bg-gradient-to-tr ${isAttacked ? 'from-red-600/20 via-transparent to-red-900/10' : 'from-[#3B82F6]/30 via-transparent to-blue-500/10'} mix-blend-overlay pointer-events-none`}></div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="border border-[#1E293B] bg-[#111111] h-full flex flex-col hover:border-[#3B82F6]/30 transition-colors duration-500">
                        <div className="p-6 border-b border-[#1E293B] bg-[#0A0A0A]">
                            <span className="text-[10px] font-bold text-white tracking-widest uppercase">XAI Results</span>
                        </div>
                        <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                            {predictions.map((pred, index) => {
                                const roundedConf = parseFloat(pred.confidence.toFixed(1));
                                const isTop = index === 0;
                                return (
                                    <div key={index} className="space-y-2 group">
                                        <div className="flex justify-between items-end">
                                            <span className={`text-[11px] font-bold tracking-widest uppercase truncate mr-4 transition-colors ${isTop ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                                {pred.class}
                                            </span>
                                            <span className={`text-[11px] font-black tracking-tighter ${isTop ? textColorClass : 'text-slate-500'}`}>
                                                {roundedConf}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1 bg-[#1E293B] overflow-hidden">
                                            <div className={`h-full transition-all duration-1000 ease-out ${isTop ? primaryColorClass : secondaryColorClass}`} style={{ width: `${roundedConf}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-[#1E293B] pt-8">
                <div>
                    <h4 className="text-[10px] font-black text-slate-600 tracking-widest uppercase mb-4">Analysis Speed</h4>
                    <p className="text-2xl font-light text-white tracking-tighter transition-all duration-300">
                        {result.metadata?.speed || 'Turbo'}
                        <span className={`text-[10px] font-bold ${textColorClass} ml-2 uppercase`}>Engine</span>
                    </p>
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-slate-600 tracking-widest uppercase mb-4">Processing</h4>
                    <p className="text-2xl font-light text-white tracking-tighter">
                        Active <span className="text-[10px] font-bold text-slate-600 ml-2 uppercase">Core</span>
                    </p>
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-slate-600 tracking-widest uppercase mb-4">Success Rate</h4>
                    <p className="text-2xl font-light text-white tracking-tighter">
                        99.2% <span className="text-[10px] font-bold text-slate-600 ml-2 uppercase">Global</span>
                    </p>
                </div>
                <div className="flex items-end justify-end space-x-4">
                    <button onClick={onAnalyzeAnother} className="w-full bg-[#111111] border border-[#1E293B] text-slate-500 hover:text-white px-6 py-4 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 hover:bg-[#1A1A1A] flex-1">
                        Clear ALL
                    </button>
                    <button onClick={onBack} className={`w-full ${primaryColorClass} text-white px-6 py-4 text-[10px] font-bold tracking-widest uppercase hover:brightness-110 transition-all duration-300 hover:scale-[1.05] flex-1 shadow-[0_0_15px_rgba(59,130,246,0.2)]`}>
                        Analyze New
                    </button>
                </div>
            </footer>
        </div>
    );
}
