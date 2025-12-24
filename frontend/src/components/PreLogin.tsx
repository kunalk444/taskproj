function PreLogin(props: any) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-4xl rounded-3xl 
                      bg-slate-800/80 backdrop-blur-xl
                      shadow-2xl shadow-black/60 
                      border border-slate-700/50 
                      p-16">

        <span className="inline-block mb-6 text-sm font-semibold tracking-wide text-teal-400 uppercase">
          Task Management, Simplified
        </span>

        <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Organize work. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">
            Focus better.
          </span>
        </h1>

        <p className="text-xl text-slate-300 mb-14 max-w-2xl leading-relaxed">
          A modern task management platform built for speed,
          clarity, and effortless collaboration — without the clutter.
        </p>

        <div className="flex items-center gap-6">
          <button
            onClick={() => props.setshowsignup(true)}
            className="
              px-12 py-4 rounded-2xl
              bg-gradient-to-r from-teal-500 to-indigo-500
              text-white text-xl font-semibold
              hover:from-teal-400 hover:to-indigo-400
              transition-all duration-300
              shadow-xl shadow-teal-500/30
              hover:scale-[1.03]
              active:scale-[0.98]
            "
          >
            Get Started
          </button>

        </div>
      </div>
    </div>
  );
}

export default PreLogin;
