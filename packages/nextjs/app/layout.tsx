import "@rainbow-me/rainbowkit/styles.css";
import { FILFrameAppWithProviders } from "~~/components/FILFrameAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/fil-frame/getMetadata";

export const metadata = getMetadata({
  title: "FIL-Frame App",
  description: "Built with 🏗 FIL-Frame",
});

const FILFrameApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <FILFrameAppWithProviders>{children}</FILFrameAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default FILFrameApp;
