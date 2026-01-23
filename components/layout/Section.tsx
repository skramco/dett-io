export function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`w-full py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-6">
        {children}
      </div>
    </section>
  );
}
