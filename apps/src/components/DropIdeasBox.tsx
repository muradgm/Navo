import '../styles/routePlanner.css';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function DropIdeasBox({ value, onChange }: Props) {
  return (
    <section className="planner-card drop-ideas">
      <div className="section-heading">
        <p className="eyebrow">Import chaos</p>
        <h2>Drop scattered ideas</h2>
        <p>Paste Google Maps links, TikTok notes, hotel tips, or your own rough list. This is the future input layer.</p>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Example: Rhine walk, Toy Museum, Basel Paper Mill, somewhere for lunch, playground near the river..."
      />
      <p className="drop-ideas__hint">MVP note: this box stores raw ideas now. Later it should parse links and match them to real places.</p>
    </section>
  );
}
