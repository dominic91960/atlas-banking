import { useEffect } from "react";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard", { replace: true });
    return;
  }, [navigate]);

  return <div className="bg-secondary fixed inset-0"></div>;
};

export default Home;
