const Footer = () => {
  return (
    <footer className="text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-lg font-semibold">
              &copy; 2024 Expense Tracker. All rights reserved.
            </p>
          </div>
          <div className="flex  text-sm gap-20 p-2 mt-5">
            <a href="#about" className="hover:text-gray-400 transition-colors">
              About
            </a>
            <a
              href="#contact"
              className="hover:text-gray-400 transition-colors"
            >
              Contact
            </a>
            <a
              href="#privacy"
              className="hover:text-gray-400 transition-colors"
            >
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-gray-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
