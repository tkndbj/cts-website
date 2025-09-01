export default function HeaderBackground() {
  return (
    <>
      <div className="second-header-bg fixed top-0 left-0 w-full z-46 pointer-events-none">
        <div className="h-20 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 shadow-xl flex items-center justify-center"></div>
      </div>

      <style jsx>{`
        .second-header-bg {
          opacity: 0;
          animation: header-bg-appear linear both;
          animation-timeline: scroll(root);
          animation-range: 75% 82%;
        }
        @keyframes header-bg-appear {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @media (max-width: 480px) {
          .second-header-bg {
            height: 260px;
          }
        }
      `}</style>
    </>
  );
}
