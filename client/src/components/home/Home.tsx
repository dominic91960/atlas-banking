import { useEffect } from "react";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/sign-in", { replace: true });
    return;
  }, [navigate]);

  return <div></div>;
};

export default Home;
