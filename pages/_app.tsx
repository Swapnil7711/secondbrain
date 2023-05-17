import Header from "../components/global/header";
import "../styles/globals.css";
import UserContextProvider, { UserContext } from "../contexts/user-context";
import { Analytics } from '@vercel/analytics/react'
// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css";
// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css";
// used for rendering equations (optional)
import "katex/dist/katex.min.css";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Script
        id='rewardful'
        dangerouslySetInnerHTML={{
          __html: `(function(w,r){w._rwq = r;w[r]=w[r]||function(){(w[r].q = w[r].q || []).push(arguments)}})(window,'rewardful');`
        }} />
      <script async src='https://r.wdfl.co/rw.js' data-rewardful='e442b7'></script>
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
      <Analytics />
      <div id="secondbrain__snackbar"></div>
    </div>
  );
}

export default MyApp;
