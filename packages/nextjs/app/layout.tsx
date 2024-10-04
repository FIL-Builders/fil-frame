import Providers from '@components/Providers';
import { ThemeProvider } from '@components/ThemeProvider';
import { Web3Providers } from "@components/Web3Providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider enableSystem>
          <Web3Providers>{children}</Web3Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
