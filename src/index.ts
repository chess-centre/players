import Fide, { Player } from './fide';

(async () => {
  const fide = new Fide();
  console.time('players');
  const players = await fide.getPlayers();
  console.timeEnd('players');

  // Now you have a list of players, in JSON!

  // example:
  const topTen = players
    .sort((a: Player, b: Player) => b.rating - a.rating)
    .slice(0, 10)
    .reduce(
      (players: any, player) => [...players, { name: player.name, rating: player.rating, nationality: player.country }],
      [],
    );

  console.log(topTen);

  // `getPlayers` is memoized
  console.time('players-memoized');
  await fide.getPlayers();
  console.timeEnd('players-memoized');
})();
