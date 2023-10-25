import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { useEffect } from "react";
import { redirectUrl } from "./utils";

const baidu = async () => {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?4668119c12746d0d0def8951fac0792e";
  var s: any = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
}

export default function App() {
  useEffect(() => {
    baidu();
    redirectUrl(window.location.href);
  }, [])
  return (
    <html lang="zh">
      <head>
        <Meta />
        <meta httpEquiv="cleartype" content="on" />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <script crossOrigin="anonymous" integrity="sha512-xQBQYt9UcgblF6aCMrwU1NkVA7HCXaSN2oq0so80KO+y68M+n64FOcqgav4igHe6D5ObBLIf68DWv+gfBowczg==" src="https://lib.baomitu.com/jszip/3.7.1/jszip.min.js"></script>
        <script crossOrigin="anonymous" integrity="sha384-sLhugvyb7QXT38D573of73nmwbSPlCWTaRKJfuBgGCyoWijHVim5MtXquZN4VU0+" src="https://lib.baomitu.com/jszip-utils/0.1.0/jszip-utils.min.js"></script>
        <script crossOrigin="anonymous" src="https://fastly.jsdelivr.net/npm/svgaplayerweb@2.3.2/build/svga.min.js"></script>
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <html>
      <head>
        <title>错误</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>页面发生错误</h1>
        <Scripts />
      </body>
    </html>
  );
}