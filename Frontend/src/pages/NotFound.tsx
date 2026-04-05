import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  useEffect(() => {
    console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <div className={`flex min-h-screen items-center justify-center bg-background px-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="text-center max-w-sm">
        <h1 className="mb-6 text-7xl font-extrabold text-primary animate-pulse">404</h1>
        <p className="mb-8 text-xl text-muted-foreground font-medium">{t.common.notFound}</p>
        <Button 
          onClick={() => navigate('/')} 
          className="w-full h-12 rounded-xl text-base font-semibold transition-all hover:scale-105"
        >
          {t.common.returnHome}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
