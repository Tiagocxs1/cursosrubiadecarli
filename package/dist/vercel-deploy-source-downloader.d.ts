#!/usr/bin/env node
/**
 * Download source files from Vercel deployment.
 *
 * Run with no arguments for interactive setup, or configure via CLI/env/.env.
 *
 * Usage:
 *   npx vercel-deploy-source-downloader [token] [options]
 *
 * Options:
 *   --deployment <id>    Deployment ID, with or without dpl_ prefix (default: latest)
 *   --project <name>     Project name (default: auto-detect from deployment)
 *   --team <slug|id>     Team slug or ID (default: auto-detect from deployment)
 *   --output <path>      Output directory path (default: ./out)
 *   --verbose            Show detailed progress for each file
 *   --retry-failed       Re-download only files that failed in a previous run
 *
 * Get your token from: https://vercel.com/account/tokens
 * Find deployment ID from: https://vercel.com/{scope}/{project}/{id}/source
 */
export {};
//# sourceMappingURL=vercel-deploy-source-downloader.d.ts.map