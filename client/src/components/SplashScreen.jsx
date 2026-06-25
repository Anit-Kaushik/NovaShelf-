import { useEffect, useState } from "react";

const SplashScreen = ({ children }) => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); 

    return () => clearTimeout(timer);

  }, []);

  if (loading) {

    return (

      <div className="fixed inset-0 bg-[#FFF7ED] flex items-center justify-center z-50">

        <div className="text-center">

          
          <h1
            className="text-7xl font-black text-[#EA580C]"
            style={{ fontFamily: "'Ibarra Real Nova', serif" }}
          >
            NovaShelf
          </h1>

          
          <div className="mt-8 w-52 h-1 bg-orange-200 rounded-full overflow-hidden mx-auto">

            <div className="h-full bg-[#EA580C] animate-[loading_2s_linear_infinite]"></div>

          </div>

        </div>

      </div>
    );
  }

  return children;
};

export default SplashScreen;