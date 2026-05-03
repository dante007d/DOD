import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'rooms.json');

export async function saveRooms(roomsMap) {
  try {
    const data = {};
    for (const [code, room] of roomsMap.entries()) {
      data[code] = {
        state: room.state
        // Note: active timers and pending effects aren't serialized perfectly,
        // but restoring state is enough for reconnection.
      };
    }
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save room state:', err);
  }
}

export async function loadRooms() {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Failed to load room state:', err);
    }
    return {};
  }
}
