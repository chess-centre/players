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

## Examples
### Full list

```javascript
import Fide, { Player } from './fide';

(async () => {
  const fide = new Fide();
  const players: Array<Player> = await fide.getPlayers();

  console.log(`Players: ${players.length}`);
})();
```

<p align="center">
    <img
      alt="player count"
      src="https://github.com/chess-centre/chess-players/blob/master/src/img/player-count.png"
    />
</p>

### Top players

```javascript
import Fide, { Player } from './fide';

(async () => {
  const fide = new Fide();
  const players: Array<Player> = await fide.getPlayers();

  const topTen = players
    .sort((a: Player, b: Player) => b.rating - a.rating)
    .slice(0, 10)
    .reduce(
      (players: any, player: any) => 
      [...players, { name: player.name, rating: player.rating, nationality: player.country }],
      [],
    );

  console.log(topTen);
})();
```

<p align="center">
    <img
      alt="player top ten"
      src="https://github.com/chess-centre/chess-players/blob/master/src/img/player-top-ten.png"
    />
</p>

### Specific player

```javascript
import Fide, { Player } from './fide';

(async () => {
  const fide = new Fide();
  const players: Array<Player> = await fide.getPlayers();

  const player = players.find(player => player.fideid === 418250)

  console.log(player);
})();
```

<p align="center">
    <img
      alt="player top ten"
      src="https://github.com/chess-centre/chess-players/blob/master/src/img/player.png"
    />
</p>

### Legacy lists

```javascript
import Fide, { Player, Options } from './fide';

(async () => {
  const fide = new Fide();
  const config: Options = {
    ratingType: "rapid",
    month: "jan",
    year: 2019
  }
  const players: Array<Player> = await fide.getPreviousPlayersList(config);
})();
```


### Memoized (cached API calls)

```javascript
import Fide from './fide';

(async () => {
  const fide = new Fide();
  console.time('players');
  await fide.getPlayers();
  console.timeEnd('players');

  console.time('players-memoized');
  await fide.getPlayers();
  console.timeEnd('players-memoized');
})();
```

<p align="center">
    <img
      alt="player memoized"
      src="https://github.com/chess-centre/chess-players/blob/master/src/img/player-memoized.png"
    />
</p>

### License

[MIT]('/../LICENSE)

