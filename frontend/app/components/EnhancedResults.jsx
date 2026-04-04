'use client';

export default function EnhancedResults({ result, imagePreview, imageMetadata, onBack, onAnalyzeAnother }) {
    const isAttacked = result.metadata?.adversarial_attack_active;

    const sourceImageSrc = isAttacked && result.visualizations?.perturbed_image
        ? `data:image/png;base64,${result.visualizations.perturbed_image}`
        : imagePreview;

    const heatmapSrc = result.visualizations?.main
        ? `data:image/png;base64,${result.visualizations.main}`
        : null;

    const predictions = result.prediction.top_predictions.slice(0, 5);

    const primaryColorClass = isAttacked ? 'bg-red-500' : 'bg-[#3B82F6]';
    const secondaryColorClass = isAttacked ? 'bg-red-500/30' : 'bg-[#3B82F6]/30';
    const textColorClass = isAttacked ? 'text-red-500' : 'text-[#3B82F6]';

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {isAttacked && (
                <div className="flex items-center gap-3 p-3 border border-red-900/50 bg-red-950/10 mb-8">
                    <span className="material-symbols-outlined text-red-500 text-sm" data-icon="warning">warning</span>
                    <span className="text-[10px] text-red-400 font-medium tracking-wide uppercase">
                        Adversarial attack was successful. Neural network predictions compromised.
                    </span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="border border-[#1E293B] bg-[#111111] p-1 h-full flex flex-col">
                        <div className="p-4 border-b border-[#1E293B] flex justify-between items-center bg-[#0A0A0A]">
                            <span className="text-[10px] font-semibold text-white tracking-widest uppercase">Input Source</span>
                            <span className="text-[10px] font-medium text-slate-500 tracking-widest uppercase truncate ml-2">ID: {result.analysis_id?.substring(0,8) || 'Unknown'}</span>
                        </div>
                        <div className="relative flex-grow bg-black flex items-center justify-center p-2 min-h-[300px]">
                            {sourceImageSrc ? (
                                <img src={sourceImageSrc} alt="Source" className="max-w-full max-h-full object-contain grayscale opacity-80" />
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="border border-[#1E293B] bg-[#111111] p-1 h-full flex flex-col">
                        <div className="p-4 border-b border-[#1E293B] flex justify-between items-center bg-[#0A0A0A]">
                            <span className="text-[10px] font-semibold text-white tracking-widest uppercase">Grad-CAM Activation</span>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 ${primaryColorClass}`}></div>
                                <span className="text-[10px] font-medium text-slate-500 tracking-widest uppercase">Layer 4 Conv</span>
                            </div>
                        </div>
                        <div className="relative flex-grow bg-black flex items-center justify-center p-2 min-h-[300px]">
                            {heatmapSrc ? (
                                <img src={heatmapSrc} alt="Heatmap" className="max-w-full max-h-full object-contain grayscale opacity-40 mix-blend-screen mix-blend-normal" />
                            ) : (
                                <span className="text-slate-500 text-xs tracking-widest uppercase">Unavailable</span>
                            )}
                            <div className={`absolute inset-0 bg-gradient-to-tr ${isAttacked ? 'from-red-500/40 via-transparent to-red-600/30' : 'from-[#3B82F6]/40 via-transparent to-blue-500/30'} mix-blend-overlay pointer-events-none`}></div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="border border-[#1E293B] bg-[#111111] h-full flex flex-col">
                        <div className="p-6 border-b border-[#1E293B] bg-[#0A0A0A]">
                            <span className="text-[10px] font-semibold text-white tracking-widest uppercase">Classifier Confidence</span>
                        </div>
                        <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                            {predictions.map((pred, index) => {
                                const roundedConf = parseFloat(pred.confidence.toFixed(1));
                                const isTop = index === 0;
                                return (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className={`text-[11px] font-medium tracking-wide uppercase truncate mr-4 ${isTop ? 'text-white' : 'text-slate-400'}`}>
                                                {pred.class}
                                            </span>
                                            <span className={`text-[11px] font-bold ${isTop ? textColorClass : 'text-slate-400'}`}>
                                                {roundedConf}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-[#1E293B]">
                                            <div className={`h-full ${isTop ? primaryColorClass : secondaryColorClass}`} style={{ width: `${roundedConf}%` }}></div>
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
                    <h4 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-4">Inference Latency</h4>
                    <p className="text-2xl font-light text-white tracking-tighter">
                        {result.metadata?.inference_time_ms ? Math.round(result.metadata.inference_time_ms) : '--'}ms
                        <span className={`text-[10px] font-medium ${textColorClass} ml-2`}>CPU</span>
                    </p>
                </div>
                <div>
                    <h4 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-4">Execution Thread</h4>
                    <p className="text-2xl font-light text-white tracking-tighter">
                        0.0 <span className="text-[10px] font-medium text-slate-500 ml-2">Wait</span>
                    </p>
                </div>
                <div>
                    <h4 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-4">Top-1 Accuracy</h4>
                    <p className="text-2xl font-light text-white tracking-tighter">
                        98.4% <span className="text-[10px] font-medium text-slate-500 ml-2">Global</span>
                    </p>
                </div>
                <div className="flex items-end justify-end space-x-4">
                    <button onClick={onAnalyzeAnother} className="w-full bg-[#111111] border border-[#1E293B] text-slate-300 hover:text-white px-6 py-4 text-[10px] font-bold tracking-widest uppercase transition-none flex-1">
                        Reset Cache
                    </button>
                    <button onClick={onBack} className={`w-full ${primaryColorClass} text-white px-6 py-4 text-[10px] font-bold tracking-widest uppercase hover:brightness-110 transition-none flex-1`}>
                        Return Source
                    </button>
                </div>
            </footer>
        </div>
    );
}
