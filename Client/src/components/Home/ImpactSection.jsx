import { useEffect, useState } from 'react';

const Count = ({ end, duration = 2, suffix = '' }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let rafId;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const current = end * progress;
      const display = Number.isFinite(end) && !Number.isInteger(end)
        ? Math.round(current * 10) / 10
        : Math.floor(current);
      setValue(display);
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration]);

  return <>{value}{suffix}</>;
};

const Stat = ({ end, suffix, label }) => (
  <div className="text-center">
    <h3 className="text-3xl font-bold text-foreground">
      <Count end={end} duration={2} suffix={suffix} />
    </h3>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

const ImpactSection = () => {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="glass-panel p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <Stat end={10000} suffix="+" label="Customers" />
          <Stat end={25000} suffix="+" label="Orders" />
          <Stat end={500} suffix="+" label="Products" />
          <Stat end={4.8} suffix="★" label="Rating" />
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
