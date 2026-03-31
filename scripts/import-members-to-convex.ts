import { randomUUID } from 'node:crypto';
import { config as loadEnv } from 'dotenv';
import { loadMembersFromCsv } from '../src/lib/members.js';
import { replaceMembersSnapshot } from '../src/lib/members-storage.js';

loadEnv({ path: '.env.local', override: false });
loadEnv({ path: '.env', override: false });

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const members = await loadMembersFromCsv();
  const importId = randomUUID();
  const createdAt = new Date().toISOString();

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          mode: 'dry-run',
          importId,
          createdAt,
          rowCount: members.length,
          preview: members.slice(0, 5),
        },
        null,
        2,
      ),
    );
    return;
  }

  await replaceMembersSnapshot(
    {
      externalId: importId,
      source: 'data/members.csv',
      createdAt,
      rowCount: members.length,
      isActive: true,
      status: 'completed',
    },
    members,
  );

  console.log(`Imported ${members.length} member rows into Convex snapshot ${importId}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
