# Chess Players

A utility for working with Fide chess player data.

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