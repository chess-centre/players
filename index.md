<p align="center">
    <img
      alt="The Chess Centre"
      src="https://github.com/Chess-Centre/welcome/blob/master/img/bcc-dark-logo.png"
      width="100"
    />
  <p align="center">
      <a href="https://github.com/chess-centre/welcome/blob/master/LICENSE">
        <img alt="GitHub" src="https://img.shields.io/github/license/chess-centre/welcome?style=flat">
      </a>
  </p>
  <h1 align="center"> Chess Players </h1>
</p>
<p align="center">
  <h3 align="center"> Utility for accessing chess player data </h3>
</p>
<br />

```
(async () => {
    const fide = new Fide();
    const players = await fide.getPlayers();
    
    // now you have a full list of players!

    // example: grab top ten and format:
    const topTen = players
                    .sort((a: Player, b: Player) => b.rating - a.rating)
                    .slice(0, 10)
                    .reduce((players: any, player: Player) => 
                        [...players, 
                            { name: player.name, rating: player.rating, nationality: player.country }
                        ], []);
                        
})();
```

<p align="center">
    <img
      alt="example"
      src="https://github.com/chess-centre/chess-players/blob/refactor/rewrite-fide-download-service/src/img/example.png"
      width="752"
    />
</p>

## Memorized (cached calls)
```
import Fide, { Player } from './fide';

(async () => {
  const fide = new Fide();
  console.time('players');
  const players = await fide.getPlayers();
  console.timeEnd('players');

  console.time('players-memoized');
  await fide.getPlayers();
  console.timeEnd('players-memoized');
})();
```
