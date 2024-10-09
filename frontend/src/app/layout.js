// app/layout.js
import { LayoutRender } from "@/components";
import '../global.css'

export const metadata = {
  title: 'Eventra',
  description: 'Event management portal for users and services',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="../../favicon.png" type="image/x-icon"/>
      </head>
      
      <body className="bg-zinc-100 text-black">
      <LayoutRender>{children}</LayoutRender> 
      </body>
    </html>
  );
}
