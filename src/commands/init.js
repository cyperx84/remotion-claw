import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, cpSync } from 'fs';
import { resolve, join } from 'path';
import { resolveTemplatesDir } from '../utils/templates.js';

export async function initCommand(dir, options) {
  const targetDir = resolve(dir || '.');
  console.log(`\n📁 Initializing Remotion project in: ${targetDir}`);

  if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });

  // Copy templates
  const templatesDir = resolveTemplatesDir();
  const targetTemplates = join(targetDir, 'templates');
  if (!existsSync(targetTemplates)) {
    cpSync(templatesDir, targetTemplates, { recursive: true });
    console.log('✅ Copied templates');
  }

  // Create remotion.config.js if missing
  const configPath = join(targetDir, 'remotion.config.js');
  if (!existsSync(configPath)) {
    writeFileSync(configPath, `import { Config } from "@remotion/cli/config";

Config.setOverwriteOutput(true);
`);
    console.log('✅ Created remotion.config.js');
  }

  // Create Root.jsx (entry point with all compositions)
  const rootPath = join(targetDir, 'src', 'Root.jsx');
  if (!existsSync(join(targetDir, 'src'))) mkdirSync(join(targetDir, 'src'), { recursive: true });
  if (!existsSync(rootPath)) {
    writeFileSync(rootPath, `import { Composition } from "remotion";
import { SocialClip } from "../templates/social-clip/SocialClip.jsx";
import { DataViz } from "../templates/data-viz/DataViz.jsx";
import { Announcement } from "../templates/announcement/Announcement.jsx";
import { ProductDemo } from "../templates/product-demo/ProductDemo.jsx";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="SocialClip"
        component={SocialClip}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ title: "Your Title", subtitle: "Your subtitle", background: "#1a1a2e" }}
      />
      <Composition
        id="DataViz"
        component={DataViz}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ title: "Data Overview", data: [40, 65, 80, 55, 90], labels: ["Mon", "Tue", "Wed", "Thu", "Fri"] }}
      />
      <Composition
        id="Announcement"
        component={Announcement}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ title: "Big News!", body: "We just shipped something amazing.", accent: "#e94560" }}
      />
      <Composition
        id="ProductDemo"
        component={ProductDemo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ title: "Product Name", features: ["Fast", "Simple", "Powerful"], tagline: "Built for builders." }}
      />
    </>
  );
};
`);
    console.log('✅ Created src/Root.jsx');
  }

  // Create index.js entry point
  const indexPath = join(targetDir, 'src', 'index.js');
  if (!existsSync(indexPath)) {
    writeFileSync(indexPath, `import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root.jsx";
registerRoot(RemotionRoot);
`);
    console.log('✅ Created src/index.js');
  }

  console.log(`\n🎬 Project ready! Next steps:`);
  console.log(`  cd ${targetDir}`);
  console.log(`  npm install`);
  console.log(`  rclaw list`);
  console.log(`  rclaw create "hello world announcement"`);
  console.log(`  npx remotion preview src/index.js`);
}
