import { Button, Card, Space, Typography } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useState } from "react";

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

export default function App() {
  const { isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently, user } = useAuth0();
  const [me, setMe] = useState<any>(null);

  const callMe = async () => {
    const token = await getAccessTokenSilently();
    const res = await api.get("/me", { headers: { Authorization: `Bearer ${token}` } });
    setMe(res.data);
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <Card>
        <Typography.Title level={3}>La Petite Maison de l’Épouvante</Typography.Title>
        <Space>
          {isAuthenticated ? (
            <>
              <Button onClick={callMe}>Call /me</Button>
              <Button danger onClick={() => logout({ logoutParams: { returnTo: globalThis.location.origin } })}>
                Logout
              </Button>
            </>
          ) : (
            <Button type="primary" onClick={() => loginWithRedirect()}>Login</Button>
          )}
        </Space>

        {isAuthenticated && (
          <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
            user: {JSON.stringify(user, null, 2)}
          </pre>
        )}

        {me && (
          <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
            /me: {JSON.stringify(me, null, 2)}
          </pre>
        )}
      </Card>
    </div>
  );
}
