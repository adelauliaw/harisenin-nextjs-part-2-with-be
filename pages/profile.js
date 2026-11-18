import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiRequest } from "../lib/api";
import { getToken, removeToken } from "../lib/auth";

export default function Profile() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    apiRequest("/profile", { auth: true })
      .then((result) => setProfile(result.data))
      .catch((error) => {
        setMessage(error.message);

        if (error.message.toLowerCase().includes("token")) {
          removeToken();
          router.replace("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <main>
      <h1>My Profile</h1>

      {message && <p>{message}</p>}

      {profile && (
        <>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
        </>
      )}

      <button onClick={handleLogout}>
        Logout
      </button>
    </main>
  );
}