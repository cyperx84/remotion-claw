import { Composition } from "remotion";
import { Announcement } from "./Announcement.jsx";

export const AnnouncementRoot = () => (
  <Composition
    id="Announcement"
    component={Announcement}
    durationInFrames={150}
    fps={30}
    width={1080}
    height={1080}
    defaultProps={{
      title: "Big News!",
      body: "We just shipped something amazing.",
      accent: "#e94560",
      background: "#16213e",
      textColor: "#ffffff",
    }}
  />
);
