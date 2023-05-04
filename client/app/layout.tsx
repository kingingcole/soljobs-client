import { EthProvider } from "./eth.context";
import "./globals.css";

export const metadata = {
  title: "SolJobs"
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html>
      <body>
        <main>
          <EthProvider>
            {children}
          </EthProvider>
        </main>
      </body>
    </html>
  );
}
