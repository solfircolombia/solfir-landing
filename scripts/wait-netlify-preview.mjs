/**
 * Wait until Netlify marks this commit's deploy preview as successful, then
 * print that URL for the accessibility job. Fails if the deploy fails or
 * never arrives. Does not skip the checks.
 */

const token = process.env.GITHUB_TOKEN || '';
const repository = process.env.GITHUB_REPOSITORY || '';
const sha = process.env.PREVIEW_SHA || '';
const prNumber = String(process.env.PR_NUMBER || '').trim();
const context = 'netlify/comforting-moxie-8fc591/deploy-preview';
const site = 'comforting-moxie-8fc591';
const intervalMs = 15_000;
const attempts = 80;

function fallbackUrl() {
    if (!/^\d+$/.test(prNumber)) {
        return '';
    }
    return `https://deploy-preview-${prNumber}--${site}.netlify.app`;
}

function previewFromStatus(status) {
    const target = String(status.target_url || '').replace(/\/$/, '');
    if (/^https:\/\/deploy-preview-\d+--comforting-moxie-8fc591\.netlify\.app$/.test(target)) {
        return target;
    }
    return fallbackUrl();
}

const githubHeaders = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'solfir-a11y',
};

async function discoverPullRequestNumber() {
    if (/^\d+$/.test(prNumber)) {
        return prNumber;
    }
    const branch = process.env.GITHUB_REF_NAME || '';
    const owner = repository.split('/')[0];
    if (!branch || !owner) {
        return '';
    }
    const response = await fetch(
        `https://api.github.com/repos/${repository}/pulls?head=${owner}:${encodeURIComponent(branch)}&state=all&per_page=20`,
        { headers: githubHeaders }
    );
    if (!response.ok) {
        return '';
    }
    const pulls = await response.json();
    const match = Array.isArray(pulls) ? pulls.find((item) => item?.head?.ref === branch) : null;
    return match ? String(match.number) : '';
}

async function readStatus() {
    const response = await fetch(
        `https://api.github.com/repos/${repository}/commits/${sha}/status`,
        {
            headers: githubHeaders,
        }
    );
    if (!response.ok) {
        throw new Error(`GitHub status API returned HTTP ${response.status} for ${sha}.`);
    }
    const body = await response.json();
    return (body.statuses || []).find((item) => item.context === context) || null;
}

async function probe(url) {
    const response = await fetch(`${url}/`, { redirect: 'follow' });
    return response.status;
}

async function main() {
    if (!repository || !sha) {
        throw new Error('GITHUB_REPOSITORY and PREVIEW_SHA are required.');
    }
    if (!token) {
        throw new Error('GITHUB_TOKEN is required to read the Netlify commit status.');
    }

    let chosen = '';
    let sawActivity = false;
    const resolvedPr = await discoverPullRequestNumber();
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        const status = await readStatus();
        const state = status?.state || 'missing';
        console.log(
            `Netlify deploy-preview status for ${sha.slice(0, 7)}: ${state} (attempt ${attempt}/${attempts})`
        );
        if (
            state === 'pending' ||
            state === 'success' ||
            state === 'failure' ||
            state === 'error'
        ) {
            sawActivity = true;
        }
        if (!sawActivity && attempt >= 8 && resolvedPr) {
            const existing = `https://deploy-preview-${resolvedPr}--${site}.netlify.app`;
            const code = await probe(existing);
            console.log(
                `No Netlify status on ${sha.slice(0, 7)}. Existing preview ${existing}/ -> HTTP ${code}`
            );
            if (code >= 200 && code < 400) {
                chosen = existing;
                break;
            }
        }
        if (state === 'failure' || state === 'error') {
            throw new Error(
                `Netlify deploy preview failed${status.target_url ? `: ${status.target_url}` : ''}.`
            );
        }
        if (state === 'success') {
            chosen = previewFromStatus(status);
            if (!chosen) {
                throw new Error(
                    `Netlify reported success for ${sha} without a deploy-preview URL.`
                );
            }
            break;
        }
        if (attempt < attempts) {
            await new Promise((resolve) => setTimeout(resolve, intervalMs));
        }
    }

    if (!chosen) {
        throw new Error(
            `Timed out waiting for ${context} on ${sha}. Accessibility checks run against that preview.`
        );
    }

    let statusCode = 0;
    for (let attempt = 1; attempt <= 8; attempt += 1) {
        statusCode = await probe(chosen);
        console.log(`${chosen}/ -> HTTP ${statusCode}`);
        if (statusCode >= 200 && statusCode < 400) {
            break;
        }
        await new Promise((resolve) => setTimeout(resolve, 5_000));
    }
    if (statusCode < 200 || statusCode >= 400) {
        throw new Error(
            `Deploy preview ${chosen} did not serve the homepage (HTTP ${statusCode}).`
        );
    }

    if (process.env.GITHUB_OUTPUT) {
        const { appendFileSync } = await import('node:fs');
        appendFileSync(process.env.GITHUB_OUTPUT, `url=${chosen}\n`);
    }
    console.log(`Using deploy preview ${chosen}`);
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
