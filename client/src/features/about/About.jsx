// pages/about.js
export default function About() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-800 rounded-lg flext flex-col items-center">
      <h1 className="text-3xl font-bold text-purple-500 mb-4">About Me</h1>
      <p className="text-gray-300 mb-4">
        Hi! I'm Laxman Singh Bisht, a full stack developer passionate about building TrendTube.
      </p>
      <h2 className="text-xl font-semibold text-white mt-6 mb-2">Why I Built This</h2>
      <p className="text-gray-300 mb-4">
        I built this YouTube clone to master full-stack development with modern tools like React, Node.js, and Tailwind CSS. As a developer obsessed with fluid UX, I wanted to recreate YouTube’s seamless video experience while adding my own twist. This project embodies my belief that great apps should be both powerful and intuitive.
      </p>
      <h2 className="text-xl font-semibold text-white mt-6 mb-2">Tech Stack</h2>
     <ul className="list-disc pl-5 text-gray-300">
        <li>Frontend: React, Tailwind CSS</li>
        <li>Backend: Node.js, Express.js</li>
        <li>Database: MongoDB with Mongoose</li>
        <li>Authentication: JWT (JSON Web Tokens), HttpOnly cookies</li>
        <li>File Uploads: Cloudinary for secure video/image hosting</li>
        <li>Deployment: Vercel (Client) & Render (Server)</li>
        <li>Version Control: Git & GitHub</li>
    </ul>

      <div className="mt-8">
        <a href="https://portfolio-jet-kappa-56.vercel.app/" className="text-purple-400 hover:underline">
          Visit my portfolio →
        </a>
      </div>
    </div>
  );
}