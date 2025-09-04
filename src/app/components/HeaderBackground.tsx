interface HeaderBackgroundProps {
  onLogoClick?: () => void;
  onProjectsClick?: () => void;
  onContactClick?: () => void;
  onAboutClick?: () => void;
}

export default function HeaderBackground({ 
  onLogoClick, 
  onProjectsClick, 
  onContactClick,
  onAboutClick

}: HeaderBackgroundProps) {
  return (
    <div 
      className="fixed top-0 left-0 z-50 w-full h-20 backdrop-blur-lg border-b"
      style={{
        backgroundColor: '#191970',
        borderColor: 'rgba(235, 228, 215, 0.3)',
        fontFamily: 'Figtree, sans-serif'
      }}
    >
      <div className="h-full flex items-center justify-between px-8 relative">
        <div
          className="cursor-pointer"
          onClick={onLogoClick}
        >
          <h1 className="text-2xl font-bold text-white hover:text-blue-600 transition-colors">
            Ceyhun Tunalı
            <span 
              className="ml-2 hover:opacity-80 transition-opacity"
              style={{ color: '#96DED1' }}
            >
              &amp; Sons
            </span>
          </h1>
        </div>

        {/* Centered Navigation */}
        <nav className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-8">
          <button
            onClick={onAboutClick}
            className="text-white hover:text-blue-300 transition-colors text-lg font-medium"
          >
            Hakkımızda
          </button>
          <button
            onClick={onProjectsClick}
            className="text-white hover:text-blue-300 transition-colors text-lg font-medium"
          >
            Projelerimiz
          </button>
          <button
            onClick={onContactClick}
            className="text-white hover:text-blue-300 transition-colors text-lg font-medium"
          >
            İletişim
          </button>
        </nav>
      </div>
    </div>
  );
}