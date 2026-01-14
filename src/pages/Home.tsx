import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>System Home</h1>

      <p>このページはシステムの入口です。</p>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <Link to="/issue">
          <button>IDを発行する</button>
        </Link>

        <Link to="/app">
          <button>システムに入る</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;