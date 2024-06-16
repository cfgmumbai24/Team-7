"use client";
import Navbar from "./components/Navbar";
import "./globals.css";
import { AuthContextProvider } from "./context/AuthContext.mjs";
import Script from "next/script";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const initBotpress = () => {
    (window as any).botpressWebChat.init({
      "composerPlaceholder": "Say Hi!",
      "botConversationDescription": "Multiply India is here to help!",
      "botId": "",
      "hostUrl": "https://cdn.botpress.cloud/webchat/v1",
      "messagingUrl": "https://messaging.botpress.cloud",
      "clientId": "",
      "webhookId": "54c1eafd-245f-48fc-9213-6567afa672d4",
      "lazySocket": true,
      "themeName": "prism",
      "frontendVersion": "v1",
      "useSessionStorage": true,
      "enableConversationDeletion": true,
      "showPoweredBy": false,
      "theme": "prism",
      "themeColor": "#2563eb",
      "allowedOrigins": []
    });
  };
  return (
    <html lang="en">
      <Script
          src="https://cdn.botpress.cloud/webchat/v0/inject.js"
          onLoad={() => {
            initBotpress();
      }}
      />
      <body className="bg-gray-900">
        <AuthContextProvider>
          <Navbar />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}