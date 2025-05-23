import type { MetaFunction } from "@remix-run/node";
import { useState, FormEvent } from "react";
export const meta: MetaFunction = () => {
  return [
    { title: "QR Code Generator" },
    { name: "description", content: "Generate custom QR codes!" },
  ];
};

export default function Index() {
  const [data, setData] = useState("");
  const [fillColor, setFillColor] = useState("#000000");
  const [backColor, setBackColor] = useState("#FFFFFF");
  const [qrCodeSvg, setQrCodeSvg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setQrCodeSvg("");

    try {
      const response = await fetch(`/qr?data=${encodeURIComponent(data)}&fill_color=${encodeURIComponent(fillColor)}&back_color=${encodeURIComponent(backColor)}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error generating QR code: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const svgText = await response.text();
      setQrCodeSvg(svgText);

    } catch (err: any) {
      console.error("Failed to fetch QR code:", err);
      setError(err.message || "An error occurred while generating the QR code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">QR Code Generator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Controls Column */}
        <div>
          <form onSubmit={handleSubmit} className="form-control w-full">
            <div className="mb-4">
              <label htmlFor="data" className="label">
                <span className="label-text">Data to Encode:</span>
              </label>
              <textarea

                id="data"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
                className="textarea textarea-bordered w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="fillColor" className="label">
                <span className="label-text">Fill Color:</span>
              </label>
              <input
                id="fillColor"
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="backColor" className="label">
                <span className="label-text">Background Color:</span>
              </label>
              <input
                id="backColor"
                type="color"
                value={backColor}
                onChange={(e) => setBackColor(e.target.value)}
                className="w-full"
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? "Generating..." : "Generate QR Code"}
            </button>
          </form>

          {error && (
            <div className="alert alert-error mt-4">
              <span>Error: {error}</span>
            </div>
          )}
        </div>

        {/* Result Column */}
        <div>
          {qrCodeSvg && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Generated QR Code:</h2>
                <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} className="w-full p-4 bg-white rounded-box" />
                <a
                  href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrCodeSvg)}`}
                  download="qrcode.svg"
                  className="btn btn-secondary mt-4"
                >
                  Download QR Code (SVG)
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
