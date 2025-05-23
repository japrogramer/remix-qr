import { Link } from "@remix-run/react";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">My QR App</div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:underline">Home</Link>
            </li>
            <li>
              <Link to="/qr" className="hover:underline">QR Generator</Link>
            </li>
            <li>
              <a href="#" className="hover:underline">About</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}