class RemotionClaw < Formula
  desc "Remotion video generation CLI for AI agents"
  homepage "https://github.com/cyperx84/remotion-claw"
  head "https://github.com/cyperx84/remotion-claw.git", branch: "main"
  license "MIT"

  depends_on "node"
  depends_on "ffmpeg"

  def install
    system "npm", "install", *std_npm_args
  end

  test do
    output = shell_output("#{bin}/rclaw list")
    assert_match "social-clip", output
    assert_match "announcement", output
  end
end
