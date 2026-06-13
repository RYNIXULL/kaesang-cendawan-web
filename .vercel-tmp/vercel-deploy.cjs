#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const isWindows = os.platform() === 'win32';
function log(msg) { console.error(msg); }
function parseArgs(args) {
  const result = { projectPath: '.', prod: true, yes: false, skipBuild: false };
  for (const arg of args) {
    if (arg === '--prod') result.prod = true;
    else if (arg === '--yes' || arg === '-y') result.yes = true;
    else if (arg === '--skip-build') result.skipBuild = true;
    else if (!arg.startsWith('-')) result.projectPath = arg;
  }
  return result;
}
function detectPackageManager(projectPath) {
  if (fs.existsSync(path.join(projectPath, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(projectPath, 'yarn.lock'))) return 'yarn';
  return 'npm';
}
function runBuild(projectPath) {
  const pkgPath = path.join(projectPath, 'package.json');
  if (!fs.existsSync(pkgPath)) return true;
  let pkg;
  try { pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')); } catch { return true; }
  if (!pkg.scripts || !pkg.scripts.build) { log('No build script, skipping'); return true; }
  const pm = detectPackageManager(projectPath);
  log(`\nRunning build with ${pm}...\n`);
  const buildArgs = pm === 'npm' ? ['run', 'build'] : ['build'];
  const result = spawnSync(pm, buildArgs, { cwd: projectPath, stdio: 'inherit', shell: isWindows });
  if (result.status !== 0) { log('Build FAILED!'); process.exit(1); }
  log('\nBuild completed successfully!\n');
  return true;
}
function doDeploy(projectPath, options) {
  log('Starting deployment...\n');
  const args = [];
  if (options.yes) args.push('--yes');
  if (options.prod) args.push('--prod');
  log(`Environment: ${options.prod ? 'Production' : 'Preview'}`);
  log(`Command: vercel ${args.join(' ')}\n`);
  const result = spawnSync('vercel', args, {
    cwd: projectPath, encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'pipe'],
    timeout: 300000, shell: isWindows
  });
  const output = (result.stdout || '') + (result.stderr || '');
  log(output);
  if (result.status !== 0) { log('Deployment failed!'); process.exit(1); }
  const aliasedMatch = output.match(/Aliased:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
  const prodMatch = output.match(/Production:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
  const urlMatch = output.match(/(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/);
  const finalUrl = (aliasedMatch && aliasedMatch[1]) || (prodMatch && prodMatch[1]) || (urlMatch && urlMatch[1]);
  log('\n========================================');
  log('Deployment successful!');
  log('========================================\n');
  if (finalUrl) log(`Live at: ${finalUrl}\n`);
  console.log(JSON.stringify({ status: 'success', url: finalUrl || 'unknown' }));
}
function main() {
  log('========================================');
  log('Vercel CLI Project Deployment');
  log('========================================\n');
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  const projectPath = path.resolve(options.projectPath);
  log(`Project: ${projectPath}`);
  if (!options.skipBuild) runBuild(projectPath);
  doDeploy(projectPath, options);
}
main();
