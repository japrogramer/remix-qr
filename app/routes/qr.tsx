import type { LoaderFunctionArgs } from "@remix-run/node";
import QRCode from 'qrcode';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const data = url.searchParams.get("data");
  const fill_color = url.searchParams.get("fill_color") || "black";
  const back_color = url.searchParams.get("back_color") || "white";

  if (!data) {
    return new Response("Data parameter is required.", { status: 400 });
  }

  try {
    // Generate QR code as SVG
    const svg = await QRCode.toString(data, {
      type: 'svg',
      color: {
        dark: fill_color,
        light: back_color
      },
      errorCorrectionLevel: 'H' // High error correction for potential embellishments
    });

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
      },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return new Response("Error generating QR code.", { status: 500 });
  }
}
