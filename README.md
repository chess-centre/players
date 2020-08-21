# Chess Players
:warning: This is a migrated repository being repurposed for the benefit of **The Chess Centre**

The original project was a simplistic chess player api, some RESTful endpoints exposing some stored fide player data in a Mongo database.

The aim of this project is to provide some simplistic data which can be exposed as numerous [AWS Lambda]() functions 

Those tasks being:

* Download and persist Fide rated player data to AWS RDS (postgres)
  * expose via lambda
  * call via aws cloudwatch (cron events)
* Download and persist ECF rated player data to AWS RDS (postgres)
  * expose via lambda
  * call via aws cloudwatch (cron events)
 
A seperate project which provides a public API for accessing this information will be written up independently and be freely available (depending on costs, this is a non-profit after all).

_**Note:** the intention is not to steal or abuse these great services, only enrich the profile data of a user of the Chess Centre._

_For example running scheduled cron jobs to attain this information regularly i.e once per month which will reduce load on these external services allowing our community to access their data within their Chess Centre profiles._

:heart: It is with love that was acknowledge these sources of information:
* FIDE rating list - https://ratings.fide.com/download_lists.phtml
* ECF grading list - http://ecfgrading.org.uk/new/menu.php


[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

