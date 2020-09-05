import Fide, { Player } from './fide';

(async () => {
  const fide = new Fide();

  const players = await fide.getPlayers();

  // example:
  const topTen = players
    .sort((a: Player, b: Player) => b.rating - a.rating)
    .slice(0, 10)
    .reduce(
      (players: any, player) => [...players, { name: player.name, rating: player.rating, nationality: player.country }],
      [],
    );

})();
