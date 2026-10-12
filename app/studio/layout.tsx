export const metadata = { title: "Kutja Worx Studio", robots: { index: false, follow: false } };

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ position: "fixed", inset: 0, zIndex: 100 }}>{children}</div>;
}
