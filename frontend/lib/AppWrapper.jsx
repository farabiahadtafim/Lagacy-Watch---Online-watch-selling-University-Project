"use client";
import { AppProvider } from "./context";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "1055497562496-8bfmf7ogfuplvt9ju550hkvrsqjs9a5i.apps.googleusercontent.com";

export default function AppWrapper({ children }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppProvider>{children}</AppProvider>
    </GoogleOAuthProvider>
  );
}
