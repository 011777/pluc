import { logout } from "../services/auth";

export default function Dashboard({ user, onGoLive }) {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Logged in as {user.email}</p>

      <button
        onClick={() => {
          console.log("Go Live clicked");
          onGoLive();
        }}
      >
        Go Live
      </button>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}
