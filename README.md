<p align="center">
    <img
      alt="The Chess Centre"
      src="https://github.com/Chess-Centre/welcome/blob/master/img/bcc-dark-logo.png?raw=true"
      width="100"
    />
  <p align="center">
      <a href="https://github.com/chess-centre/welcome/blob/master/LICENSE">
        <img alt="GitHub" src="https://img.shields.io/github/license/chess-centre/welcome?style=flat">
      </a>
      <img alt="CircleCI" src="https://img.shields.io/circleci/build/github/chess-centre/chess-players/master">
      <a href='https://coveralls.io/github/chess-centre/chess-players?branch=master'><img src='https://coveralls.io/repos/github/chess-centre/chess-players/badge.svg?branch=master' alt='Coverage Status' />
      </a>
  </p>
  <h1 align="center"> Chess Players </h1>
</p>
<p align="center">
  <h3 align="center"> Utility for accessing chess player data </h3>
  <p align="center"><img alt="GitHub tag (latest by date)" src="https://img.shields.io/github/v/tag/chess-centre/chess-players"></p>
</p>

## Intro

This NodeJS package is provided to help developers build applications or components which want to use the published chess player rating list data.

_Note: This information is found here at the [FIDE](https://ratings.fide.com/download_lists.phtml) website._

An example of this would be a `React` component which renders a players profile i.e., name, country, rating - where the component prop accepts the FIDE id from a REST endpoint you expose on your server.

<details>
<summary>Example React component</summary>

```javascript
import React, { useEffect, useState } from 'react';

export default const PlayerProfile = fideId => {
       
       const [player, updatePlayer] = useState({ name: '', rating: '', country: ''});
       const getPlayer = async () => updatePlayer(() => { ...await fetch(`/player/${fideId}'));
       
       useEffect(() => await getPlayer(), []);

       return (<div>
            <h1>Player Info</h1>
            <div>Name: {player.name}</div>
            <div>Rating: {player.rating}</div>
            <div>Country: {player.country}</div>
       </div>);
}
```
</details>


## Getting started

```
npm install chess-players
```
or 

```
yarn add chess-players
```


## Examples (typescript)
### Full list

```typescript
import Fide, { Player } from './fide';

(async () => {
  const fide = new Fide();
  const players: Array<Player> = await fide.getPlayers();

  console.log(`Players: ${players.length}`); // OR res.send();
})();
```

<p align="center">
    <img
      alt="player count"
      src="https://github.com/chess-centre/chess-players/blob/master/src/img/player-count.png?raw=true"
    />
</p>

### Top players

```typescript
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

  console.log(topTen); // OR res.send();
})();
```

<p align="center">
    <img
      alt="player top ten"
      src="https://github.com/chess-centre/chess-players/blob/master/src/img/player-top-ten.png?raw=true"
    />
</p>

### Specific player

```typescript
import Fide, { Player } from './fide';

(async () => {
  const fide = new Fide();
  const players: Array<Player> = await fide.getPlayers();

  const player = players.find(player => player.fideid === 418250)

  console.log(player); // OR res.send();
})();
```

<p align="center">
    <img
      alt="player top ten"
      src="https://github.com/chess-centre/chess-players/blob/master/src/img/player.png?raw=true"
    />
</p>

### Legacy lists

```typescript
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

```typescript
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
      src="https://github.com/chess-centre/chess-players/blob/master/src/img/player-memoized.png?raw=true"
    />
</p>

### License

[MIT]('/../LICENSE)

