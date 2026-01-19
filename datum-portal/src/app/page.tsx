export default function Home() {
  return (
      <section className="flex flex-col items-center justify-center text-center px-6 flex-grow">
      <h1 className="text-5xl font-bold mb-6">
          Welcome to the SAEKI 3D Portal
        </h1>

        <p className="text-lg text-base-content/70 max-w-2xl mb-10">
          Welcome! Here you can easily upload your CAD files, choose your preferred material,
          and receive an instant manufacturing quote. Once you accept the offer, we immediately begin the 3D‑printing
          to bring your design to life.
        </p>

        <a href="/login" className="btn btn-primary rounded-full px-10 py-3 text-lg">
          Get Started
        </a>
      </section>
  );
}
