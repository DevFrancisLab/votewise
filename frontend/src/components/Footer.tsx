const Footer = () => {
  return (
    <footer id="footer" className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-extrabold text-xl">VoteWise AI</span>
          <div className="flex gap-6 text-sm text-secondary-foreground/70">
            <a href="#" className="hover:text-secondary-foreground transition-colors">About</a>
            <a href="#" className="hover:text-secondary-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-secondary-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-secondary-foreground transition-colors">Contact</a>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-secondary-foreground/40">
          © {new Date().getFullYear()} VoteWise AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
