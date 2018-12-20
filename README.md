# Music Manager

## Problem

If you are a passionate music collector that has been collecting for a long time, you may have trouble remembering which albums you have in your collection. This applications aims to solve that problem!

## Main users

The main users are people collecting music as a hobby or just anyone that would like to organize and have an easy overview of their albums. The application will have a simple UI that anyone will be able to use.

## Features

- Add albums
- Edit albums
- List albums
- Remove albums
- Search for a specific album
- Filter search results

## Logical model

![Logical model](/diagrams/logical-model.png)

Since a track cannot be found using only the given attributes it's modeled as a weak entity set. This is also the case for the producer. Both of these entity sets are dependent on the specific album that they are present on.

The reason for not including the producer and track attribues in the entity set **Albums** is to minimize redundancy. If we have multiple producers for an album the tuple would be duplicated and the only difference would be the producer. The same problem occures if the track attributes were included.

The relationship between **Albums** and **Tracks** is _many-many_ since an album can include any numner of tracks and a specific track can be present on multiple albums. Between **Albums** and **Producers** the relation is also _many-many_ since a producer can produce many albums and a album can have multiple producers.

## SQL design

Albums(label, device, genre, albumTtitle, band, year)
<br>
Tracks(name, length, albumTitle, band)
<br>
Producers(name, albumTitle, band)

I did not convert the relations to tables since this would cause redundancy. This is because they are a part of the weak entity sets **Producers** and **Tracks**. I did rename some of the attributes just to make it a bit clearer when combining attributes from different entities.

## SQL queries

**Get the length of an album**

SELECT SUM(length) FROM Tracks WHERE band = 'x' AND title = 'y'

