import type { JSX } from "ovr"

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + TS</title>
      </head>
      <body style="padding: 40px">
        <main>{children}</main>
      </body>
    </html>
  )
}
