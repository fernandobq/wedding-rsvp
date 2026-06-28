export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-stone-100 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-stone-900/5">
        <p className="text-sm font-medium uppercase tracking-widest text-rose-500">
          We&apos;re getting married
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-800">
          Wedding RSVP
        </h1>
        <p className="mt-3 text-stone-600">
          Please use the personal link from your invitation to let us know if
          you can join us.
        </p>
      </div>
    </main>
  );
}
