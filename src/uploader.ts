import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs/promises';
import Fide, { Player } from './fide';

const supabase = createClient(process.env.SUPABASE_CLIENT_URL || '', process.env.SUPABASE_CLIENT_ID || '');
const cliProgress = require('cli-progress');
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const createPlayerFile = async () => {
  const fide = new Fide();
  const players = await fide.getPlayers();
  console.log('🏃‍♂️ Validating player list.');
  progressBar.start(players.length, 0);
  const list: Array<Player> = players.reduce((list: Array<Player>, p: Player, index: number) => {
    const player: Player = {
      fideid: Number(p?.fideid || 0),
      name: p.name,
      country: p?.country || '',
      sex: p?.sex || '',
      title: p?.title || '',
      w_title: p?.w_title || '',
      o_title: p?.o_title || '',
      foa_title: p?.foa_title || '',
      rating: Number(p?.rating || 0),
      games: Number(p?.games || 0),
      birthday: Number(p?.birthday || 0),
      k: Number(p?.k || 0),
    };

    progressBar.update(index + 1);
    if (player.rating && player?.rating > 1200) {
      return [...list, player];
    } else {
      return list;
    }
  }, []);
  progressBar.stop();
  console.log('🏁 Validation complete.');
  console.log('⚟ Filtered list of players', list.length);
  await write(JSON.stringify(list.sort((a, b) => Number(b?.rating) - Number(a?.rating))));
};

const write = async (content: string) => {
  try {
    await fs.writeFile('./players.json', content);
    console.log('✅ File Creation Complete 💾');
  } catch (err) {
    console.log(err);
  }
};

const updatePlayers = async (list: Array<Player>) => {
  const { error } = await supabase.from('players').insert(list);
  if (error) {
    console.log('|=================== ERROR ===================|');
    console.log(list);
    console.log('|===================  END  ===================|');
  }
};

const batchProcess = async (items: Array<Player>, batchSize: number, callback: Function) => {
  const numBatches = Math.ceil(items.length / batchSize);
  progressBar.start(numBatches, 0);

  for (let i = 0; i < numBatches; i++) {
    const startIndex = i * batchSize;
    const endIndex = Math.min(startIndex + batchSize, items.length);
    const batch = items.slice(startIndex, endIndex);
    await callback(batch);
    progressBar.update(i + 1);
  }
  progressBar.stop();
};

const init = async (batchSize: number = 2000) => {
  await createPlayerFile();
  batchProcess(require('../players.json'), batchSize, updatePlayers);
};

export default init;