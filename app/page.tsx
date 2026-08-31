import Countdown from "@/components/Countdown";
import Snowfall from "@/components/Snowfall";

export default function Home() {
  return (
    <main className="page">
      <Snowfall />

      <div className="content">
        <Countdown />
      </div>

      <footer className="footer">
        <p>
          All times in Philippine Standard Time (UTC+8). Made for everyone who
          starts playing carols on the first of September.
        </p>
      </footer>
    </main>
  );
}
