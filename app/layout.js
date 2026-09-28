import "./globals.css";

export const metadata = {
  title: "Webhook Receiver",
  description: "Public webhook receiver and realtime request inspector"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}