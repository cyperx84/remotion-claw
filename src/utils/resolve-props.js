import { readFileSync, existsSync } from 'fs';

/**
 * Resolve props from CLI options — supports inline JSON or file path.
 */
export function resolveProps(options) {
  if (options.propsFile) {
    if (!existsSync(options.propsFile)) {
      throw new Error(`Props file not found: ${options.propsFile}`);
    }
    return JSON.parse(readFileSync(options.propsFile, 'utf8'));
  }
  if (options.props) {
    return JSON.parse(options.props);
  }
  return {};
}
