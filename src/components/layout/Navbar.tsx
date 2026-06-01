const Navbar = () => (
  <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-center pointer-events-none">
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2.5 flex items-center gap-8 pointer-events-auto shadow-2xl">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_var(--color-accent)]" />
        <span className="text-[10px] font-mono tracking-widest text-white/80">SYSTEM: ONLINE</span>
      </div>
      <div className="h-4 w-[1px] bg-white/10" />
      <div className="flex items-center gap-4">
         <span className="text-[10px] font-mono text-white/40">OPERATOR: {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </div>
  </nav>
);

export default Navbar;
